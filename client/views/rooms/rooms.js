Template.rooms.helpers({
  users: function () {
    return Meteor.users.find({'rooms.room': this._id});
  },
  rooms: function () {
    return Meteor.users.find();
  },
  numUsers: function () {
    return Meteor.users.find({'rooms.room': this._id}).count();
  }
});
