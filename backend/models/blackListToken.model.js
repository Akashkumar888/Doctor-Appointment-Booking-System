import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

// Automatically delete expired tokens after their expiration
blackListTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blackListModel = mongoose.models.BlackListToken || mongoose.model("BlackListToken", blackListTokenSchema);
export default blackListModel;
