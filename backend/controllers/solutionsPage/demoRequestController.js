import DemoRequest from '../../models/solutionsPage/demoRequestModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// POST /api/solutions/demo-requests
// Frontend submits demo request from SolutionSection form
// ─────────────────────────────────────────────
export const submitDemoRequest = async (req, res) => {
  try {
    const { solutionTitle, solutionId, phone, email } = req.body;

    // Validate required fields
    if (!solutionTitle || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'solutionTitle, phone, and email are required',
      });
    }

    const demoRequest = await DemoRequest.create({
      solutionTitle,
      solutionId: solutionId || null,
      phone,
      email,
      read: false,
      archived: false,
    });

    res.status(201).json({
      success: true,
      message: 'Demo request submitted successfully',
      data: demoRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// GET /api/admin/solutions/demo-requests
// Admin lists all demo requests with filters
// Query params: ?read=false&archived=false&solutionId=...&limit=20&page=1
// ─────────────────────────────────────────────
export const getDemoRequests = async (req, res) => {
  try {
    const {
      read,
      archived,
      solutionId,
      limit = 20,
      page = 1,
    } = req.query;

    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    if (archived !== undefined) filter.archived = archived === 'true';
    if (solutionId) filter.solutionId = solutionId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await DemoRequest.find(filter)
      .populate('solutionId', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await DemoRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// GET /api/admin/solutions/demo-requests/:id
// Admin views single demo request
// ─────────────────────────────────────────────
export const getDemoRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const demoRequest = await DemoRequest.findById(id)
      .populate('solutionId', 'title theme');

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    // Mark as read when admin views it
    demoRequest.read = true;
    await demoRequest.save();

    res.status(200).json({
      success: true,
      data: demoRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// PATCH /api/admin/solutions/demo-requests/:id/read
// Admin marks demo request as read
// ─────────────────────────────────────────────
export const markDemoRequestAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const demoRequest = await DemoRequest.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Demo request marked as read',
      data: demoRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// PATCH /api/admin/solutions/demo-requests/:id/archive
// Admin archives or unarchives demo request
// ─────────────────────────────────────────────
export const archiveDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;

    const demoRequest = await DemoRequest.findByIdAndUpdate(
      id,
      { archived },
      { new: true }
    );

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Demo request ${archived ? 'archived' : 'unarchived'}`,
      data: demoRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// DELETE /api/admin/solutions/demo-requests/:id
// Admin permanently deletes a demo request
// ─────────────────────────────────────────────
export const deleteDemoRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const demoRequest = await DemoRequest.findByIdAndDelete(id);

    if (!demoRequest) {
      return res.status(404).json({
        success: false,
        message: 'Demo request not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Demo request deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// DELETE /api/admin/solutions/demo-requests/bulk-delete
// Admin bulk deletes demo requests
// Body: { ids: ['id1', 'id2', ...] }
// ─────────────────────────────────────────────
export const bulkDeleteDemoRequests = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ids must be a non-empty array',
      });
    }

    const result = await DemoRequest.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} demo requests deleted`,
      deleted: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// GET /api/admin/solutions/demo-requests/stats
// Admin views demo request statistics
// ─────────────────────────────────────────────
export const getDemoRequestStats = async (req, res) => {
  try {
    const total = await DemoRequest.countDocuments();
    const unread = await DemoRequest.countDocuments({ read: false });
    const archived = await DemoRequest.countDocuments({ archived: true });

    const bySolution = await DemoRequest.aggregate([
      {
        $group: {
          _id: '$solutionTitle',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        archived,
        bySolution: Object.fromEntries(
          bySolution.map(item => [item._id, item.count])
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};