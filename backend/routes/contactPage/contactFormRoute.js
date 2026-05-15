import express from 'express';
import {
  getContactForm,
  updateContactForm,
  addFormField,
  updateFormField,
  deleteFormField,
  reorderFormFields,
} from '../../controllers/contactPage/contactFormController.js';

const router = express.Router();

// PUBLIC
router.get('/', getContactForm);

// ADMIN — update entire form
router.put('/', updateContactForm);

// ADMIN — manage individual fields
router.post('/fields', addFormField);
router.put('/fields/:fieldId', updateFormField);
router.delete('/fields/:fieldId', deleteFormField);
router.patch('/fields/reorder', reorderFormFields); // must be before /:fieldId

export default router;