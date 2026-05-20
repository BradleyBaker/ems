const express = require('express');
const {
  getAllUsers,
  deleteUser,
  getAllEventsAdmin,
  deleteEventAdmin
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/events', getAllEventsAdmin);
router.delete('/events/:id', deleteEventAdmin);

module.exports = router;