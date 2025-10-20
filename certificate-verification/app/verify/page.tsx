'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Upload, CheckCircle, XCircle, FileText } from 'lucide-react';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ verified: false, message: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">CertiVerify</span>
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Verify Certificate</h1>
          <p className="text-gray-600">Upload a certificate to verify its authenticity</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition">
              <input
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {file ? file.name : 'Click to upload certificate'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </label>
            </div>

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-4">
              <div
                className={`p-6 rounded-lg ${
                  result.verified
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {result.verified ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <h3
                    className={`text-xl font-bold ${
                      result.verified ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.verified ? 'Certificate Verified ✓' : 'Verification Failed ✗'}
                  </h3>
                </div>
                <p
                  className={`${
                    result.verified ? 'text-green-700' : 'text-red-700'
                  } mb-2`}
                >
                  {result.message}
                </p>
                {result.matchPercentage !== undefined && (
                  <p className="text-sm text-gray-600">
                    Match Score: {result.matchPercentage}%
                  </p>
                )}
              </div>

              {result.extractedData && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-2 mb-4">
                    <FileText className="h-6 w-6 text-gray-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Extracted Data</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(result.extractedData).map(([key, value]: [string, any]) => (
                      value && (
                        <div key={key}>
                          <p className="text-sm text-gray-500 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium text-gray-900">{String(value)}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {result.certificateData && (
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4">
                    Certificate Details from Database
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-indigo-600">Certificate ID</p>
                      <p className="font-medium text-indigo-900">{result.certificateData.certificateId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">Student Name</p>
                      <p className="font-medium text-indigo-900">{result.certificateData.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">Course</p>
                      <p className="font-medium text-indigo-900">{result.certificateData.courseName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-indigo-600">Organization</p>
                      <p className="font-medium text-indigo-900">{result.certificateData.organization}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-indigo-600">Blockchain Hash</p>
                      <p className="font-mono text-xs text-indigo-900 break-all">
                        {result.certificateData.blockchainHash}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {result.matches && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Field Matches</h4>
                  <div className="space-y-2">
                    {Object.entries(result.matches).map(([key, matched]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {matched ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
