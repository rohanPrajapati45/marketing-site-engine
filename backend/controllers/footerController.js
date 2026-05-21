import FooterSettings from "../models/FooterSettings.js";

// GET /api/footer — public, returns footer settings
export const getFooterSettings = async (req, res) => {
  try {
    const settings = await FooterSettings.getSingleton();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/footer/copyright — admin only, update copyright text
export const updateCopyright = async (req, res) => {
  try {
    const { copyrightText, showLogo } = req.body;
    const updateData = {};
    if (copyrightText !== undefined) {
      if (!copyrightText || !copyrightText.trim()) {
        return res.status(400).json({ success: false, message: "Copyright text is required" });
      }
      updateData.copyrightText = copyrightText.trim();
    }
    if (showLogo !== undefined) {
      updateData.showLogo = showLogo;
    }
    const settings = await FooterSettings.getSingleton(updateData);
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/footer/social — admin only, add a new social link
export const addSocialLink = async (req, res) => {
  try {
    const {
      platform, url, iconType, svgPath, svgViewBox, svgWidth, svgHeight,
      svgTransform, svgMarkup, imageUrl, isMultiPath, multiPaths,
    } = req.body;

    if (!platform || !url) {
      return res.status(400).json({ success: false, message: "Platform and URL are required" });
    }

    const settings = await FooterSettings.getSingleton();
    const newOrder = settings.socialLinks.length + 1;

    settings.socialLinks.push({
      platform,
      url,
      iconType: iconType || "svg-path",
      svgPath: svgPath || "",
      svgViewBox: svgViewBox || "0 0 24 24",
      svgWidth: svgWidth || "28",
      svgHeight: svgHeight || "28",
      svgTransform: svgTransform || "",
      svgMarkup: svgMarkup || "",
      imageUrl: imageUrl || "",
      isMultiPath: isMultiPath || false,
      multiPaths: multiPaths || [],
      order: newOrder,
      isActive: true,
    });

    await settings.save();
    return res.status(201).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/footer/social/reorder — admin only, reorder social links
export const reorderSocialLinks = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: "orderedIds array is required" });
    }

    const settings = await FooterSettings.getSingleton();

    orderedIds.forEach((id, index) => {
      const link = settings.socialLinks.id(id);
      if (link) {
        link.order = index + 1;
      }
    });

    await settings.save();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/footer/social/:id — admin only, update a specific social link
export const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await FooterSettings.getSingleton();
    const link = settings.socialLinks.id(id);

    if (!link) {
      return res.status(404).json({ success: false, message: "Social link not found" });
    }

    // Update allowed fields
    const updatableFields = [
      "platform", "url", "iconType", "svgPath", "svgViewBox", "svgWidth", "svgHeight",
      "svgTransform", "svgMarkup", "imageUrl", "isMultiPath", "multiPaths", "order", "isActive",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        link[field] = req.body[field];
      }
    });

    await settings.save();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/footer/social/:id — admin only, remove a social link
export const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await FooterSettings.getSingleton();

    const link = settings.socialLinks.id(id);
    if (!link) {
      return res.status(404).json({ success: false, message: "Social link not found" });
    }

    settings.socialLinks.pull(id);

    // Re-sequence order values
    settings.socialLinks
      .sort((a, b) => a.order - b.order)
      .forEach((l, i) => {
        l.order = i + 1;
      });

    await settings.save();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
