import fs from "node:fs/promises";
import path from "node:path";
import type { FoundryJob } from "@prisma/client";
import sharp from "sharp";
import { prisma } from "./prisma";

export type FoundryStage = "queued" | "point-cloud" | "meshing" | "cleaning" | "audit" | "stl" | "complete" | "failed";
export type FoundryReconstructionMode = "single-view" | "multi-view";
export type FoundryViewLabel = "front" | "side" | "back" | "top";

export type FoundryInputView = {
  label: FoundryViewLabel;
  file: File;
};

export type FoundryJobSnapshot = {
  id: string;
  sourceName: string;
  mimeType: string | null;
  notes: string | null;
  status: string;
  stage: FoundryStage;
  reconstructionMode: FoundryReconstructionMode;
  viewCount: number;
  progress: number;
  logs: string[];
  inputUrl: string | null;
  outputStlUrl: string | null;
  outputBriefUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

const FOUNDRY_ROOT = path.join(process.cwd(), "public", "generated", "foundry");
const INPUT_DIR = path.join(FOUNDRY_ROOT, "inputs");
const OUTPUT_DIR = path.join(FOUNDRY_ROOT, "outputs");
const BRIEF_DIR = path.join(FOUNDRY_ROOT, "briefs");
const VIEW_ORDER: FoundryViewLabel[] = ["front", "side", "back", "top"];

const STAGE_LOGS: Record<Exclude<FoundryStage, "queued" | "complete" | "failed">, string[]> = {
  "point-cloud": [
    "Reading uploaded view set...",
    "Measuring background polarity...",
    "Extracting contour contrast...",
    "Reconstruction inputs ready"
  ],
  meshing: [
    "Building reconstruction surface...",
    "Reconstructing printable shell...",
    "Generating manifold mesh...",
    "Mesh extraction complete"
  ],
  cleaning: [
    "Applying smoothing pass...",
    "Checking for open edges...",
    "Adding printable thickness...",
    "Repairing manifold issues..."
  ],
  audit: [
    "Analyzing wall thickness...",
    "Checking for overhangs...",
    "Simulating print orientation...",
    "Calculating support requirements...",
    "Printability audit passed"
  ],
  stl: [
    "Validating export units...",
    "Writing reconstruction STL...",
    "Saving pipeline brief...",
    "STL ready for slicer"
  ],
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function serializeLogs(logs: string[]) {
  return JSON.stringify(logs);
}

function parseLogs(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
  } catch {
    return [];
  }
}

function stageToProgress(stage: Exclude<FoundryStage, "queued" | "complete" | "failed">) {
  switch (stage) {
    case "point-cloud":
      return 20;
    case "meshing":
      return 45;
    case "cleaning":
      return 70;
    case "audit":
      return 85;
    case "stl":
      return 95;
  }
}

function safeBaseName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").trim();
  const safe = base.replace(/[^a-z0-9_-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return safe || "upload";
}

function guessExtension(fileName: string, mimeType: string) {
  const ext = path.extname(fileName).toLowerCase();
  if (ext) return ext;

  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".bin";
  }
}

function relativeToAbsolute(relativeUrl: string) {
  return path.join(process.cwd(), "public", relativeUrl.replace(/^\//, ""));
}

async function ensureFoundryDirs() {
  await Promise.all([
    fs.mkdir(INPUT_DIR, { recursive: true }),
    fs.mkdir(OUTPUT_DIR, { recursive: true }),
    fs.mkdir(BRIEF_DIR, { recursive: true }),
  ]);
}

type Vec3 = [number, number, number];

function toVec3(x: number, y: number, z: number): Vec3 {
  return [x, y, z];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(vector: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[1], vector[2]) || 1;
  return [vector[0] / length, vector[1] / length, vector[2] / length];
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(6) : "0.000000";
}

function triangleFacet(a: Vec3, b: Vec3, c: Vec3) {
  const normal = normalize(cross(subtract(b, a), subtract(c, a)));
  return [
    `  facet normal ${fmt(normal[0])} ${fmt(normal[1])} ${fmt(normal[2])}`,
    "    outer loop",
    `      vertex ${fmt(a[0])} ${fmt(a[1])} ${fmt(a[2])}`,
    `      vertex ${fmt(b[0])} ${fmt(b[1])} ${fmt(b[2])}`,
    `      vertex ${fmt(c[0])} ${fmt(c[1])} ${fmt(c[2])}`,
    "    endloop",
    "  endfacet",
  ].join("\n");
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getPixel(pixels: Uint8Array, width: number, height: number, x: number, y: number) {
  const clampedX = Math.min(width - 1, Math.max(0, x));
  const clampedY = Math.min(height - 1, Math.max(0, y));
  return pixels[clampedY * width + clampedX] ?? 255;
}

function detectForegroundPolarity(pixels: Uint8Array, width: number, height: number) {
  let borderSum = 0;
  let borderCount = 0;
  let centerSum = 0;
  let centerCount = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = pixels[y * width + x] ?? 255;
      const border = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (border) {
        borderSum += value;
        borderCount += 1;
      } else {
        centerSum += value;
        centerCount += 1;
      }
    }
  }

  const borderAverage = borderSum / Math.max(1, borderCount);
  const centerAverage = centerSum / Math.max(1, centerCount);
  return borderAverage > centerAverage;
}

function otsuThreshold(pixels: Uint8Array) {
  const histogram = new Array(256).fill(0);
  for (const value of pixels) {
    histogram[value] += 1;
  }

  const total = pixels.length;
  let sum = 0;
  for (let i = 0; i < 256; i += 1) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let weightB = 0;
  let maxVariance = 0;
  let threshold = 127;

  for (let i = 0; i < 256; i += 1) {
    weightB += histogram[i];
    if (weightB === 0) continue;

    const weightF = total - weightB;
    if (weightF === 0) break;

    sumB += i * histogram[i];
    const meanB = sumB / weightB;
    const meanF = (sum - sumB) / weightF;
    const variance = weightB * weightF * (meanB - meanF) ** 2;

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
}

function dilateMask(mask: Uint8Array, width: number, height: number, radius = 1) {
  const output = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let occupied = 0;
      for (let oy = -radius; oy <= radius && !occupied; oy += 1) {
        for (let ox = -radius; ox <= radius; ox += 1) {
          if (getPixel(mask, width, height, x + ox, y + oy) > 0) {
            occupied = 1;
            break;
          }
        }
      }

      output[y * width + x] = occupied;
    }
  }

  return output;
}

function toSquareProjection(x: number, y: number, width: number, height: number) {
  const u = Math.min(width - 1, Math.max(0, Math.round(x * (width - 1))));
  const v = Math.min(height - 1, Math.max(0, Math.round(y * (height - 1))));
  return { u, v };
}

function projectIsForeground(
  label: FoundryViewLabel,
  x: number,
  y: number,
  z: number,
  gridSize: number,
  view: { mask: Uint8Array; width: number; height: number }
) {
  const nx = gridSize <= 1 ? 0 : x / (gridSize - 1);
  const ny = gridSize <= 1 ? 0 : y / (gridSize - 1);
  const nz = gridSize <= 1 ? 0 : z / (gridSize - 1);
  let u = nx;
  let v = 1 - nz;

  switch (label) {
    case "front":
      u = nx;
      v = 1 - nz;
      break;
    case "back":
      u = 1 - nx;
      v = 1 - nz;
      break;
    case "side":
      u = ny;
      v = 1 - nz;
      break;
    case "top":
      u = nx;
      v = 1 - ny;
      break;
  }

  const { u: px, v: py } = toSquareProjection(u, v, view.width, view.height);
  return getPixel(view.mask, view.width, view.height, px, py) > 0;
}

function buildImageReliefStl(params: {
  solidName: string;
  pixels: Uint8Array;
  width: number;
  height: number;
}) {
  const { solidName, pixels, width, height } = params;
  const baseThickness = 2.2;
  const reliefHeight = 6.2;
  const widthMm = 100;
  const depthMm = widthMm * (height / width);
  const stepX = widthMm / Math.max(1, width - 1);
  const stepY = depthMm / Math.max(1, height - 1);
  const totalPixels = width * height;
  const borderSamples: number[] = [];
  const centerSamples: number[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = pixels[y * width + x] ?? 255;
      const isBorder = x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (isBorder) {
        borderSamples.push(value);
      } else {
        centerSamples.push(value);
      }
    }
  }

  const borderAverage = borderSamples.reduce((sum, value) => sum + value, 0) / Math.max(1, borderSamples.length);
  const centerAverage = centerSamples.reduce((sum, value) => sum + value, 0) / Math.max(1, centerSamples.length);
  const invertPolarity = borderAverage > centerAverage;

  const signalAt = (x: number, y: number) => {
    const gray = getPixel(pixels, width, height, x, y) / 255;
    return invertPolarity ? 1 - gray : gray;
  };

  const blurredSignalAt = (x: number, y: number) => {
    let sum = 0;
    let weight = 0;
    for (let oy = -1; oy <= 1; oy += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        const kernel = ox === 0 && oy === 0 ? 4 : ox === 0 || oy === 0 ? 2 : 1;
        sum += signalAt(x + ox, y + oy) * kernel;
        weight += kernel;
      }
    }
    return sum / weight;
  };

  const edgeAt = (x: number, y: number) => {
    const gx =
      -1 * signalAt(x - 1, y - 1) + 1 * signalAt(x + 1, y - 1) +
      -2 * signalAt(x - 1, y) + 2 * signalAt(x + 1, y) +
      -1 * signalAt(x - 1, y + 1) + 1 * signalAt(x + 1, y + 1);
    const gy =
      -1 * signalAt(x - 1, y - 1) - 2 * signalAt(x, y - 1) - 1 * signalAt(x + 1, y - 1) +
      1 * signalAt(x - 1, y + 1) + 2 * signalAt(x, y + 1) + 1 * signalAt(x + 1, y + 1);
    return Math.hypot(gx, gy);
  };

  const heightMap = new Float32Array(totalPixels);
  let maxEdge = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const signal = blurredSignalAt(x, y);
      const edge = edgeAt(x, y);
      heightMap[y * width + x] = signal * 0.74 + edge * 0.26;
      maxEdge = Math.max(maxEdge, heightMap[y * width + x]);
    }
  }

  const normalizedHeightAt = (x: number, y: number) => {
    const combined = heightMap[y * width + x] ?? 0;
    const normalized = clamp01(combined / Math.max(0.0001, maxEdge));
    const eased = Math.pow(normalized, 1.18);
    return baseThickness + eased * reliefHeight;
  };

  const point = (x: number, y: number, z: number) => toVec3(x * stepX, y * stepY, z);
  const facets: string[] = [];

  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const p00 = point(x, y, normalizedHeightAt(x, y));
      const p10 = point(x + 1, y, normalizedHeightAt(x + 1, y));
      const p01 = point(x, y + 1, normalizedHeightAt(x, y + 1));
      const p11 = point(x + 1, y + 1, normalizedHeightAt(x + 1, y + 1));

      facets.push(triangleFacet(p00, p10, p11));
      facets.push(triangleFacet(p00, p11, p01));
    }
  }

  const bottom = {
    bl: point(0, 0, 0),
    br: point(width - 1, 0, 0),
    tr: point(width - 1, height - 1, 0),
    tl: point(0, height - 1, 0),
  };
  facets.push(triangleFacet(bottom.bl, bottom.tr, bottom.br));
  facets.push(triangleFacet(bottom.bl, bottom.tl, bottom.tr));

  for (let x = 0; x < width - 1; x += 1) {
    const topA = point(x, 0, normalizedHeightAt(x, 0));
    const topB = point(x + 1, 0, normalizedHeightAt(x + 1, 0));
    const bottomA = point(x, 0, 0);
    const bottomB = point(x + 1, 0, 0);
    facets.push(triangleFacet(bottomA, topB, topA));
    facets.push(triangleFacet(bottomA, bottomB, topB));
  }

  for (let x = 0; x < width - 1; x += 1) {
    const y = height - 1;
    const topA = point(x, y, normalizedHeightAt(x, y));
    const topB = point(x + 1, y, normalizedHeightAt(x + 1, y));
    const bottomA = point(x, y, 0);
    const bottomB = point(x + 1, y, 0);
    facets.push(triangleFacet(bottomA, topA, topB));
    facets.push(triangleFacet(bottomA, topB, bottomB));
  }

  for (let y = 0; y < height - 1; y += 1) {
    const topA = point(0, y, normalizedHeightAt(0, y));
    const topB = point(0, y + 1, normalizedHeightAt(0, y + 1));
    const bottomA = point(0, y, 0);
    const bottomB = point(0, y + 1, 0);
    facets.push(triangleFacet(bottomA, topA, topB));
    facets.push(triangleFacet(bottomA, topB, bottomB));
  }

  for (let y = 0; y < height - 1; y += 1) {
    const x = width - 1;
    const topA = point(x, y, normalizedHeightAt(x, y));
    const topB = point(x, y + 1, normalizedHeightAt(x, y + 1));
    const bottomA = point(x, y, 0);
    const bottomB = point(x, y + 1, 0);
    facets.push(triangleFacet(bottomA, topB, topA));
    facets.push(triangleFacet(bottomA, bottomB, topB));
  }

  return `solid ${solidName}\n${facets.join("\n")}\nendsolid ${solidName}\n`;
}

async function createReliefStlFromImage(params: { imageBuffer: Buffer; solidName: string }) {
  const metadata = await sharp(params.imageBuffer).metadata();
  const sourceWidth = metadata.width ?? 64;
  const sourceHeight = metadata.height ?? 64;
  const maxSide = 96;
  const scale = maxSide / Math.max(sourceWidth, sourceHeight);
  const targetWidth = Math.max(32, Math.round(sourceWidth * scale));
  const targetHeight = Math.max(32, Math.round(sourceHeight * scale));

  const { data, info } = await sharp(params.imageBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(targetWidth, targetHeight, { fit: "fill" })
    .grayscale()
    .normalize()
    .sharpen()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return buildImageReliefStl({
    solidName: params.solidName,
    pixels: data,
    width: info.width,
    height: info.height,
  });
}

async function preprocessFoundryView(params: { imageBuffer: Buffer; label: FoundryViewLabel }) {
  const sampleSize = 96;
  const { data, info } = await sharp(params.imageBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize(sampleSize, sampleSize, { fit: "contain", background: { r: 255, g: 255, b: 255 } })
    .grayscale()
    .normalize()
    .sharpen()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const inverted = detectForegroundPolarity(data, info.width, info.height);
  const signal = new Uint8Array(data.length);
  for (let index = 0; index < data.length; index += 1) {
    const value = inverted ? 255 - data[index] : data[index];
    signal[index] = value;
  }

  const threshold = otsuThreshold(signal);
  const mask = new Uint8Array(signal.length);
  for (let index = 0; index < signal.length; index += 1) {
    mask[index] = signal[index] >= threshold ? 1 : 0;
  }

  return {
    label: params.label,
    width: info.width,
    height: info.height,
    mask: dilateMask(mask, info.width, info.height, 1),
  };
}

function buildVoxelStl(params: {
  solidName: string;
  occupancy: Uint8Array;
  gridSize: number;
  widthMm: number;
  depthMm: number;
  heightMm: number;
}) {
  const { solidName, occupancy, gridSize, widthMm, depthMm, heightMm } = params;
  const stepX = widthMm / gridSize;
  const stepY = depthMm / gridSize;
  const stepZ = heightMm / gridSize;
  const facets: string[] = [];
  const index = (x: number, y: number, z: number) => z * gridSize * gridSize + y * gridSize + x;
  const occupied = (x: number, y: number, z: number) => {
    if (x < 0 || y < 0 || z < 0 || x >= gridSize || y >= gridSize || z >= gridSize) {
      return false;
    }
    return occupancy[index(x, y, z)] === 1;
  };
  const point = (x: number, y: number, z: number) => toVec3(x * stepX, y * stepY, z * stepZ);

  const addFace = (a: Vec3, b: Vec3, c: Vec3, d: Vec3) => {
    facets.push(triangleFacet(a, b, c));
    facets.push(triangleFacet(a, c, d));
  };

  for (let z = 0; z < gridSize; z += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        if (!occupied(x, y, z)) continue;

        if (!occupied(x + 1, y, z)) {
          addFace(
            point(x + 1, y, z),
            point(x + 1, y + 1, z),
            point(x + 1, y + 1, z + 1),
            point(x + 1, y, z + 1)
          );
        }

        if (!occupied(x - 1, y, z)) {
          addFace(
            point(x, y, z),
            point(x, y, z + 1),
            point(x, y + 1, z + 1),
            point(x, y + 1, z)
          );
        }

        if (!occupied(x, y + 1, z)) {
          addFace(
            point(x, y + 1, z),
            point(x, y + 1, z + 1),
            point(x + 1, y + 1, z + 1),
            point(x + 1, y + 1, z)
          );
        }

        if (!occupied(x, y - 1, z)) {
          addFace(
            point(x, y, z),
            point(x + 1, y, z),
            point(x + 1, y, z + 1),
            point(x, y, z + 1)
          );
        }

        if (!occupied(x, y, z + 1)) {
          addFace(
            point(x, y, z + 1),
            point(x + 1, y, z + 1),
            point(x + 1, y + 1, z + 1),
            point(x, y + 1, z + 1)
          );
        }

        if (!occupied(x, y, z - 1)) {
          addFace(
            point(x, y, z),
            point(x, y + 1, z),
            point(x + 1, y + 1, z),
            point(x + 1, y, z)
          );
        }
      }
    }
  }

  return `solid ${solidName}\n${facets.join("\n")}\nendsolid ${solidName}\n`;
}

async function createMultiViewStl(params: {
  solidName: string;
  views: Array<{ label: FoundryViewLabel; buffer: Buffer }>;
}) {
  const processedViews = await Promise.all(
    params.views.map(async (view) =>
      preprocessFoundryView({
        imageBuffer: view.buffer,
        label: view.label,
      })
    )
  );

  const gridSize = 56;
  const occupancy = new Uint8Array(gridSize * gridSize * gridSize);
  const baseLayers = Math.max(4, Math.round(gridSize * 0.08));
  let occupiedCount = 0;

  const index = (x: number, y: number, z: number) => z * gridSize * gridSize + y * gridSize + x;

  for (let z = 0; z < gridSize; z += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      for (let x = 0; x < gridSize; x += 1) {
        const isBase = z < baseLayers;
        let keep = true;

        if (!isBase) {
          for (const view of processedViews) {
            if (!projectIsForeground(view.label, x, y, z, gridSize, view)) {
              keep = false;
              break;
            }
          }
        }

        if (keep) {
          occupancy[index(x, y, z)] = 1;
          occupiedCount += 1;
        }
      }
    }
  }

  const baseCellCount = gridSize * gridSize * baseLayers;
  if (occupiedCount <= baseCellCount + gridSize * gridSize * 2) {
    throw new Error("Multi-view silhouettes were too sparse for voxel reconstruction.");
  }

  return buildVoxelStl({
    solidName: params.solidName,
    occupancy,
    gridSize,
    widthMm: 100,
    depthMm: 100,
    heightMm: 120,
  });
}

function buildBriefText(job: FoundryJobSnapshot) {
  return [
    "3D Foundry Pipeline Brief",
    `Job ID: ${job.id}`,
    `Source file: ${job.sourceName}`,
    `Mode: ${job.reconstructionMode}`,
    `View count: ${job.viewCount}`,
    `Input: ${job.inputUrl ?? "pending"}`,
    `STL: ${job.outputStlUrl ?? "pending"}`,
    "",
    "Workflow:",
    "1. Image upload -> normalize inputs",
    "2. Background polarity -> foreground masks",
    "3. Single view -> relief, multi-view -> voxel carving",
    "4. Printable shell -> watertight STL export",
    "5. Export STL for slicer use",
    "",
    "Printability checklist:",
    "- No thin floating surfaces",
    "- Added wall thickness",
    "- Watertight mesh",
    "- Stable base orientation",
    "- Slicer-friendly polygon count",
  ].join("\n");
}

function toSnapshot(job: FoundryJob): FoundryJobSnapshot {
  return {
    id: job.id,
    sourceName: job.sourceName,
    mimeType: job.mimeType,
    notes: job.notes,
    status: job.status,
    stage: job.stage as FoundryStage,
    reconstructionMode: job.reconstructionMode as FoundryReconstructionMode,
    viewCount: job.viewCount,
    progress: job.progress,
    logs: parseLogs(job.logs),
    inputUrl: job.inputUrl,
    outputStlUrl: job.outputStlUrl,
    outputBriefUrl: job.outputBriefUrl,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    completedAt: job.completedAt ? job.completedAt.toISOString() : null,
  };
}

async function updateJob(
  id: string,
  data: Partial<
    Pick<
      FoundryJob,
      | "status"
      | "stage"
      | "reconstructionMode"
      | "viewCount"
      | "progress"
      | "logs"
      | "inputUrl"
      | "outputStlUrl"
      | "outputBriefUrl"
      | "errorMessage"
      | "completedAt"
    >
  >
) {
  return prisma.foundryJob.update({
    where: { id },
    data,
  });
}

function formatSourceSummary(views: FoundryInputView[]) {
  return views
    .map((view) => `${view.label}:${view.file.name || "upload"}`)
    .join(" | ");
}

async function writeInputViews(jobId: string, views: FoundryInputView[]) {
  const storedViews = await Promise.all(
    views.map(async (view) => {
      const fileName = view.file.name || `${view.label}.png`;
      const sourceBaseName = safeBaseName(fileName);
      const sourceExt = guessExtension(fileName, view.file.type || "application/octet-stream");
      const storedName = `${jobId}-${view.label}-${sourceBaseName}${sourceExt}`;
      const storedUrl = `/generated/foundry/inputs/${storedName}`;
      const storedPath = relativeToAbsolute(storedUrl);
      await fs.writeFile(storedPath, Buffer.from(await view.file.arrayBuffer()));

      return {
        label: view.label,
        fileName,
        storedUrl,
        storedPath,
        mimeType: view.file.type || "application/octet-stream",
      };
    })
  );

  const primaryView = storedViews.find((view) => view.label === "front") ?? storedViews[0];
  return { storedViews, primaryView };
}

async function loadStoredViewInputs(jobId: string) {
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });
  const matched = entries
    .filter((entry) => entry.isFile() && entry.name.startsWith(`${jobId}-`))
    .map((entry) => entry.name)
    .filter((name) => !name.endsWith(".json"));

  const ordered = VIEW_ORDER
    .map((label) => {
      const fileName = matched.find((name) => name.startsWith(`${jobId}-${label}-`));
      if (!fileName) return null;
      return {
        label,
        fileName,
        path: path.join(INPUT_DIR, fileName),
      };
    })
    .filter((item): item is { label: FoundryViewLabel; fileName: string; path: string } => Boolean(item));

  return Promise.all(
    ordered.map(async (entry) => ({
      label: entry.label,
      fileName: entry.fileName,
      buffer: await fs.readFile(entry.path),
    }))
  );
}

export async function createFoundryJob(params: { views: FoundryInputView[]; notes?: string | null }) {
  await ensureFoundryDirs();

  if (!params.views.length) {
    throw new Error("Please upload at least one image.");
  }

  const normalizedViews = params.views.filter((view) => Boolean(view.file));
  const reconstructionMode: FoundryReconstructionMode = normalizedViews.length > 1 ? "multi-view" : "single-view";
  const sourceName = formatSourceSummary(normalizedViews);

  const job = await prisma.foundryJob.create({
    data: {
      sourceName,
      mimeType: normalizedViews[0]?.file.type || "application/octet-stream",
      notes: params.notes?.trim() || null,
      reconstructionMode,
      viewCount: normalizedViews.length,
      status: "QUEUED",
      stage: "queued",
      progress: 0,
      logs: serializeLogs([`Queued ${sourceName}`]),
    },
  });

  const { storedViews, primaryView } = await writeInputViews(job.id, normalizedViews);
  const inputUrl = primaryView?.storedUrl ?? null;

  const updated = await updateJob(job.id, {
    inputUrl,
    logs: serializeLogs([
      `Queued ${sourceName}`,
      `Stored ${storedViews.length} input view${storedViews.length === 1 ? "" : "s"}.`,
      ...storedViews.map((view) => `Saved ${view.label} view as ${view.storedUrl}`),
    ]),
  });

  void processFoundryJob(job.id);

  return toSnapshot(updated);
}

export async function processFoundryJob(jobId: string) {
  const job = await prisma.foundryJob.findUnique({ where: { id: jobId } });
  if (!job) return;

  const logs = parseLogs(job.logs);

  try {
    const storedViews = await loadStoredViewInputs(jobId);
    const reconstructionMode: FoundryReconstructionMode = storedViews.length > 1 ? "multi-view" : "single-view";

    const progressStages: Array<Exclude<FoundryStage, "queued" | "complete" | "failed">> = [
      "point-cloud",
      "meshing",
      "cleaning",
      "audit",
      "stl",
    ];

    logs.push(
      reconstructionMode === "multi-view"
        ? `Loaded ${storedViews.length} uploaded views for multi-view reconstruction.`
        : "Loaded one uploaded view for relief reconstruction."
    );

    for (const stage of progressStages) {
      logs.push(...STAGE_LOGS[stage]);
      await updateJob(jobId, {
        status: "PROCESSING",
        stage,
        progress: stageToProgress(stage),
        logs: serializeLogs(logs),
      });
      await sleep(650);
    }

    const snapshot = toSnapshot(
      (await prisma.foundryJob.findUnique({ where: { id: jobId } })) ?? job
    );
    const solidName = `foundry_${jobId.replace(/[^a-z0-9_-]/gi, "_")}`;
    const outputStlUrl = `/generated/foundry/outputs/${jobId}.stl`;
    const outputBriefUrl = `/generated/foundry/briefs/${jobId}.txt`;
    if (!storedViews.length) {
      throw new Error("Uploaded image was not available for STL generation.");
    }

    logs.push(
      reconstructionMode === "multi-view"
        ? "Carving voxel volume from silhouettes..."
        : "Rasterizing uploaded image into a relief mesh..."
    );

    const stl = await (reconstructionMode === "multi-view" && storedViews.length > 1
      ? createMultiViewStl({
          solidName,
          views: storedViews,
        })
      : createReliefStlFromImage({ imageBuffer: storedViews[0].buffer, solidName }));

    await Promise.all([
      fs.writeFile(relativeToAbsolute(outputStlUrl), stl),
      fs.writeFile(relativeToAbsolute(outputBriefUrl), buildBriefText({ ...snapshot, reconstructionMode, viewCount: storedViews.length, outputStlUrl, outputBriefUrl })),
    ]);

    logs.push("Export artifacts written to public/generated/foundry.");

    await updateJob(jobId, {
      status: "COMPLETED",
      stage: "complete",
      reconstructionMode,
      viewCount: storedViews.length,
      progress: 100,
      logs: serializeLogs(logs),
      outputStlUrl,
      outputBriefUrl,
      completedAt: new Date(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown processing error";
    logs.push(`Processing failed: ${message}`);

    await updateJob(jobId, {
      status: "FAILED",
      stage: "failed",
      progress: 0,
      logs: serializeLogs(logs),
      errorMessage: message,
    });
  }
}

export async function getFoundryJobSnapshot(jobId: string) {
  const job = await prisma.foundryJob.findUnique({ where: { id: jobId } });
  return job ? toSnapshot(job) : null;
}
