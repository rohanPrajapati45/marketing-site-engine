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

export const allowedSectionTypes = [
  // NORMAL SECTIONS
  "slide-gallery",
  "gallery",
  "tagline",
  "cta",
  "standard",
  "empty",
  "hero-section",
  "project-section",
  "sticky-services",
  "work-category-menu",
  "solution-section",
  "contact-hero",
  "branch-section",
];


// CREATE SECTION
export const createSection = async (req, res) => {
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

    // Return the section with cards populated for immediate UI update
    const responseSection = section.toObject();
    if (cardType) {
      responseSection.data.cards = cards || [];
    }

    return res.status(201).json({
      success: true,
      data: responseSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE SECTION
export const updateSection = async (req, res) => {
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

    // ─── HANDLE CARDTYPE SWITCHING ───
    const oldCardType = section.data?.cardType;
    const newCardType = cardType !== undefined ? cardType : oldCardType;
    const cardTypeChanged = oldCardType && newCardType && oldCardType !== newCardType;

    if (cardTypeChanged) {
      // 1. Delete old card document
      const OldCardModel = cardModels[oldCardType];
      if (OldCardModel) {
        await OldCardModel.findOneAndDelete({ sectionId: section._id });
      }

      // 2. Create new empty card document
      const NewCardModel = cardModels[newCardType];
      if (NewCardModel) {
        const newCardDoc = await NewCardModel.create({
          sectionId: section._id,
          cards: [],
        });

        // 3. Update section data with new cardType and cardId
        section.data = {
          ...section.data,
          ...sectionData,
          cardType: newCardType,
          cardId: newCardDoc._id,
        };
      }
    } else {
      // Normal section data update (no cardType change)
      section.data = {
        ...section.data,
        ...sectionData,
      };

      // Preserve/set cardType if provided
      if (cardType !== undefined) {
        section.data.cardType = cardType;
      }
    }

    // UPDATE CARD DATA (only if cardType did NOT change — switching resets cards)
    if (!cardTypeChanged && section.data.cardType) {
      const CardModel = cardModels[section.data.cardType];

      if (CardModel && cards !== undefined) {
        // Auto-assign order to cards that are missing it
        let maxOrder = 0;
        cards.forEach((c) => {
          if (c.order !== undefined && c.order !== null) {
            maxOrder = Math.max(maxOrder, Number(c.order));
          }
        });
        const orderedCards = cards.map((c) => {
          if (c.order === undefined || c.order === null) {
            maxOrder += 1;
            return { ...c, order: maxOrder };
          }
          return c;
        });

        await CardModel.findOneAndUpdate(
            { sectionId: section._id },
            { cards: orderedCards },
            { new: true, upsert: true }
        );
      }
    }

    // Mark data as modified since it's a Mixed type
    section.markModified('data');
    await section.save();

    // Build response with cards populated
    const responseSection = section.toObject();
    if (responseSection.data?.cardType && responseSection.data?.cardId) {
      const CardModel = cardModels[responseSection.data.cardType];
      if (CardModel) {
        const cardDoc = await CardModel.findById(responseSection.data.cardId);
        responseSection.data.cards = cardDoc?.cards || [];
      }
    }

    return res.status(200).json({
      success: true,
      data: responseSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE SECTION
export const deleteSection = async (req, res) => {
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
    if (section.data?.cardType) {
      const CardModel =
  cardModels[section.data.cardType];

      if (CardModel) {
        await CardModel.findOneAndDelete({
        sectionId: section._id,
        });
      }
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
