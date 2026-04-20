import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

        // Forward the file as a stream instead of loading as blob (prevents memory exhaustion)
        return new NextResponse(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Access-Control-Allow-Origin': '*',
                'Content-Length': response.headers.get('Content-Length') || '',
            },
        });
    } catch (error) {
        console.error('Proxy Fetch Error:', error);
        return new NextResponse('Failed to fetch resource', { status: 500 });
    }
}
