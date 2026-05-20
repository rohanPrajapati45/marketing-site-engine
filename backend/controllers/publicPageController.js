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



// GET PUBLIC PAGE
export const getPublicPage = async (req, res) => {
  try {

    const { slug } = req.params;

    // FIND PAGE
    const page = await Page.findOne({
      slug,
      isPublished: true,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // GET ENABLED SECTIONS ONLY
    const sections = await Section.find({
      page: page._id,
      enabled: true,
    }).sort({ order: 1 });



    // FORMAT RESPONSE
    const formattedSections = await Promise.all(

      sections.map(async (section) => {

        const sectionObj = section.toObject();
        sectionObj.pageSlug = page.slug;


        // CARD BASED SECTION
        if (
          section.data?.cardType &&
          section.data?.cardId
        ) {

          const CardModel =
            cardModels[section.data.cardType];



          if (CardModel) {

            const cardDoc =
              await CardModel.findById(
                section.data.cardId
              );



            sectionObj.data.cards =
              (cardDoc?.cards || [])
              .filter(card => card.active)
              .sort((a, b) => a.order - b.order);
          }
        }



        return sectionObj;
      })
    );



    return res.status(200).json({
      success: true,

      data: {
        page: {
          slug: page.slug,
          title: page.title,
          seo: page.seo,
        },

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
