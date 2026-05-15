import Hero from '../../models/homePage/heroModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/home/hero
// Used by frontend Home.jsx to load hero content
// ─────────────────────────────────────────────
export const getHero = async (req, res) => {
  try {
    // Only ONE hero document exists
    // If none exists yet, return defaults from schema
    let hero = await Hero.findOne();

    if (!hero) {
      // Create default document on first request
      hero = await Hero.create({});
    }

    res.status(200).json({
      success: true,
      data: hero,
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
// PUT /api/admin/home/hero
// Admin panel updates hero content
// ─────────────────────────────────────────────
export const updateHero = async (req, res) => {
  try {
    const {
      headingLine1,
      headingLine2,
      headingLine3,
      typingPrefix,
      typedTexts,
      videoUrl,
      showreelGif,
      showreelVideo,
      showreelLabelLine1,
      showreelLabelLine2,
      scrollLabel,
    } = req.body;

    // Validate typedTexts array
    if (typedTexts && (!Array.isArray(typedTexts) || typedTexts.length < 1)) {
      return res.status(400).json({
        success: false,
        message: 'typedTexts must be an array with at least one item',
      });
    }

    // findOneAndUpdate with upsert ensures only ONE document exists
    const hero = await Hero.findOneAndUpdate(
      {},
      {
        headingLine1,
        headingLine2,
        headingLine3,
        typingPrefix,
        typedTexts,
        videoUrl,
        showreelGif,
        showreelVideo,
        showreelLabelLine1,
        showreelLabelLine2,
        scrollLabel,
      },
      {
        new: true,       // return updated document
        upsert: true,    // create if doesn't exist
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Hero updated successfully',
      data: hero,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};