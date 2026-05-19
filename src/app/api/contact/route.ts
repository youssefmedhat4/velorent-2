import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/resend";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(3, "Subject is required"),
  category: z.enum(["booking", "payment", "vehicle", "account", "other"]),
  message: z.string().min(20, "Please provide more detail (min 20 characters)"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    await sendContactMessage(parsed.data);

    return NextResponse.json({ success: true, data: null });
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
