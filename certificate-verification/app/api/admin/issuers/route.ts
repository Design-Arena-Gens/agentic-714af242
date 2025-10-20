import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const issuers = await User.find({ role: 'issuer' }).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({ issuers });
  } catch (error) {
    console.error('Get issuers error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
