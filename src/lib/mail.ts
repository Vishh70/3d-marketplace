export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const confirmLink = `${baseUrl.replace(/\/$/, "")}/api/account/email/verify?token=${encodeURIComponent(token)}`;

  // Simulated Email
  console.log("==============================");
  console.log(`[SIMULATED EMAIL] To: ${email}`);
  console.log(`[SIMULATED EMAIL] Subject: Confirm your new email address`);
  console.log(`[SIMULATED EMAIL] Link: ${confirmLink}`);
  console.log("==============================");
  return { success: true, simulated: true };
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  // Simulated Email
  console.log("==============================");
  console.log(`[SIMULATED WELCOME EMAIL] To: ${email}`);
  console.log(`[SIMULATED WELCOME EMAIL] Welcome to the verse, ${name || "Maker"}!`);
  console.log("==============================");
  return { success: true, simulated: true };
}
