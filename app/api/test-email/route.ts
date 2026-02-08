import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

export async function POST(request: NextRequest) {
    const { email } = await request.json();

    const API_KEY = process.env.MAILGUN_API_KEY;
    const DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!API_KEY || !DOMAIN) {
        return NextResponse.json({ error: "Missing API Key or Domain" }, { status: 500 });
    }

    try {
        const mailgun = new Mailgun(FormData);
        const client = mailgun.client({ username: 'api', key: API_KEY });

        const result = await client.messages.create(DOMAIN, {
            from: `Test <mailgun@${DOMAIN}>`,
            to: email,
            subject: "Test Email from Next.js",
            text: "If you receive this, Mailgun configuration is correct."
        });

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error("Test Email Error:", error);
        return NextResponse.json({
            error: error.message,
            details: error.details,
            status: error.status
        }, { status: 500 });
    }
}
