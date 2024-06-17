const Room = require('../Models/Room');

const createRoom = async (req, res) => {
  const { name, adminUid } = req.body; // Assuming admin UID is passed from the frontend
  try {
    // Create a new room with the admin UID
    const room = new Room({
      name,
      admin: adminUid,
    });
    await room.save();
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

module.exports = { createRoom };