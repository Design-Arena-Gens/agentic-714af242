import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Template from '@/models/Template';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

    const templates = await Template.find().sort({ createdAt: -1 });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file || !name) {
      return NextResponse.json({ message: 'File and name are required' }, { status: 400 });
    }

    if (!file.name.endsWith('.pptx')) {
      return NextResponse.json({ message: 'Only PPTX files are allowed' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'templates');
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/templates/${fileName}`;

    // Extract placeholders from file name or default set
    const fields = ['{NAME}', '{DATE_OF_BIRTH}', '{COURSE_NAME}', '{ISSUE_DATE}', '{CERTIFICATE_ID}', '{ORGANIZATION}', '{CANDIDATE_IMAGE}'];

    // Deactivate all other templates
    await Template.updateMany({}, { isActive: false });

    const template = await Template.create({
      name,
      fileUrl,
      fields,
      isActive: true,
      uploadedBy: decoded.userId,
    });

    return NextResponse.json({
      message: 'Template uploaded successfully',
      template,
    });
  } catch (error) {
    console.error('Upload template error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
