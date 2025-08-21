import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { VerificationEmail } from "@/emails/verification-email";
import { ResetPasswordEmail } from "@/emails/reset-password-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { type, email, username, verificationUrl, resetUrl } =
      await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    let emailComponent;
    let subject;

    switch (type) {
      case "verification":
        if (!verificationUrl) {
          return NextResponse.json(
            { error: "Verification URL is required" },
            { status: 400 }
          );
        }
        emailComponent = VerificationEmail({
          userFirstname: username || email.split("@")[0],
          verificationUrl,
        });
        subject = "Verify your email address for Gennit";
        break;

      case "reset-password":
        if (!resetUrl) {
          return NextResponse.json(
            { error: "Reset URL is required" },
            { status: 400 }
          );
        }
        emailComponent = ResetPasswordEmail({
          userFirstname: username || email.split("@")[0],
          resetUrl,
        });
        subject = "Reset your password for Gennit";
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    const { data, error } = await resend.emails.send({
      from: "Gennit <noreply@gennit.com>", // Update with your verified domain
      to: [email],
      subject,
      react: emailComponent,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
