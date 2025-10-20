import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { isApproved } = await req.json();
    const { id } = await params;

    const issuer = await User.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    ).select('-password');

    if (!issuer) {
      return NextResponse.json({ message: 'Issuer not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Issuer ${isApproved ? 'approved' : 'rejected'} successfully`,
      issuer,
    });
  } catch (error) {
    console.error('Approve issuer error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
