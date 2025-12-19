import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true,
      lowercase: true
    },
    token: { 
      type: String, 
      required: true,
      unique: true
    },
    expiresAt: { 
      type: Date, 
      required: true,
      index: { expires: 0 } // Auto-delete after expiration
    }
  }, 
  { timestamps: true }
);

const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', verificationTokenSchema);

export default VerificationToken;
