import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adminModel",
    },
    adminEmail: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
    },
    summary: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ adminEmail: 1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ entityType: 1 });

export default mongoose.model("ActivityLog", activityLogSchema);
