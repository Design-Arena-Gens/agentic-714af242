import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@certiverify.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin already exists',
        email: adminEmail,
      });
    }

    const hashedPassword = await hashPassword(adminPassword);

    await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin',
      isApproved: true,
    });

    return NextResponse.json({
      message: 'Admin account created successfully',
      email: adminEmail,
      password: 'Check environment variables',
    });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json(
      { message: 'Initialization failed', error: String(error) },
      { status: 500 }
    );
  }
}
