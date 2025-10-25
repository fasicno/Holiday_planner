import {NextRequest, NextResponse} from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const photoReference = searchParams.get('photo_reference');

  if (!photoReference) {
    return NextResponse.json(
      {error: 'Photo reference is required'},
      {status: 400}
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {error: 'Google Maps API key is not configured'},
      {status: 500}
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // Forward the error from Google's API
      const errorText = await response.text();
      return NextResponse.json({error: errorText}, {status: response.status});
    }

    // Google's Photo API redirects to the actual image URL.
    // We can get the final URL from the response and redirect the client to it.
    // This avoids proxying the entire image binary through our server.
    if (response.redirected) {
      return NextResponse.redirect(response.url);
    }

    // If for some reason it didn't redirect, we can stream the response
    const imageBlob = await response.blob();
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
      },
    });
  } catch (error) {
    console.error('Error fetching image from Google Places API:', error);
    return NextResponse.json(
      {error: 'Failed to fetch image'},
      {status: 500}
    );
  }
}
