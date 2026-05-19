import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendNewsletterWelcome } from "@/lib/resend";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    await sendNewsletterWelcome({ to: parsed.data.email });

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("[NEWSLETTER_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
