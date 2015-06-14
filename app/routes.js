var express     = require('express');
var router      = express.Router();

var ctrl  = require('./ctrl.js');
var auth  = ctrl.Auth

router.route('/')
  .get(auth.isUser, function(req, res) {
    res.send('index')
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
//User Status
router.route('/:_(users|u)/:handle/:_(orgs|o)')
  .get(auth.isUser, ctrl.Status.getAll)
router.route('/:_(users|u)/:handle/:_(orgs|o)/:url')
  .get(auth.isUser, ctrl.Status.get)

//-------------------- Org-Side Routes --------------------
//Org CRUD
router.route('/:_(orgs|o)')
  .get(auth.isUser, ctrl.Org.getAll)
  .post(auth.isUser, ctrl.Org.post);
router.route('/:_(orgs|o)/:url')
  .post(auth.isUser, ctrl.Status.post)
  .get(auth.isUser, ctrl.Org.get)
  .put(auth.isUser, auth.isOwner, ctrl.Org.put)
  .delete(auth.isUser, auth.isOwner, ctrl.Org.del);
//Status CRUD
router.route('/:_(orgs|o)/:url/:_(users|u)/:type?')
  .get(auth.isUser, ctrl.Status.getAll)
router.route('/:_(orgs|o)/:url/:_(users|u)/:handle')
  .get(auth.isUser, ctrl.Status.get)
  .put(auth.isUser, ctrl.Status.put)
  .delete(auth.isUser, ctrl.Status.del);
//Event CRUD
router.route('/:_(orgs|o)/:url/:_(events|e)')
  .get(auth.isUser, ctrl.Event.getAll)
  .post(auth.isUser, ctrl.Event.post);
router.route('/:_(orgs|o)/:url/:_(events|e)/:id')
  .post(auth.isUser, ctrl.Attend.post)
  .get(auth.isUser, ctrl.Event.get)
  .put(auth.isUser, ctrl.Event.put)
  .delete(auth.isUser, ctrl.Event.del);


module.exports = router;
