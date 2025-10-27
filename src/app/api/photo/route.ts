import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const photoReference = searchParams.get('photo_reference');
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!photoReference || !apiKey) {
    return new NextResponse('Missing photo reference or API key', {
      status: 400,
    });
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to fetch photo from Google Places API: ${response.status} ${response.statusText}`,
        errorText
      );
      return new NextResponse(
        `Failed to fetch photo: ${response.statusText}`,
        {status: response.status}
      );
    }
    const imageBlob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', imageBlob.type);
    return new NextResponse(imageBlob, {status: 200, headers});
  } catch (error: any) {
    console.error('Error fetching photo:', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
