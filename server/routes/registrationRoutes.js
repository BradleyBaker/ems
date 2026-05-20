const express = require('express');
const {
  getAllEvents,
  getEventDetails,
  registerForEvent,
  getMyRegistrations
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/events', getAllEvents);
router.get('/events/:id', getEventDetails);

// Protected routes (participant only)
router.post('/register/:eventId', protect, authorizeRoles('participant'), registerForEvent);
router.get('/my-registrations', protect, authorizeRoles('participant'), getMyRegistrations);

module.exports = router;
