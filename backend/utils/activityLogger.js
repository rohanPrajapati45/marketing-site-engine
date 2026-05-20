import ActivityLog from "../models/ActivityLog.js";
import adminModel from "../models/adminAuth/adminModel.js";

export const logActivity = async (req, { action, entityType, entityId, summary, metadata }) => {
  try {
    if (!req?.admin?.id) {
      return;
    }

    let adminEmail = req.admin.email;
    if (!adminEmail) {
      const admin = await adminModel.findById(req.admin.id).select("email");
      adminEmail = admin?.email;
    }

    if (!adminEmail) {
      return;
    }

    await ActivityLog.create({
      adminId: req.admin.id,
      adminEmail,
      action,
      entityType,
      entityId,
      summary,
      metadata,
    });
  } catch (error) {
    // Swallow logging errors to avoid breaking main requests.
  }
};

export const logActivityDirect = async ({ adminId, adminEmail, action, entityType, entityId, summary, metadata }) => {
  try {
    if (!adminId || !adminEmail) {
      return;
    }

    await ActivityLog.create({
      adminId,
      adminEmail,
      action,
      entityType,
      entityId,
      summary,
      metadata,
    });
  } catch (error) {
    // Swallow logging errors to avoid breaking main requests.
  }
};
