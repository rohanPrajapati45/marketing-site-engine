import ContactForm from '../../models/contactPage/contactFormModel.js';

// ─────────────────────────────────────────────
// PUBLIC
// GET /api/contact/form
// Returns contact form structure (heading, paragraphs, fields)
// Used by Contact.jsx to render the form
// ─────────────────────────────────────────────
export const getContactForm = async (req, res) => {
  try {
    // Only ONE contact form document exists
    let contactForm = await ContactForm.findOne();

    if (!contactForm) {
      // Create default document on first request
      contactForm = await ContactForm.create({});
    }

    // Sort fields by order before sending
    if (contactForm.fields) {
      contactForm.fields.sort((a, b) => a.order - b.order);
    }

    res.status(200).json({
      success: true,
      data: contactForm,
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
// PUT /api/admin/contact/form
// Admin updates heading, paragraphs, and form fields
// ─────────────────────────────────────────────
export const updateContactForm = async (req, res) => {
  try {
    const {
      heading,
      paragraphs,
      fields,
      submitText,
    } = req.body;

    // Validate fields array if provided
    if (fields && (!Array.isArray(fields))) {
      return res.status(400).json({
        success: false,
        message: 'fields must be an array',
      });
    }

    // Validate paragraphs array if provided
    if (paragraphs && (!Array.isArray(paragraphs))) {
      return res.status(400).json({
        success: false,
        message: 'paragraphs must be an array',
      });
    }

    // findOneAndUpdate with upsert ensures only ONE document exists
    const contactForm = await ContactForm.findOneAndUpdate(
      {},
      {
        heading,
        paragraphs,
        fields,
        submitText,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Contact form updated successfully',
      data: contactForm,
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
// POST /api/admin/contact/form/fields
// Admin adds a new form field
// ─────────────────────────────────────────────
export const addFormField = async (req, res) => {
  try {
    const {
      name,
      placeholder,
      type,
      cols,
      required,
    } = req.body;

    // Validate required fields
    if (!name || !placeholder || !type) {
      return res.status(400).json({
        success: false,
        message: 'name, placeholder, and type are required',
      });
    }

    // Get existing form or create new
    let contactForm = await ContactForm.findOne();
    if (!contactForm) {
      contactForm = await ContactForm.create({});
    }

    // Auto-assign order as last in list
    const lastFieldOrder = contactForm.fields.length > 0
      ? Math.max(...contactForm.fields.map(f => f.order))
      : 0;

    const newField = {
      order: lastFieldOrder + 1,
      name,
      placeholder,
      type,
      cols: cols ?? 1,
      required: required ?? false,
      active: true,
    };

    contactForm.fields.push(newField);
    await contactForm.save();

    res.status(201).json({
      success: true,
      message: 'Form field added successfully',
      data: contactForm,
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
// PUT /api/admin/contact/form/fields/:fieldId
// Admin edits a form field
// ─────────────────────────────────────────────
export const updateFormField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const updates = req.body;

    const contactForm = await ContactForm.findOne();
    if (!contactForm) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found',
      });
    }

    // Find the field by _id
    const field = contactForm.fields.id(fieldId);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found',
      });
    }

    // Update field properties
    Object.assign(field, updates);
    await contactForm.save();

    res.status(200).json({
      success: true,
      message: 'Form field updated successfully',
      data: contactForm,
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
// DELETE /api/admin/contact/form/fields/:fieldId
// Admin removes a form field
// ─────────────────────────────────────────────
export const deleteFormField = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const contactForm = await ContactForm.findOne();
    if (!contactForm) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found',
      });
    }

    // Remove field by _id
    contactForm.fields.id(fieldId).deleteOne();
    await contactForm.save();

    res.status(200).json({
      success: true,
      message: 'Form field deleted successfully',
      data: contactForm,
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
// PATCH /api/admin/contact/form/fields/reorder
// Admin drags to reorder form fields
// Body: [{ fieldId: '...', order: 1 }, { fieldId: '...', order: 2 }]
// ─────────────────────────────────────────────
export const reorderFormFields = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items must be a non-empty array of { fieldId, order }',
      });
    }

    const contactForm = await ContactForm.findOne();
    if (!contactForm) {
      return res.status(404).json({
        success: false,
        message: 'Contact form not found',
      });
    }

    // Update order for each field
    items.forEach(({ fieldId, order }) => {
      const field = contactForm.fields.id(fieldId);
      if (field) {
        field.order = order;
      }
    });

    await contactForm.save();

    res.status(200).json({
      success: true,
      message: 'Form fields reordered successfully',
      data: contactForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};