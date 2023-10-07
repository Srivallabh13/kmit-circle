import express from 'express';
import { deleteUser, remove, follow, getUnfollowedFollowers, getUser, getUserFriends, myProfile, getSuggestedUsers, searchUser } from '../controllers/user.js';
import {isAuth} from '../middlewares/auth.js'
const router = express.Router();

router.get('/friends/all', isAuth, getUserFriends)
router.get('/follow/user', isAuth, getUnfollowedFollowers)
router.get('/me', myProfile)
router.get('/:id', isAuth, getUser).delete('/:id', isAuth, deleteUser);
router.get('/follow/suggestions', isAuth, getSuggestedUsers)
router.get('/', isAuth, searchUser)

router.put('/:id', follow);
router.put('/:id/remove', remove);

export default router;