Template.room.helpers({
  users: function () {
    return Meteor.users.find({'rooms.room': Session.get('roomId')});
  },
  isHost: function () {
    return Session.equals('roomId', Meteor.userId());
  }
});
