import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSubmissionNotification(monsterName: string, creatorNickname: string, imageUrl: string) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!process.env.RESEND_API_KEY || !adminEmail) {
      console.warn("Resend API Key or Admin Email missing. Email notification skipped.");
      return;
    }

    await resend.emails.send({
      from: 'Creative Monsters <notifications@resend.dev>', // You can customize this later with a domain
      to: adminEmail,
      subject: `New Creative Monster: ${monsterName}! 👾`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h1 style="color: #00adef; font-size: 24px;">A new creation is waiting! 🎨</h1>
          <p style="font-size: 16px; color: #666;">
            <strong>${creatorNickname || 'A Mystery Monster'}</strong> just shared their work: 
            <span style="color: #e53e7d; font-weight: bold;">"${monsterName}"</span>
          </p>
          <div style="margin: 30px 0;">
            <img src="${imageUrl}" alt="${monsterName}" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" 
             style="display: inline-block; background-color: #00adef; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">
            Go to Moderation Station
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}
