import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Template from '@/models/Template';
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

    // Deactivate all templates
    await Template.updateMany({}, { isActive: false });

    const { id } = await params;

    // Activate the selected template
    const template = await Template.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Template activated successfully',
      template,
    });
  } catch (error) {
    console.error('Activate template error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
