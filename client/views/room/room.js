Template.room.helpers({
  users: function () {
    return Meteor.users.find({'rooms.room': this._id});
  },
  isHost: function () {
    return Session.equals('roomId', Meteor.userId());
  }
});
