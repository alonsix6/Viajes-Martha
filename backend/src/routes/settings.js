import express from 'express';
import {
  getSettings,
  verifyPin,
  updatePin,
  getSetting,
  updateSetting
} from '../controllers/settingsController.js';

const router = express.Router();

// GET /api/settings - Get settings (excluding sensitive data)
router.get('/', getSettings);

// GET /api/settings/:key - Get specific setting
router.get('/:key', getSetting);

// POST /api/settings/verify-pin - Verify PIN authentication
router.post('/verify-pin', verifyPin);

// PUT /api/settings/pin - Update PIN
router.put('/pin', updatePin);

// PUT /api/settings/:key - Update specific setting
router.put('/:key', updateSetting);

export default router;
