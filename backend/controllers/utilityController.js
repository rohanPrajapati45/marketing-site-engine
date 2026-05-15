// REORDER SECTIONS
export const reorderSections = async (req, res) => {
  try {

    const { pageId } = req.params;

    const { sections } = req.body;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: "Sections array is required",
      });
    }



    await Promise.all(

      sections.map(async (item) => {

        await Section.findByIdAndUpdate(
          item.sectionId,
          {
            order: item.order,
          }
        );
      })
    );



    return res.status(200).json({
      success: true,
      message: "Sections reordered successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// REORDER CARDS
export const reorderCards = async (req, res) => {
  try {

    const { sectionId } = req.params;

    const { cards } = req.body;

    if (!Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        message: "Cards array is required",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    if (
      !section.data?.cardType
    ) {
      return res.status(400).json({
        success: false,
        message: "This section has no cards",
      });
    }



    const CardModel =
      cardModels[section.data.cardType];



    const cardDoc =
      await CardModel.findOne({
        sectionId: section._id,
      });

    if (!cardDoc) {
      return res.status(404).json({
        success: false,
        message: "Card document not found",
      });
    }



    cardDoc.cards = cards;

    await cardDoc.save();



    return res.status(200).json({
      success: true,
      message: "Cards reordered successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

