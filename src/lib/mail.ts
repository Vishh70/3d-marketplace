import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const confirmLink = `${baseUrl.replace(/\/$/, "")}/api/account/email/verify?token=${encodeURIComponent(token)}`;

  // If no API key is present, log to console for development
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_123") {
    console.log("--- MOCK EMAIL START ---");
    console.log(`To: ${email}`);
    console.log(`Subject: Confirm your new email address`);
    console.log(`Link: ${confirmLink}`);
    console.log("--- MOCK EMAIL END ---");
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: "Melted Modulus <onboarding@resend.dev>", // Replace with your domain once verified
      to: email,
      subject: "Confirm your new email address",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #fa6831; text-align: center;">Melted Modulus</h2>
          <p>Hello,</p>
          <p>You requested to change your email address for your Melted Modulus account. Please click the button below to confirm this change:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #fa6831; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Confirm Email Change</a>
          </div>
          <p>If you did not request this change, you can safely ignore this email.</p>
          <p style="font-size: 12px; color: #777; margin-top: 40px;">
            This link will expire in 30 minutes.<br>
            Melted Modulus - India's Premier 3D Marketplace
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send verification email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name?: string | null) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_123") {
    console.log(`MOCK WELCOME EMAIL to ${email}`);
    return { success: true, mock: true };
  }

  try {
    await resend.emails.send({
      from: "Melted Modulus <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Melted Modulus!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #fa6831; text-align: center;">Melted Modulus</h2>
          <p>Welcome to the verse, ${name || "Maker"}!</p>
          <p>We're thrilled to have you join India's premier community of 3D designers and makers.</p>
          <p>Start exploring the marketplace or try our AI Foundry to bring your ideas to life.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}" style="background-color: #fa6831; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 40px;">
            Melted Modulus - India's Premier 3D Marketplace
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return { success: false, error };
  }
}
