/**
 * Government Schemes Controller
 * Handles retrieving and filtering government schemes data
 */

const fs = require('fs');
const path = require('path');

const SCHEMES_FILE = path.join(__dirname, '../data/governmentSchemes.json');

// Load schemes from JSON file
const loadSchemes = () => {
  try {
    const data = fs.readFileSync(SCHEMES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading schemes:', err);
    return { schemes: [] };
  }
};

/**
 * GET /api/schemes
 * Retrieve all government schemes with optional filtering
 */
exports.getAllSchemes = (req, res) => {
  try {
    const { category, search } = req.query;
    const data = loadSchemes();
    let schemes = data.schemes;

    // Filter by category if provided
    if (category) {
      schemes = schemes.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by search query if provided
    if (search) {
      const query = search.toLowerCase();
      schemes = schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query)
      );
    }

    res.status(200).json({
      success: true,
      data: schemes,
      total: schemes.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching schemes:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch schemes',
      message: err.message,
    });
  }
};

/**
 * GET /api/schemes/:id
 * Retrieve a specific scheme by ID
 */
exports.getSchemeById = (req, res) => {
  try {
    const { id } = req.params;
    const data = loadSchemes();
    const scheme = data.schemes.find((s) => s.id === id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        error: 'Scheme not found',
      });
    }

    res.status(200).json({
      success: true,
      data: scheme,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching scheme:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scheme',
      message: err.message,
    });
  }
};

/**
 * GET /api/schemes/categories/list
 * Retrieve all unique categories
 */
exports.getCategories = (req, res) => {
  try {
    const data = loadSchemes();
    const categories = [...new Set(data.schemes.map((s) => s.category))].sort();

    res.status(200).json({
      success: true,
      data: categories,
      total: categories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: err.message,
    });
  }
};

/**
 * POST /api/schemes/eligibility-check
 * Check eligibility for schemes based on user responses
 */
exports.checkEligibility = (req, res) => {
  try {
    const { answers } = req.body;

    // Simple eligibility logic based on answers
    const data = loadSchemes();
    const eligibleSchemes = [];

    data.schemes.forEach((scheme) => {
      let score = 0;

      // Basic checks based on scheme type
      if (scheme.id === 'pm-kisan') {
        if (answers.isLandowner && answers.landSize <= 2) score += 2;
        if (answers.income <= 1000000) score += 1;
      } else if (scheme.id === 'pmfby') {
        if (answers.isLandowner || answers.isTenantFarmer) score += 2;
        if (answers.hasInsurance === false) score += 1;
      } else if (scheme.id === 'kcc') {
        if (answers.isLandowner || answers.isTenantFarmer) score += 2;
        if (answers.hasBankAccount) score += 1;
        if (answers.age >= 18 && answers.age <= 75) score += 1;
      } else if (scheme.id === 'pmksy') {
        if (answers.hasIrrigationPotential) score += 2;
        if (answers.isLandowner) score += 1;
      } else if (scheme.id === 'pm-shram') {
        if (answers.age >= 18 && answers.age <= 40) score += 2;
        if (answers.income <= 15000) score += 1;
        if (!answers.hasPensionScheme) score += 1;
      } else if (scheme.id === 'ayushman') {
        if (answers.isBPL || answers.income <= 100000) score += 2;
      } else if (scheme.id === 'pm-awas') {
        if (!answers.hasHouse && answers.income <= 100000) score += 2;
        if (answers.isSCSTOrWoman) score += 1;
      } else if (scheme.id === 'mgnrega') {
        if (answers.age >= 18) score += 1;
        if (answers.isRural) score += 1;
      } else {
        // Default eligibility
        score = 1;
      }

      if (score > 0) {
        eligibleSchemes.push({
          id: scheme.id,
          name: scheme.name,
          category: scheme.category,
          eligibilityScore: score,
          likelyEligible: score >= 2,
        });
      }
    });

    // Sort by eligibility score
    eligibleSchemes.sort((a, b) => b.eligibilityScore - a.eligibilityScore);

    res.status(200).json({
      success: true,
      data: {
        eligibleSchemes,
        totalMatches: eligibleSchemes.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error checking eligibility:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to check eligibility',
      message: err.message,
    });
  }
};
