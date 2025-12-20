import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const { productId, action } = await request.json(); // action: 'watch' or 'unwatch'

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (!productId || !action) {
      return NextResponse.json(
        { error: 'Product ID and action are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'watch') {
      // Add to watched products if not already there
      if (!user.watchedProducts.includes(productId)) {
        user.watchedProducts.push(productId);
        await user.save();
      }
    } else if (action === 'unwatch') {
      // Remove from watched products
      user.watchedProducts = user.watchedProducts.filter(
        (id: any) => id.toString() !== productId
      );
      await user.save();
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product ${action}ed successfully`,
      watchedCount: user.watchedProducts.length
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update watched status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: payload.email }).select('watchedProducts');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      watchedProducts: user.watchedProducts || []
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch watched products' },
      { status: 500 }
    );
  }
}
