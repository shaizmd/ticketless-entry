import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = Date.now().toString();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    
    console.log('Environment check:', {
      hasPrivateKey: !!privateKey,
      hasPublicKey: !!publicKey,
      privateKeyPrefix: privateKey?.substring(0, 10) + '...',
      publicKeyPrefix: publicKey?.substring(0, 10) + '...'
    });
    
    if (!privateKey || !publicKey) {
      console.error('Missing ImageKit credentials:', {
        privateKey: !!privateKey,
        publicKey: !!publicKey
      });
      return NextResponse.json(
        { error: 'ImageKit keys not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Validate that keys are not placeholder values
    if (privateKey.includes('your_private_key_here') || publicKey.includes('your_public_key_here')) {
      console.error('ImageKit credentials are placeholder values');
      return NextResponse.json(
        { error: 'ImageKit keys not properly configured. Please update your .env.local file with actual credentials.' },
        { status: 500 }
      );
    }

    // Create signature using crypto
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire)
      .digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey
    });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication' },
      { status: 500 }
    );
  }
}
