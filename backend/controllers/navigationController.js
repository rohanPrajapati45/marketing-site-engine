import Page from "../models/Page.js";

// GET NAVIGATION ITEMS
export const getNavigation = async (req, res) => {
  try {

    const pages = await Page.find({
      isPublished: true,
      showInNavbar: true,
    })
      .select("slug navTitle navOrder")
      .sort({ navOrder: 1 });

    return res.status(200).json({
      success: true,
      data: pages,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};