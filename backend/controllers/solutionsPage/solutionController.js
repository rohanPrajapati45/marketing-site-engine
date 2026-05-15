import Solution from '../../models/solutionsPage/solutionModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/solutions
// Returns all active solutions sorted by order
// Used by SolutionSection.jsx
// ─────────────────────────────────────────────
export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ active: true })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: solutions,
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
// GET /api/admin/solutions
// Returns ALL solutions including inactive
// ─────────────────────────────────────────────
export const getAllSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: solutions,
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
// POST /api/admin/solutions
// Admin creates a new solution
// ─────────────────────────────────────────────
export const createSolution = async (req, res) => {
  try {
    const {
      theme,
      title,
      description,
      inquiryLabel,
      buttonText,
      buttonLink,
      images,
      tags,
      active,
    } = req.body;

    // Validate required fields
    if (!title || !description || !images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'title, description, and at least one image are required',
      });
    }

    // Auto-assign order as last in list
    const lastSolution = await Solution.findOne().sort({ order: -1 });
    const order = lastSolution ? lastSolution.order + 1 : 1;

    const solution = await Solution.create({
      order,
      theme: theme || 'dark',
      title,
      description,
      inquiryLabel,
      buttonText,
      buttonLink,
      images,
      tags: tags || [],
      active: active ?? true,
    });

    res.status(201).json({
      success: true,
      message: 'Solution created successfully',
      data: solution,
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
// PUT /api/admin/solutions/:id
// Admin edits an existing solution
// ─────────────────────────────────────────────
export const updateSolution = async (req, res) => {
  try {
    const { id } = req.params;

    const solution = await Solution.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solution updated successfully',
      data: solution,
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
// DELETE /api/admin/solutions/:id
// Admin deletes a solution
// ─────────────────────────────────────────────
export const deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;

    const solution = await Solution.findByIdAndDelete(id);

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solution deleted successfully',
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
// PATCH /api/admin/solutions/reorder
// Admin drags to reorder solutions
// Body: [{ id: '...', order: 1 }, { id: '...', order: 2 }]
// ─────────────────────────────────────────────
export const reorderSolutions = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items must be a non-empty array of { id, order }',
      });
    }

    await Promise.all(
      items.map(({ id, order }) =>
        Solution.findByIdAndUpdate(id, { order })
      )
    );

    res.status(200).json({
      success: true,
      message: 'Solutions reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};