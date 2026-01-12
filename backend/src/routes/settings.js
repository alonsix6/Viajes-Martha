import express from 'express';
import {
  getSettings,
  verifyPin,
  updatePin
} from '../controllers/settingsController.js';

const router = express.Router();

// GET /api/settings - Get settings (excluding sensitive data)
router.get('/', getSettings);

// POST /api/settings/verify-pin - Verify PIN authentication
router.post('/verify-pin', verifyPin);

// PUT /api/settings/pin - Update PIN
router.put('/pin', updatePin);

export default router;
