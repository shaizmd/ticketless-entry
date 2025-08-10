// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const res = await imagekit.upload({
      file: buffer, // actual file
      fileName: file.name,
    });

    return NextResponse.json({ url: res.url });
  } catch (err) {
    console.error("ImageKit upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
