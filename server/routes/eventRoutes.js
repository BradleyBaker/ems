const express = require('express');
const {
	getAllEvents,
	getEventDetails,
	createEvent,
	updateEvent,
	deleteEvent,
	getMyEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);

// Organizer routes
router.get('/my-events', protect, authorizeRoles('organizer'), getMyEvents);

// Public routes (specific ID lookup - must come after /my-events)
router.get('/:id', getEventDetails);
router.post('/create', protect, authorizeRoles('organizer'), createEvent);
router.put('/:id', protect, authorizeRoles('organizer'), updateEvent);
router.delete('/:id', protect, authorizeRoles('organizer'), deleteEvent);

module.exports = router;