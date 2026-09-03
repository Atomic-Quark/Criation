import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUploadDocument extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  storageProvider: "local" | "s3" | "cloudinary";
  userId?: string;
  category?: "product" | "avatar" | "proof" | "general";
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema = new Schema<IUploadDocument>(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    storageProvider: { type: String, enum: ["local", "s3", "cloudinary"], default: "local" },
    userId: { type: String },
    category: { type: String, enum: ["product", "avatar", "proof", "general"], default: "product" },
  },
  {
    timestamps: true,
  }
);

export const Upload: Model<IUploadDocument> =
  mongoose.models.Upload || mongoose.model<IUploadDocument>("Upload", UploadSchema);

export default Upload;
