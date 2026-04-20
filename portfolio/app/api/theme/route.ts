import { getTheme } from "@/app/lib/getTheme";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const theme = await getTheme();
        
        return NextResponse.json(theme);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 });
    }
}
