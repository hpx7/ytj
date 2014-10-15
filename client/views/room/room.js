Template.room.helpers({
  isHost: function () {
    return Session.equals('roomId', Meteor.userId());
  }
});
