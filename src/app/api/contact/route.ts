import { Resend } from "resend";
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message, source } = parsed.data;

    // Expéditeur : domaine vérifié dans le compte Resend (gchb.fr, partagé
    // avec les autres projets). Surchargeable via CONTACT_FROM_EMAIL si un
    // domaine Nivalis est vérifié plus tard. Le `to` (boutique) reste Nivalis.
    const from = process.env.CONTACT_FROM_EMAIL || "Nivalis Les Gets <contact@gchb.fr>";
    const to = (process.env.CONTACT_TO_EMAIL || "contact@nivalislesgets.com")
      .split(",")
      .map((s) => s.trim());

    const { data, error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Contact Nivalis] ${subject}`,
      html: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #121212;">
          <h2 style="font-size: 18px; letter-spacing: -0.01em; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px;">
            Nouveau message — Nivalis
          </h2>
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #6b6b6b; width: 90px;">Nom</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b6b6b;">E-mail</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #121212;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #6b6b6b;">Sujet</td><td style="padding: 6px 0;">${escapeHtml(subject)}</td></tr>
            ${source ? `<tr><td style="padding: 6px 0; color: #6b6b6b;">Origine</td><td style="padding: 6px 0;">${escapeHtml(source)}</td></tr>` : ""}
          </table>
          <div style="background-color: #f5f5f4; padding: 20px; border: 1px solid #e5e5e5;">
            <p style="white-space: pre-wrap; line-height: 1.6; margin: 0;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #9a9a9a; font-size: 12px; margin-top: 24px;">
            Message envoyé depuis le formulaire du site Nivalis.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Erreur Resend:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
