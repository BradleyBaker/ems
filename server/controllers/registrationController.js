const asyncHandler = require('../utils/asyncHandler');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');

// Get All Events (Public)
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: events.length,
    events
  });
});

// Get Single Event Details
const getEventDetails = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name email');

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.status(200).json({
    success: true,
    event
  });
});

// Register for Event (Participant only)
const registerForEvent = asyncHandler(async (req, res) => {
  // Check if user is participant
  if (req.user.role !== 'participant') {
    res.status(403);
    throw new Error('Only participants can register for events');
  }

  const event = await Event.findById(req.params.eventId);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if already registered
  const existingRegistration = await Registration.findOne({
    user: req.user._id,
    event: req.params.eventId
  });

  if (existingRegistration) {
    res.status(400);
    throw new Error('You are already registered for this event');
  }

  // Create registration
  const registration = await Registration.create({
    user: req.user._id,
    event: req.params.eventId,
    registrationDate: new Date()
  });

  res.status(201).json({
    success: true,
    message: 'Successfully registered for the event',
    registration
  });
});

// Get My Registrations (Participant)
const getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate({
      path: 'event',
      populate: { path: 'organizer', select: 'name email' }
    })
    .sort({ registrationDate: -1 });

  res.status(200).json({
    success: true,
    count: registrations.length,
    registrations
  });
});

module.exports = {
  getAllEvents,
  getEventDetails,
  registerForEvent,
  getMyRegistrations
};
