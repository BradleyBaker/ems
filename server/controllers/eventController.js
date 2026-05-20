const asyncHandler = require('../utils/asyncHandler');
const Event = require('../models/Event');

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

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, time, venue, image } = req.body;

  if (!title || !description || !category || !date || !time || !venue) {
    res.status(400);
    throw new Error('Please provide title, description, category, date, time, and venue');
  }

  const event = await Event.create({
    title,
    description,
    category,
    date,
    time,
    venue,
    image: image || '',
    organizer: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    event
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only update your own events');
  }

  const { title, description, category, date, time, venue, image } = req.body;

  if (!title || !description || !category || !date || !time || !venue) {
    res.status(400);
    throw new Error('Please provide title, description, category, date, time, and venue');
  }

  event.title = title;
  event.description = description;
  event.category = category;
  event.date = date;
  event.time = time;
  event.venue = venue;
  event.image = image || '';

  const updatedEvent = await event.save();

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    event: updatedEvent
  });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own events');
  }

  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    events
  });
});

module.exports = {
  getAllEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents
};