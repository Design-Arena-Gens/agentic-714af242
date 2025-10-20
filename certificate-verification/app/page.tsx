'use client';

import Link from 'next/link';
import { Shield, FileCheck, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">CertiVerify</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Blockchain-Powered Certificate Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, transparent, and tamper-proof certificate verification system using AI and blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <FileCheck className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Verify Certificates
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Upload and verify certificates using AI-powered data extraction
            </p>
            <Link
              href="/verify"
              className="block text-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md font-medium"
            >
              Verify Now
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Award className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Issue Certificates
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Authorized institutions can issue tamper-proof certificates
            </p>
            <Link
              href="/register?role=issuer"
              className="block text-center bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md font-medium"
            >
              Register as Issuer
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Blockchain Security
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Every certificate is secured with blockchain hash verification
            </p>
            <div className="block text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium">
              Always Secure
            </div>
          </div>
        </div>

        <div className="bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Certificate</h4>
              <p className="text-gray-600">Upload certificate image for verification</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI Extraction</h4>
              <p className="text-gray-600">Gemini AI extracts certificate data</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Blockchain Verify</h4>
              <p className="text-gray-600">Compare with blockchain-secured database</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 CertiVerify. Secure Certificate Verification Platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
