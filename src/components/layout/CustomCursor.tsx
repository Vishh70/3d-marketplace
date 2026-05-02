"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  useGSAP(() => {
    // QuickSetters for max performance
    const xToCursor = gsap.quickTo(cursorRef.current, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursorRef.current, "y", { duration: 0.1, ease: "power3" });
    const xToFollower = gsap.quickTo(followerRef.current, "x", { duration: 0.6, ease: "power3" });
    const yToFollower = gsap.quickTo(followerRef.current, "y", { duration: 0.6, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Add interactions for links and buttons
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // If the target is a link, button, or has a specific class
      if (
        target.tagName.toLowerCase() === "a" || 
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") || 
        target.closest("button")
      ) {
        setIsHovering(true);
        setHoverText("");
      } else if (target.closest(".model-card-item")) {
        setIsHovering(true);
        setHoverText("VIEW");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      <div 
        ref={followerRef} 
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hidden md:flex ${
          isHovering 
            ? hoverText 
              ? "w-20 h-20 bg-primary text-black font-black text-[10px] tracking-widest scale-100" 
              : "w-12 h-12 border-2 border-primary bg-primary/10 scale-150 backdrop-blur-sm"
            : "w-8 h-8 border border-white/30 scale-100"
        }`}
      >
        {hoverText && <span>{hoverText}</span>}
      </div>
    </>
  );
}
