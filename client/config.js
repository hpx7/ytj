Handlebars.registerHelper('isHost', function () {
  return Session.equals('roomId', Meteor.userId());
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
