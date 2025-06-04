const Group = require('../models/Group');
const GroupMember = require('../models/GroupMember');
const User = require('../models/user');
const crypto = require('crypto');


exports.createGroup = async (req, res) => {
	
// console.log('req.user:', req.user);
// console.log('req.user.id:', req.user?.id);

  try {
    const { name } = req.body;
    const ownerId = req.user.id;

    const group = new Group({ name, ownerId });
    await group.save();

    // Add owner as group member
    const member = new GroupMember({ groupId: group._id, userId: ownerId });
    await member.save();

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

let inviteTokens = {}; // Temporary in-memory store for invite tokens (will improve later)

exports.inviteUser = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    // Check if group exists
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // Generate token (simple random hex)
    const token = crypto.randomBytes(20).toString('hex');
    inviteTokens[token] = { groupId, email, createdAt: Date.now() };

    // Here, you would email the token link to the user
    // For now, just return token for testing
    res.json({ inviteLink: `/api/groups/${groupId}/join?token=${token}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { token } = req.query;
    const userId = req.user.id;
    const userEmail = req.user.email;

    console.log('--- joinGroup called ---');
    console.log('groupId param:', groupId);
    console.log('token query:', token);
    console.log('req.user.id:', userId);
    console.log('req.user.email:', userEmail);

    const invite = inviteTokens[token];
    console.log('inviteTokens store:', inviteTokens);
    console.log('invite for token:', invite);

    if (!invite) {
      console.log('Invite token not found in store');
      return res.status(400).json({ message: 'Invalid or expired invite token' });
    }

    
    if (invite.groupId.toString() !== groupId.toString()) {
      console.log('Group ID does not match');
      return res.status(400).json({ message: 'Invalid or expired invite token' });
    }

    if (invite.email !== userEmail) {
      console.log(`Invite email ${invite.email} does not match user email ${userEmail}`);
      return res.status(403).json({ message: 'This invite is not for your email' });
    }

 
    const existingMember = await GroupMember.findOne({ groupId, userId });
    if (existingMember) return res.status(400).json({ message: 'Already a group member' });

    const member = new GroupMember({ groupId, userId });
    await member.save();

    delete inviteTokens[token];

    res.json({ message: 'Joined group successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    
    const memberships = await GroupMember.find({ userId }).populate('groupId');

    // Map to groups
    const groups = memberships.map(m => m.groupId);

    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
