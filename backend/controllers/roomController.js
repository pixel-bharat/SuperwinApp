const Room = require('../models/room');
const User = require('../models/user');
const JoinedUser = require('../models/joinedUser');

const createRoom = async (req, res) => {
  const { roomID, roomName, roomType, uid, roles } = req.body;
  try {
    // Check if the roomID already exists
    const existingRoom = await Room.findOne({ roomID });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room ID already exists' });
    }
    // Extract the total number of members from roomType and format members as "1/totalMembers"
    const totalMembers = parseInt(roomType.split('_')[0]);
    const membercount = `${1}/${totalMembers}`;
    // Create a new room
    const newRoom = new Room({
      uid,
      roomID,
      roomType,
      roomName,
      membercount
      // roles: [`${uid}`], // Assigning the role of "admin" to the user who creates the room
    });
    await newRoom.save();
    res.json({ message: 'Room created successfully', room: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomID } = req.body;
    const uid = req.user.userId;
    // console.log(roomID);
    // console.log(uid);
    const existingRoom = await Room.findOne({ roomID });
    if (!existingRoom) {
      return res.status(400).json({ message: 'Room ID not found' });
    }
    // Check if the user is the admin of the room
    if (existingRoom.uid === uid) {
      return res.status(400).json({ message: 'You are already the admin of the room' });
    }
    // Check if the user is already a member of the room
    if (existingRoom.members.includes(uid)) {
      return res.status(400).json({ message: 'User is already a member of the room' });
    }

    let [currentMembers, totalMembers] = existingRoom.membercount.split('/').map(Number);
    currentMembers += 1;
    existingRoom.membercount = `${currentMembers}/${totalMembers}`;
    existingRoom.members.push(uid);
    await existingRoom.save();
    await User.updateOne(
      { uniqueId: uid },
      {
        $addToSet: { rooms: roomID }
      }
    );
    res.json({ message: 'Joined room successfully', existingRoom });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ message: 'Failed to join room' });
  }
};

const getAdminRooms = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Fetch rooms created by the user
    let recentRooms = await Room.find({ uid: user.uniqueId }).sort({
      createdAt: -1
    });
    // Adding message and role to each room item
    recentRooms = recentRooms.map((room) => ({
      ...room.toObject(), // Convert Mongoose document to plain JavaScript object
      role: 'Admin',
      navigate: 'adminroom'
    }));
    res.json(recentRooms);
  } catch (error) {
    console.error('Error fetching recent rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMemberRooms = async (req, res) => {
  try {
    const user = await User.findOne({ uniqueId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Fetch rooms where the user is in the roles array
    let recentRooms = await Room.find({
      members: user.uniqueId
    }).sort({ createdAt: -1 });
    // Adding message and role to each room item
    recentRooms = recentRooms.map((room) => ({
      ...room.toObject(), // Convert Mongoose document to plain JavaScript object
      role: 'Member',
      navigate: 'RoomUser'
    }));
  
    res.json(recentRooms);
  } catch (error) {
    console.error('Error fetching recent rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getAdminRooms,
  getMemberRooms
};
