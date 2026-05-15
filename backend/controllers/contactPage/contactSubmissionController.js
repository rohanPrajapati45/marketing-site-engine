import ContactSubmission from '../../models/contactPage/contactSubmissionModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// POST /api/contact/submissions
// Frontend submits contact form data here
// Stores name, email, phone, company, message, etc.
// ─────────────────────────────────────────────
export const submitContactForm = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      message,
      extraFields,
      source,
    } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const submission = await ContactSubmission.create({
      name: name || '',
      email,
      phone: phone || '',
      company: company || '',
      message: message || '',
      extraFields: extraFields || {},
      source: source || 'contact-page',
      read: false,
      archived: false,
    });

    res.status(201).json({
      success: true,
      message: 'Submission received successfully',
      data: submission,
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
// GET /api/admin/contact/submissions
// Admin panel lists all contact submissions
// Can filter by read, archived status
// Query params: ?read=false&archived=false&limit=20&page=1
// ─────────────────────────────────────────────
export const getContactSubmissions = async (req, res) => {
  try {
    const {
      read,
      archived,
      limit = 20,
      page = 1,
      source,
    } = req.query;

    // Build filter object
    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    if (archived !== undefined) filter.archived = archived === 'true';
    if (source) filter.source = source;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await ContactSubmission.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: submissions,
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
// GET /api/admin/contact/submissions/:id
// Admin views single submission details
// ─────────────────────────────────────────────
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findById(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Mark as read when admin views it
    submission.read = true;
    await submission.save();

    res.status(200).json({
      success: true,
      data: submission,
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
// PATCH /api/admin/contact/submissions/:id/read
// Admin marks submission as read
// ─────────────────────────────────────────────
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission marked as read',
      data: submission,
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
// PATCH /api/admin/contact/submissions/:id/archive
// Admin archives a submission
// ─────────────────────────────────────────────
export const archiveSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { archived },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Submission ${archived ? 'archived' : 'unarchived'}`,
      data: submission,
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
// DELETE /api/admin/contact/submissions/:id
// Admin permanently deletes a submission
// ─────────────────────────────────────────────
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
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
// DELETE /api/admin/contact/submissions/bulk-delete
// Admin deletes multiple submissions at once
// Body: { ids: ['id1', 'id2', ...] }
// ─────────────────────────────────────────────
export const bulkDeleteSubmissions = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ids must be a non-empty array',
      });
    }

    const result = await ContactSubmission.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} submissions deleted`,
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
// GET /api/admin/contact/submissions/stats
// Admin views submission statistics
// Returns: total, unread, archived, by source
// ─────────────────────────────────────────────
export const getSubmissionStats = async (req, res) => {
  try {
    const total = await ContactSubmission.countDocuments();
    const unread = await ContactSubmission.countDocuments({ read: false });
    const archived = await ContactSubmission.countDocuments({ archived: true });

    const bySource = await ContactSubmission.aggregate([
      {
        $group: {
          _id: '$source',
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
        bySource: Object.fromEntries(
          bySource.map(item => [item._id, item.count])
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