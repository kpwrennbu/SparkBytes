import { NextResponse } from "next/server"; //Needed for Next server response
import formData from "form-data"; //needed for Mailgun
import Mailgun from "mailgun.js"; //needed for Mailgun

//Source: https://documentation.mailgun.com

// Initialize Mailgun client
const mailgun = new Mailgun(formData); //make Mailgun off of the CreateEvents Form data

//Make a mailgun client
const mg = mailgun.client({
  username: "api", 
  key: "6242c993fdf05fcf72ae73ae7371b846-10b6f382-20794cd0", // from .env.local
});

export async function POST(req: Request) { //Post request format functiopn
  const { to, subject, text } = await req.json();
   try {
    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `SparkBytes! <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to,         // must be an authorized recipient in Mailgun. Profs, TAs / CAs! Please email me at kpwrenn@bu.edu if you do not recieve emails
      subject,    // title of the email
      text,       // formatted in CreateEvent.tsx
    });

    console.log("Email sent:", result); //debugging logs
    return NextResponse.json({ success: true, result }); //return success
  } catch (error) { //catching error
    console.error("Email send failed:", error); //logging error
    return NextResponse.json({ success: false, error }); //return that error
  }
}
