var express     = require('express');
var router      = express.Router();

var ctrl  = require('./ctrl.js');

router.route('/')
  .get(function(req, res) {
    res.send('index')
  });

//-------------------- User-Side Routes --------------------
//User CRUD
router.route('/:_(users|u)')
  .get(ctrl.User.getAll)
  .post(ctrl.User.post);
router.route('/:_(users|u)/:handle/')
  .get(ctrl.User.get)
  .put(ctrl.User.put)
  .delete(ctrl.User.del);
//User Status
router.route('/:_(users|u)/:handle/:_(orgs|o)')
  .get(ctrl.Status.getAll)
router.route('/:_(users|u)/:handle/:_(orgs|o)/:url')
  .get(ctrl.Status.get)

//-------------------- Org-Side Routes --------------------
//Org CRUD
router.route('/:_(orgs|o)')
  .get(ctrl.Org.getAll)
  .post(ctrl.Org.post);
router.route('/:_(orgs|o)/:url')
  .post(ctrl.Status.post)
  .get(ctrl.Org.get)
  .put(ctrl.Org.put)
  .delete(ctrl.Org.del);
//Status CRUD
router.route('/:_(orgs|o)/:url/:_(users|u)/:type?')
  .get(ctrl.Status.getAll)
router.route('/:_(orgs|o)/:url/:_(users|u)/:handle')
  .get(ctrl.Status.get)
  .put(ctrl.Status.put)
  .delete(ctrl.Status.del);
//Event CRUD
router.route('/:_(orgs|o)/:url/:_(events|e)')
  .get(ctrl.Event.getAll)
  .post(ctrl.Event.post);
router.route('/:_(orgs|o)/:url/:_(events|e)/:id')
  .post(ctrl.Attend.post)
  .get(ctrl.Event.get)
  .put(ctrl.Event.put)
  .delete(ctrl.Event.del);


module.exports = router;
