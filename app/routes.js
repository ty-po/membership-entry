var express     = require('express');
var router      = express.Router();

var ctrl  = require('./ctrl.js');
var auth  = ctrl.Auth;

router.use(require('express-uncapitalize')());

router.route('/')
  .get(auth.isUser, function(req, res) {
    res.json({'message': 'you are authenticated'});
  });

//-------------------- User-Side Routes --------------------
//User CRUD
router.route('/:_(users|u)')
  .get(auth.isUser, ctrl.User.getAll)
  .post(ctrl.User.post);
router.route('/:_(users|u)/:handle/')
  .get(auth.isUser, ctrl.User.get)
  .put(auth.isUser, auth.isMe, ctrl.User.put)
  .delete(auth.isUser, auth.isMe, ctrl.User.del);
//User Standing
router.route('/:_(users|u)/:handle/:_(orgs|o)')
  .get(auth.isUser, auth.isMe, ctrl.Standing.getUser)
router.route('/:_(users|u)/:handle/:_(orgs|o)/:url')
  .get(auth.isUser, auth.isMe, ctrl.Standing.get)
router.route('/:_(users|u)/:handle/:_(membership|m)')
  .get(auth.isUser, ctrl.Standing.getUserMembership)
router.route('/:_(users|u)/:handle/:_(membership|m)/:url')
  .get(auth.isUser, ctrl.Standing.getMembership)

//-------------------- Org-Side Routes --------------------
//Org CRUD
router.route('/:_(orgs|o)')
  .get(auth.isUser, ctrl.Org.getAll)
  .post(auth.isUser, ctrl.Org.post);
router.route('/:_(orgs|o)/:url')
  .get(auth.isUser, ctrl.Org.get)
  .put(auth.isUser, auth.isOwner, ctrl.Org.put)
  .delete(auth.isUser, auth.isOwner, ctrl.Org.del);
//Standing CRUD
router.route('/:_(orgs|o)/:url/:_(users|u)/')
  .get(auth.isUser, auth.isMember, ctrl.Standing.getOrg)
  .post(auth.isUser, auth.isAdmin, ctrl.Standing.post)
router.route('/:_(orgs|o)/:url/:_(users|u)/:handle')
  .get(auth.isUser, auth.isMember, ctrl.Standing.get)
  .put(auth.isUser, auth.isAdmin, ctrl.Standing.put)
  .delete(auth.isUser, auth.isAdmin, ctrl.Standing.del);
router.route('/:_(orgs|o)/:url/:_(membership|m)/')
  .get(auth.isUser, ctrl.Standing.getOrgMembership)
router.route('/:_(orgs|o)/:url/:_(membership|m)/:handle')
  .get(auth.isUser, ctrl.Standing.getMembership)
//Event CRUD
router.route('/:_(orgs|o)/:url/:_(events|e)')
  .get(auth.isUser, ctrl.Event.getAll)
  .post(auth.isUser, auth.isAdmin, ctrl.Event.post);
router.route('/:_(orgs|o)/:url/:_(events|e)/:id')
  .post(auth.isUser, auth.isMember, ctrl.Attend.post)
  .get(auth.isUser, ctrl.Event.get)
  .put(auth.isUser, auth.isAdmin, ctrl.Event.put)
  .delete(auth.isUser, auth.isAdmin, ctrl.Event.del);

//TODO: Add attend gets
module.exports = router;
