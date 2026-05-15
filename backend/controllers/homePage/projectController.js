import HomeProject from '../../models/homePage/projectModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/home/projects
// Returns all active projects sorted by order
// Used by ProjectsSection.jsx
// ─────────────────────────────────────────────
export const getProjects = async (req, res) => {
  try {
    const projects = await HomeProject.find({ active: true })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: projects,
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
// GET /api/admin/home/projects
// Returns ALL projects including inactive
// ─────────────────────────────────────────────
export const getAllProjects = async (req, res) => {
  try {
    const projects = await HomeProject.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: projects,
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
// POST /api/admin/home/projects
// Admin adds a new project card
// ─────────────────────────────────────────────
export const createProject = async (req, res) => {
  try {
    const {
      titleBold,
      titleLines,
      clientLogo,
      clientLogoAlt,
      clientName,
      clientCountry,
      mockupImage,
      mockupAlt,
      caseStudyUrl,
      liveUrl,
      active,
    } = req.body;

    // Auto-assign order as last in list
    const lastProject = await HomeProject.findOne().sort({ order: -1 });
    const order = lastProject ? lastProject.order + 1 : 1;

    const project = await HomeProject.create({
      order,
      titleBold,
      titleLines,
      clientLogo,
      clientLogoAlt,
      clientName,
      clientCountry,
      mockupImage,
      mockupAlt,
      caseStudyUrl,
      liveUrl,
      active: active ?? true,
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
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
// PUT /api/admin/home/projects/:id
// Admin edits an existing project card
// ─────────────────────────────────────────────
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await HomeProject.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
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
// DELETE /api/admin/home/projects/:id
// Admin deletes a project card
// ─────────────────────────────────────────────
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await HomeProject.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
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
// PATCH /api/admin/home/projects/reorder
// Admin drags to reorder project cards
// Body: [{ id: '...', order: 1 }, { id: '...', order: 2 }]
// ─────────────────────────────────────────────
export const reorderProjects = async (req, res) => {
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
        HomeProject.findByIdAndUpdate(id, { order })
      )
    );

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};