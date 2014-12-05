handleError = function (error) {
  if (error) alert('Error: ' + error.message);
};

Template.registerHelper('atRoute', function (name) {
  return Router.current().route.getName() === name;
});

Template.registerHelper('handleReady', function (handleName) {
  return Router.current()[handleName] && Router.current()[handleName].ready();
});

Template.registerHelper('myRoom', function () {
  return Rooms.findOne({'owner._id': Meteor.userId()});
});

Template.registerHelper('inMyRoom', function () {
  return Rooms.findOne({_id: Router.current().params._id, 'owner._id': Meteor.userId()});
});

Accounts.ui.config({
  requestPermissions: {facebook: ['user_friends']},
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});
