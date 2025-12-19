import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    trackedProducts: [
      {
        productId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product' 
        }
      }
    ]
  }, 
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
