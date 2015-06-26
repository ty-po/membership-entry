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
  .get(auth.isUser, ctrl.Standing.getUser)
router.route('/:_(users|u)/:handle/:_(orgs|o)/:url')
  .get(auth.isUser, ctrl.Standing.get)

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
  .get(auth.isUser, ctrl.Standing.getOrg)
  .post(auth.isUser, auth.isAdmin, ctrl.Standing.post)
router.route('/:_(orgs|o)/:url/:_(users|u)/:handle')
  .get(auth.isUser, ctrl.Standing.get)
  .put(auth.isUser, auth.isAdmin, ctrl.Standing.put)
  .delete(auth.isUser, auth.isAdmin, ctrl.Standing.del);
//Event CRUD
router.route('/:_(orgs|o)/:url/:_(events|e)')
  .get(auth.isUser, auth.isMember, ctrl.Event.getAll)
  .post(auth.isUser, auth.isAdmin, ctrl.Event.post);
router.route('/:_(orgs|o)/:url/:_(events|e)/:id')
  .post(auth.isUser, auth.isMember, ctrl.Attend.post)
  .get(auth.isUser, auth.isMember, ctrl.Event.get)
  .put(auth.isUser, auth.isAdmin, ctrl.Event.put)
  .delete(auth.isUser, auth.isAdmin, ctrl.Event.del);


module.exports = router;
