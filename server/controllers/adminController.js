const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const userEvents = await Event.find({ organizer: user._id }).select('_id');
  const eventIds = userEvents.map((event) => event._id);

  if (eventIds.length > 0) {
    await Registration.deleteMany({ event: { $in: eventIds } });
    await Event.deleteMany({ _id: { $in: eventIds } });
  }

  await Registration.deleteMany({ user: user._id });
  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

const getAllEventsAdmin = asyncHandler(async (req, res) => {
  const events = await Event.find()
    .populate('organizer', 'name email role')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: events.length,
    events
  });
});

const deleteEventAdmin = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully'
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
  getAllEventsAdmin,
  deleteEventAdmin
};