/**
 * Government Schemes Routes
 * API endpoints for government schemes
 */

const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  getCategories,
  checkEligibility,
} = require('../controllers/schemesController');

/**
 * GET /api/schemes
 * Retrieve all schemes (with optional filtering)
 * Query params: category, search
 */
router.get('/', getAllSchemes);

/**
 * GET /api/schemes/categories/list
 * Get all unique categories
 */
router.get('/categories/list', getCategories);

/**
 * GET /api/schemes/:id
 * Get a specific scheme by ID
 */
router.get('/:id', getSchemeById);

/**
 * POST /api/schemes/eligibility-check
 * Check eligibility for schemes based on user answers
 */
router.post('/eligibility-check', checkEligibility);

module.exports = router;
