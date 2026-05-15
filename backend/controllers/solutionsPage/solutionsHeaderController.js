import SolutionsHeader from '../../models/solutionsPage/solutionsHeaderModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/solutions/header
// Used by Solutions.jsx to load page heading and subtext
// ─────────────────────────────────────────────
export const getSolutionsHeader = async (req, res) => {
  try {
    let header = await SolutionsHeader.findOne();

    if (!header) {
      header = await SolutionsHeader.create({});
    }

    res.status(200).json({
      success: true,
      data: header,
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
// PUT /api/admin/solutions/header
// Admin updates page heading and subtext
// ─────────────────────────────────────────────
export const updateSolutionsHeader = async (req, res) => {
  try {
    const { heading, subtext } = req.body;

    if (!heading || !subtext) {
      return res.status(400).json({
        success: false,
        message: 'heading and subtext are required',
      });
    }

    const header = await SolutionsHeader.findOneAndUpdate(
      {},
      { heading, subtext },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Solutions header updated successfully',
      data: header,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};