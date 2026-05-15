import CaseStudy from '../../models/homePage/caseStudyModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/home/case-studies/:slug
// Used by CaseStudy.jsx via getCaseStudyBySlug(slug)
// ─────────────────────────────────────────────
export const getCaseStudyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const caseStudy = await CaseStudy.findOne({
      slug,
      active: true,
    });

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    // Sort sections by order before sending
    caseStudy.sections.sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      data: caseStudy,
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
// GET /api/admin/home/case-studies
// Returns all case studies for admin panel list
// ─────────────────────────────────────────────
export const getAllCaseStudies = async (req, res) => {
  try {
    // Return without sections for list view (lighter response)
    const caseStudies = await CaseStudy.find()
      .select('-sections')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: caseStudies,
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
// GET /api/admin/home/case-studies/:id
// Returns single case study with all sections
// ─────────────────────────────────────────────
export const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.status(200).json({
      success: true,
      data: caseStudy,
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
// POST /api/admin/home/case-studies
// Admin creates a new case study
// ─────────────────────────────────────────────
export const createCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Case study created successfully',
      data: caseStudy,
    });
  } catch (error) {
    // Handle duplicate slug
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A case study with this slug already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// ADMIN
// PUT /api/admin/home/case-studies/:id
// Admin edits case study + its sections
// ─────────────────────────────────────────────
export const updateCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case study updated successfully',
      data: caseStudy,
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
// DELETE /api/admin/home/case-studies/:id
// ─────────────────────────────────────────────
export const deleteCaseStudy = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findByIdAndDelete(req.params.id);

    if (!caseStudy) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case study deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};