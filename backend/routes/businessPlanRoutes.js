const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generatePlan,
  getMyPlans,
  getPlanById,
  deletePlan,
} = require('../controllers/businessPlanController');

// All routes protected by JWT middleware
router.post('/generate', protect, generatePlan);
router.get('/', protect, getMyPlans);
router.get('/:id', protect, getPlanById);
router.delete('/:id', protect, deletePlan);

module.exports = router;
