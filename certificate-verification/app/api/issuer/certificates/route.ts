import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import Template from '@/models/Template';
import { verifyToken } from '@/lib/auth';
import { generateCertificateId, generateBlockchainHash } from '@/lib/blockchain';
import { generateCertificateFromTemplate, CertificateData } from '@/lib/pptx-generator';
import { mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'issuer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const certificates = await Certificate.find({ issuedBy: decoded.userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
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
    if (!decoded || decoded.role !== 'issuer') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { studentName, dateOfBirth, courseName, issueDate, organization, metadata } = body;

    if (!studentName || !dateOfBirth || !courseName || !issueDate || !organization) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Get active template
    const template = await Template.findOne({ isActive: true });
    if (!template) {
      return NextResponse.json({ message: 'No active template found' }, { status: 404 });
    }

    const certificateId = generateCertificateId();

    // Prepare certificate data
    const certificateData: CertificateData = {
      NAME: studentName,
      DATE_OF_BIRTH: new Date(dateOfBirth).toLocaleDateString(),
      COURSE_NAME: courseName,
      ISSUE_DATE: new Date(issueDate).toLocaleDateString(),
      CERTIFICATE_ID: certificateId,
      ORGANIZATION: organization,
      ...metadata,
    };

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'certificates');
    await mkdir(uploadsDir, { recursive: true });

    // Generate certificate from template
    const outputFileName = `${certificateId}.pptx`;
    const fileUrl = await generateCertificateFromTemplate(
      template.fileUrl,
      certificateData,
      outputFileName
    );

    // Generate blockchain hash
    const blockchainData = {
      certificateId,
      studentName,
      dateOfBirth,
      courseName,
      issueDate,
      organization,
      issuedBy: decoded.userId,
    };
    const blockchainHash = await generateBlockchainHash(blockchainData);

    // Save certificate to database
    const certificate = await Certificate.create({
      certificateId,
      studentName,
      dateOfBirth: new Date(dateOfBirth),
      courseName,
      issueDate: new Date(issueDate),
      issuedBy: decoded.userId,
      organization,
      blockchainHash,
      metadata: metadata || {},
      fileUrl,
    });

    return NextResponse.json({
      message: 'Certificate generated successfully',
      certificate,
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
