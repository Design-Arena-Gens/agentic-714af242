import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import { extractCertificateData } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Extract data using Gemini AI
    const extractedData = await extractCertificateData(base64);

    // Search for matching certificate in database
    const query: any = {};

    if (extractedData.certificateId) {
      query.certificateId = extractedData.certificateId;
    } else if (extractedData.studentName && extractedData.courseName) {
      query.studentName = { $regex: new RegExp(extractedData.studentName, 'i') };
      query.courseName = { $regex: new RegExp(extractedData.courseName, 'i') };
    } else {
      return NextResponse.json({
        verified: false,
        message: 'Could not extract enough information from certificate',
        extractedData,
      });
    }

    const certificate = await Certificate.findOne(query).populate('issuedBy', 'name organization');

    if (!certificate) {
      return NextResponse.json({
        verified: false,
        message: 'Certificate not found in database',
        extractedData,
      });
    }

    // Compare extracted data with database data
    const matches = {
      studentName: false,
      dateOfBirth: false,
      courseName: false,
      issueDate: false,
      certificateId: false,
      organization: false,
    };

    if (extractedData.studentName) {
      matches.studentName = extractedData.studentName.toLowerCase().includes(certificate.studentName.toLowerCase()) ||
        certificate.studentName.toLowerCase().includes(extractedData.studentName.toLowerCase());
    }

    if (extractedData.dateOfBirth) {
      const extractedDate = new Date(extractedData.dateOfBirth).toDateString();
      const dbDate = new Date(certificate.dateOfBirth).toDateString();
      matches.dateOfBirth = extractedDate === dbDate;
    }

    if (extractedData.courseName) {
      matches.courseName = extractedData.courseName.toLowerCase().includes(certificate.courseName.toLowerCase()) ||
        certificate.courseName.toLowerCase().includes(extractedData.courseName.toLowerCase());
    }

    if (extractedData.issueDate) {
      const extractedDate = new Date(extractedData.issueDate).toDateString();
      const dbDate = new Date(certificate.issueDate).toDateString();
      matches.issueDate = extractedDate === dbDate;
    }

    if (extractedData.certificateId) {
      matches.certificateId = extractedData.certificateId === certificate.certificateId;
    }

    if (extractedData.organization) {
      matches.organization = extractedData.organization.toLowerCase().includes(certificate.organization.toLowerCase()) ||
        certificate.organization.toLowerCase().includes(extractedData.organization.toLowerCase());
    }

    const matchCount = Object.values(matches).filter(Boolean).length;
    const totalFields = Object.keys(matches).filter(key => extractedData[key as keyof typeof extractedData]).length;
    const matchPercentage = totalFields > 0 ? (matchCount / totalFields) * 100 : 0;

    const verified = matchPercentage >= 70; // At least 70% match required

    return NextResponse.json({
      verified,
      message: verified ? 'Certificate verified successfully' : 'Certificate verification failed',
      matchPercentage: Math.round(matchPercentage),
      matches,
      extractedData,
      certificateData: verified ? {
        certificateId: certificate.certificateId,
        studentName: certificate.studentName,
        dateOfBirth: certificate.dateOfBirth,
        courseName: certificate.courseName,
        issueDate: certificate.issueDate,
        organization: certificate.organization,
        issuedBy: certificate.issuedBy,
        blockchainHash: certificate.blockchainHash,
      } : null,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
