
import mongoose from "mongoose";
// using ttl-> time to live 

const blackListSchema = new mongoose.Schema({
  token: { type: String, required: true }, // ❌ removed unique
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 } // auto-delete after 30 days
});

// Add an index to speed up TTL cleanup
blackListSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 86400 });

const blackListModel = mongoose.models.BlackList || mongoose.model("BlackList", blackListSchema);

export default blackListModel;
