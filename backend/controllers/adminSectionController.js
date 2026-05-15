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

export const allowedSectionTypes = [
  // NORMAL SECTIONS
  "slide-gallery",
  "gallery",
  "tagline",
  "cta",
  "standard",
];


// CREATE SECTION
export const createAgencySection = async (req, res) => {
  try {
    const { type, data } = req.body;

    const {
    cards,
    cardType,
    ...sectionData
    } = data || {};

    
const { pageId } = req.params;

const page = await Page.findById(pageId);


    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    if (!allowedSectionTypes.includes(type)) {
    return res.status(400).json({
        success: false,
        message: "Invalid section type",
    });
    }

    if (
    cardType &&
    !cardModels[cardType]
    ) {
    return res.status(400).json({
        success: false,
        message: "Invalid card type",
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

    // CARD MODEL EXISTS
    
    if (cardType) {

    const CardModel = cardModels[cardType];

    const cardDoc = await CardModel.create({
        sectionId: section._id,
        cards: cards || [],
    });

    section.data = {
        ...sectionData,
        cardType,
        cardId: cardDoc._id,
    };

    } else {

    section.data = sectionData;
    }

    await section.save();



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


// UPDATE SECTION
export const updateAgencySection = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const { enabled, order, data } = req.body;
    const {
        cards,
        cardType,
        ...sectionData
    } = data || {};

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


    // UPDATE SECTION DATA
    section.data = {
      ...section.data,
      ...sectionData,
    };

    // UPDATE CARD DATA
    if (section.data.cardType){
      const CardModel =
  cardModels[section.data.cardType];

        if (cards !== undefined) {
        await CardModel.findOneAndUpdate(
            { sectionId: section._id },
            { cards },
            { new: true }
        );
        }
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
    if (section.data.cardType) {
      const CardModel =
  cardModels[section.data.cardType];

        await CardModel.findOneAndDelete({
        sectionId: section._id,
        });
    }

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
