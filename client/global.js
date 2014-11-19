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
  return Rooms.findOne({ownerId: Meteor.userId()});
});

Template.registerHelper('inMyRoom', function () {
  var room = Rooms.findOne(Router.current().params._id);
  return room && room.ownerId === Meteor.userId();
});
