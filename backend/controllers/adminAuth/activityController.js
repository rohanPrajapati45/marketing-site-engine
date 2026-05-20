import ActivityLog from "../../models/ActivityLog.js";

const DAYS_TO_KEEP = 30;

export const listActivity = async (req, res) => {
  try {
    if (!req.admin?.isMainAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const now = new Date();
    const cutoff = new Date(now.getTime() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000);

    await ActivityLog.deleteMany({ createdAt: { $lt: cutoff } });

    const {
      email,
      action,
      entityType,
      from,
      to,
      page = 1,
      limit = 25,
    } = req.query;

    const query = {
      createdAt: { $gte: cutoff },
    };

    if (email) {
      query.adminEmail = { $regex: email, $options: "i" };
    }

    if (action) {
      if (action.includes('.')) {
        query.action = action;
      } else {
        query.action = { $regex: `^${action}\\.` };
      }
    }

    if (entityType) {
      query.entityType = entityType;
    }

    if (from || to) {
      query.createdAt = {
        ...query.createdAt,
        ...(from ? { $gte: new Date(from) } : {}),
        ...(to ? { $lte: new Date(to) } : {}),
      };
    }

    const safeLimit = Math.min(parseInt(limit, 10) || 25, 100);
    const safePage = Math.max(parseInt(page, 10) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      ActivityLog.countDocuments(query),
    ]);

    return res.status(200).json({
      items,
      total,
      page: safePage,
      limit: safeLimit,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load activity", error: error.message });
  }
};
