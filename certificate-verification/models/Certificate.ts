import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  studentName: string;
  dateOfBirth: Date;
  courseName: string;
  issueDate: Date;
  issuedBy: mongoose.Types.ObjectId;
  organization: string;
  blockchainHash: string;
  metadata: {
    [key: string]: any;
  };
  fileUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  issuedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  blockchainHash: {
    type: String,
    required: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
  fileUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
