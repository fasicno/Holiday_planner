import {NextResponse} from 'next/server';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const imageQuery = searchParams.get('image_query');
  const apiKey = "pcNvy4kqdNao8_355ZEJu_vCRQjVNkcNfvSZ271i8y8";

  if (!imageQuery) {
    return new NextResponse('Missing image query', {
      status: 400,
    });
  }

  if (!apiKey) {
    return new NextResponse('Missing Unsplash API key', { status: 500 });
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    imageQuery
  )}&per_page=1&orientation=landscape`;

  try {
    const unsplashResponse = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${apiKey}`,
      },
    });

    if (!unsplashResponse.ok) {
      const errorText = await unsplashResponse.text();
      console.error(
        `Failed to fetch photo from Unsplash API: ${unsplashResponse.status} ${unsplashResponse.statusText}`,
        errorText
      );
      return new NextResponse(
        `Failed to fetch photo: ${unsplashResponse.statusText}`,
        {status: unsplashResponse.status}
      );
    }

    const data = await unsplashResponse.json();
    const imageUrl = data.results[0]?.urls?.regular;

    if (!imageUrl) {
        return new NextResponse('No image found for query', { status: 404 });
    }

    // Fetch the image blob from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
         return new NextResponse('Failed to download image', { status: 500 });
    }
    const imageBlob = await imageResponse.blob();
    const headers = new Headers();
    headers.set('Content-Type', imageBlob.type);
    
    return new NextResponse(imageBlob, {status: 200, headers});

  } catch (error: any) {
    console.error('Error fetching photo from Unsplash:', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
