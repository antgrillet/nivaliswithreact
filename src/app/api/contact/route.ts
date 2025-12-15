import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send({
      from: "Nivalis Contact <contact@gchb.fr>",
      to: ["contact@nivalislesgets.com"],
      replyTo: email,
      subject: `[Contact Nivalis] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #92400e; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
            Nouveau message de contact - Nivalis
          </h2>

          <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #92400e;">Nom:</strong> ${name}
            </p>
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #92400e;">Email:</strong>
              <a href="mailto:${email}" style="color: #d97706;">${email}</a>
            </p>
            <p style="margin: 0;">
              <strong style="color: #92400e;">Sujet:</strong> ${subject}
            </p>
          </div>

          <div style="background-color: #f5f5f4; padding: 20px; border-radius: 8px;">
            <h3 style="color: #92400e; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>

          <p style="color: #78716c; font-size: 12px; margin-top: 20px; text-align: center;">
            Ce message a été envoyé depuis le formulaire de contact du site Nivalis.
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
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
