import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  fileUrl: string;
  fields: string[];
  isActive: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fields: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: false,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
