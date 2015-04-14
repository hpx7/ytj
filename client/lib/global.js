handleError = function (error) {
  if (error) alert('Error: ' + error.message);
};

removeSong = function (songId) {
  var related = Related.find().fetch(), roomId = Router.current().params._id;
  Meteor.call('removeSong', songId, roomId, handleError);
  if (related.length && !Songs.findOne())
    Meteor.call('addSong', related[Math.random() * related.length | 0], roomId, handleError);
};

Template.registerHelper('atRoute', function (name) {
  return Router.current().route.getName() === name;
});

Template.registerHelper('numSongs', function () {
  return Songs.find().count();
});

Template.registerHelper('myRoom', function () {
  return Rooms.findOne({'owner._id': Meteor.userId()});
});

Template.registerHelper('inMyRoom', function () {
  return Rooms.findOne({_id: Router.current().params._id, 'owner._id': Meteor.userId()});
});

Accounts.ui.config({
  requestPermissions: {facebook: ['public_profile', 'email', 'user_friends']},
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
