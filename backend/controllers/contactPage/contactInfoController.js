import ContactInfo from '../../models/contactPage/contactInfoModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/contact/info
// Used by Contact.jsx to load heading, emails, phones, whatsapp
// ─────────────────────────────────────────────
export const getContactInfo = async (req, res) => {
  try {
    // Only ONE contact info document exists
    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      // Create default document on first request
      contactInfo = await ContactInfo.create({});
    }

    res.status(200).json({
      success: true,
      data: contactInfo,
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
// PUT /api/admin/contact/info
// Admin updates heading, emails, phones, whatsapp
// ─────────────────────────────────────────────
export const updateContactInfo = async (req, res) => {
  try {
    const {
      heading,
      emails,
      phones,
      whatsappNumber,
      whatsappIcon,
    } = req.body;

    // Validate emails array if provided
    if (emails && (!Array.isArray(emails))) {
      return res.status(400).json({
        success: false,
        message: 'emails must be an array',
      });
    }

    // Validate phones array if provided
    if (phones && (!Array.isArray(phones))) {
      return res.status(400).json({
        success: false,
        message: 'phones must be an array',
      });
    }

    // findOneAndUpdate with upsert ensures only ONE document exists
    const contactInfo = await ContactInfo.findOneAndUpdate(
      {},
      {
        heading,
        emails,
        phones,
        whatsappNumber,
        whatsappIcon,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Contact info updated successfully',
      data: contactInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};