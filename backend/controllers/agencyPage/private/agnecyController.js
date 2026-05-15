import Page from "../models/Page.js";
import Section from "../models/Section.js";

import StatCard from "../models/cards/StatCard.js";
import Max5Liner from "../models/cards/Max5Liner.js";
import StdCards from "../models/cards/StdCards.js";
import TeamCard from "../models/cards/TeamCard.js";
import UniqueCard from "../models/cards/UniqueCard.js";
import SmallLogo from "../models/cards/SmallLogo.js";
import MidLogo from "../models/cards/MidLogo.js";
import LargeLogo from "../models/cards/LargeLogo.js";

const cardModels = {
  StatCard,
  Max5Liner,
  StdCards,
  TeamCard,
  UniqueCard,
  SmallLogo,
  MidLogo,
  LargeLogo,
};


// CREATE SECTION
export const createAgencySection = async (req, res) => {
  try {
    const { type, data } = req.body;

    const page = await Page.findOne({ slug: "agency" });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Agency page not found",
      });
    }

    const lastSection = await Section.findOne({
      page: page._id,
    }).sort({ order: -1 });

    const nextOrder = lastSection ? lastSection.order + 1 : 1;

    const section = await Section.create({
      page: page._id,
      type,
      order: nextOrder,
      enabled: true,
      data: {},
    });
    
    const { cards, ...sectionData } = data;


    // CARD MODEL EXISTS
    if (cardModels[type]) {

    const CardModel = cardModels[type];

    const cardDoc = await CardModel.create({
        sectionId: section._id,
        cards: cards || [],
    });

    section.data = {
        ...sectionData,
        cardId: cardDoc._id,
    };

    await section.save();

    } else {

    section.data = sectionData;

    await section.save();
    }

    page.sections.push(section._id);
    await page.save();

    return res.status(201).json({
      success: true,
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL AGENCY SECTIONS
export const getAgencySections = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: "agency" });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Agency page not found",
      });
    }

    const sections = await Section.find({
      page: page._id,
      enabled: true,
    }).sort({ order: 1 });

    const formattedSections = await Promise.all(
      sections.map(async (section) => {
        const sectionObj = section.toObject();

        // CARD TYPE SECTION
        if (cardModels[section.type]) {
          const CardModel = cardModels[section.type];

          const cardData = await CardModel.findById(
            section.data.cardId
          );

          sectionObj.data.cards = cardData?.cards || [];
        }

        return sectionObj;
      })
    );

    return res.status(200).json({
      success: true,
      data: formattedSections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE SECTION
export const updateAgencySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const { enabled, order, data } = req.body;

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // UPDATE ENABLED
    if (enabled !== undefined) {
      section.enabled = enabled;
    }

    // UPDATE ORDER
    if (order !== undefined) {
      section.order = order;
    }

    const { cards, ...sectionData } = data || {};

    // UPDATE SECTION DATA
    section.data = {
      ...section.data,
      ...sectionData,
    };

    // UPDATE CARD DATA
    if (cardModels[section.type]) {
      const CardModel = cardModels[section.type];

      await CardModel.findOneAndUpdate(
        {
          sectionId: section._id,
        },
        {
          cards: cards || [],
        },
        {
          new: true,
        }
      );
    }

    await section.save();

    return res.status(200).json({
      success: true,
      data: section,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SECTION
export const deleteAgencySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // DELETE CARD DOCUMENTS
    if (cardModels[section.type]) {
      const CardModel = cardModels[section.type];

      await CardModel.deleteMany({
        sectionId: section._id,
      });
    }

    // REMOVE SECTION FROM PAGE
    await Page.updateOne(
      {
        _id: section.page,
      },
      {
        $pull: {
          sections: section._id,
        },
      }
    );

    // DELETE SECTION
    await Section.findByIdAndDelete(sectionId);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
