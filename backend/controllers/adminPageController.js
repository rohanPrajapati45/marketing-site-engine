import Page from "../models/Page.js";
import Section from "../models/Section.js";

import StatCard from "../models/cards/StatCard.js";
import Max5Liner from "../models/cards/Max5Liner.js";
import StdCards from "../models/cards/StdCard.js";
import TeamCard from "../models/cards/TeamCard.js";
import UniqueCard from "../models/cards/UniqueCard.js";
import SmallLogo from "../models/cards/SmallLogo.js";
import MidLogo from "../models/cards/MidLogo.js";
import LargeLogo from "../models/cards/LargeLogo.js";

const cardModels = {
  "stat-card": StatCard,
  "max5liner-card": Max5Liner,
  "std-card": StdCards,
  "team-card": TeamCard,
  "unique-card": UniqueCard,
  "small-logo-card": SmallLogo,
  "mid-logo-card": MidLogo,
  "large-logo-card": LargeLogo,
};


// GET ALL PAGES
export const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ navOrder: 1, createdAt: -1 });

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




// GET SINGLE PAGE WITH FULL SECTIONS
export const getSinglePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const sections = await Section.find({
      page: page._id,
    }).sort({ order: 1 });

    const formattedSections = await Promise.all(
      sections.map(async (section) => {

        const sectionObj = section.toObject();

        // Only fetch cards from separate CardModel for standard sections with cardType
        try {
          if (section.data?.cardType && cardModels[section.data.cardType]) {
            const CardModel = cardModels[section.data.cardType];
            const cardData = await CardModel.findById(section.data.cardId);
            sectionObj.data.cards = cardData?.cards || [];
          }
          // gallery/slide-gallery/cta sections already have cards inline in section.data
        } catch (err) {
          console.error(`Error loading cards for section ${section._id}:`, err.message);
          sectionObj.data.cards = sectionObj.data.cards || [];
        }

        return sectionObj;
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        ...page.toObject(),
        sections: formattedSections,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// CREATE PAGE
export const createPage = async (req, res) => {
  try {
    const {
      slug,
      title,
      seo,
      isPublished,
      navTitle,
      showInNavbar,
      navOrder,
    } = req.body;

    // CHECK EXISTING PAGE
    const existingPage = await Page.findOne({ slug });

    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: "Slug already exists",
      });
    }

    // GET NEXT NAV ORDER
    const lastNavPage = await Page.findOne().sort({
      navOrder: -1,
    });

    const nextNavOrder =
      lastNavPage?.navOrder + 1 || 1;

    // CREATE PAGE
    const page = await Page.create({
      slug,
      title,
      seo,
      isPublished,

      navTitle:
        navTitle || title || slug,

      showInNavbar:
        showInNavbar ?? true,

      navOrder: nextNavOrder,
    });

    return res.status(201).json({
      success: true,
      data: page,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PAGE
export const updatePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const {
      slug,
      title,
      seo,
      isPublished,
      navTitle,
      showInNavbar,
      navOrder,
    } = req.body;

    if (slug !== undefined) {
      page.slug = slug;
    }

    if (title !== undefined) {
      page.title = title;
    }

    if (seo !== undefined) {
      page.seo = seo;
    }

    if (isPublished !== undefined) {
      page.isPublished = isPublished;
    }

    // UPDATE NAV TITLE
    if (navTitle !== undefined) {
      page.navTitle = navTitle;
    }

    // UPDATE SHOW IN NAVBAR
    if (showInNavbar !== undefined) {
      page.showInNavbar = showInNavbar;
    }

    if (navOrder !== undefined) {
      page.navOrder = navOrder;
    }

    await page.save();

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// DELETE PAGE
export const deletePage = async (req, res) => {
  try {
    const { pageId } = req.params;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const sections = await Section.find({
      page: page._id,
    });

    for (const section of sections) {
      if (section.data?.cardType && cardModels[section.data.cardType]) {
        const CardModel = cardModels[section.data.cardType];

        await CardModel.findOneAndDelete({
          sectionId: section._id,
        });
      }

      await Section.findByIdAndDelete(section._id);
    }

    await Page.findByIdAndDelete(pageId);

    return res.status(200).json({
      success: true,
      message: "Page deleted successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
