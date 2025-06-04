const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const groupController = require('../controllers/groupController');

router.post('/', auth, groupController.createGroup);
router.post('/:groupId/invite', auth, groupController.inviteUser);
router.post('/:groupId/join', auth, groupController.joinGroup);
router.get('/user/:userId', auth, groupController.getUserGroups);
router.get('/users/:userId/groups', auth, groupController.getUserGroups);

module.exports = router;

