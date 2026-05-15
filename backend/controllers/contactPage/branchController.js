import Branch from '../../models/contactPage/branchModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/contact/branches
// Returns all active branches sorted by order
// Used by Contact.jsx branch carousel
// ─────────────────────────────────────────────
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ active: true })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: branches,
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
// GET /api/admin/contact/branches
// Returns ALL branches including inactive
// ─────────────────────────────────────────────
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: branches,
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
// POST /api/admin/contact/branches
// Admin adds a new branch office
// ─────────────────────────────────────────────
export const createBranch = async (req, res) => {
  try {
    const {
      city,
      cityImage,
      addressLines,
      phone,
      mapsUrl,
      active,
    } = req.body;

    // Validate required fields
    if (!city || !cityImage || !addressLines || !phone || !mapsUrl) {
      return res.status(400).json({
        success: false,
        message: 'city, cityImage, addressLines, phone, and mapsUrl are required',
      });
    }

    if (!Array.isArray(addressLines) || addressLines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'addressLines must be a non-empty array',
      });
    }

    // Auto-assign order as last in list
    const lastBranch = await Branch.findOne().sort({ order: -1 });
    const order = lastBranch ? lastBranch.order + 1 : 1;

    const branch = await Branch.create({
      order,
      city,
      cityImage,
      addressLines,
      phone,
      mapsUrl,
      active: active ?? true,
    });

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch,
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
// PUT /api/admin/contact/branches/:id
// Admin edits an existing branch
// ─────────────────────────────────────────────
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch,
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
// DELETE /api/admin/contact/branches/:id
// Admin deletes a branch office
// ─────────────────────────────────────────────
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByIdAndDelete(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Branch deleted successfully',
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
// PATCH /api/admin/contact/branches/reorder
// Admin drags to reorder branches
// Body: [{ id: '...', order: 1 }, { id: '...', order: 2 }]
// ─────────────────────────────────────────────
export const reorderBranches = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items must be a non-empty array of { id, order }',
      });
    }

    // Update all orders in parallel
    await Promise.all(
      items.map(({ id, order }) =>
        Branch.findByIdAndUpdate(id, { order })
      )
    );

    res.status(200).json({
      success: true,
      message: 'Branches reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};