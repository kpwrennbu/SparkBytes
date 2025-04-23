// pages/api/sendReservationEmail.ts
import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY); // ⬅️ use .env.local here!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { to, foodItems } = req.body;

  if (!to || !foodItems || !Array.isArray(foodItems)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const list = foodItems.map((item: any) => `• ${item.name}`).join('<br/>');

    const { data, error } = await resend.emails.send({
      from: 'SparkBytes <onboarding@resend.dev>',
      to,
      subject: 'Your Food Reservation',
      html: `<p>You reserved the following food items:</p><p>${list}</p>`,
    });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
