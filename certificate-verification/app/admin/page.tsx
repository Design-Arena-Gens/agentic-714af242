'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, FileText, Upload, CheckCircle, XCircle, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [issuers, setIssuers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok || response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.user.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(data.user);
      await Promise.all([fetchIssuers(), fetchTemplates()]);
    } catch (error) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchIssuers = async () => {
    try {
      const response = await fetch('/api/admin/issuers');
      const data = await response.json();
      setIssuers(data.issuers || []);
    } catch (error) {
      console.error('Fetch issuers error:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Fetch templates error:', error);
    }
  };

  const handleApprove = async (issuerId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/admin/issuers/${issuerId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      if (response.ok) {
        await fetchIssuers();
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = prompt('Enter template name:');
    if (!name) return;

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);

      const response = await fetch('/api/admin/templates', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchTemplates();
        alert('Template uploaded successfully');
      } else {
        const data = await response.json();
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const handleActivateTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/activate`, {
        method: 'PATCH',
      });
      if (response.ok) {
        await fetchTemplates();
      }
    } catch (error) {
      console.error('Activate error:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage issuers and certificate templates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Pending Issuers</h2>
            </div>

            {issuers.filter((i) => !i.isApproved).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {issuers
                  .filter((i) => !i.isApproved)
                  .map((issuer) => (
                    <div key={issuer._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{issuer.name}</h3>
                          <p className="text-sm text-gray-600">{issuer.email}</p>
                          <p className="text-sm text-gray-600">{issuer.organization}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleApprove(issuer._id, true)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleApprove(issuer._id, false)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">Approved Issuers</h3>
              {issuers.filter((i) => i.isApproved).length === 0 ? (
                <p className="text-gray-500 text-sm">No approved issuers</p>
              ) : (
                <div className="space-y-2">
                  {issuers
                    .filter((i) => i.isApproved)
                    .map((issuer) => (
                      <div key={issuer._id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{issuer.name}</p>
                          <p className="text-xs text-gray-600">{issuer.organization}</p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">Certificate Templates</h2>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pptx"
                  onChange={handleTemplateUpload}
                  className="hidden"
                  disabled={uploadLoading}
                />
                <div className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  <Upload className="h-4 w-4" />
                  <span>{uploadLoading ? 'Uploading...' : 'Upload'}</span>
                </div>
              </label>
            </div>

            {templates.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No templates uploaded</p>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template._id}
                    className={`border rounded-lg p-4 ${
                      template.isActive ? 'border-green-500 bg-green-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Uploaded: {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.fields.slice(0, 4).map((field: string) => (
                            <span
                              key={field}
                              className="text-xs bg-gray-200 px-2 py-1 rounded"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {template.isActive ? (
                          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleActivateTemplate(template._id)}
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
