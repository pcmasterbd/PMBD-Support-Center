import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "টোকেন পাওয়া যায়নি" }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return NextResponse.json({ error: "টোকেন সঠিক নয়" }, { status: 400 });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return NextResponse.json({ error: "টোকেনটির মেয়াদ শেষ হয়ে গেছে" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email }
    });

    if (!existingUser) {
        return NextResponse.json({ error: "ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        }
    });

    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    });

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
