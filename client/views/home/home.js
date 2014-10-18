Template.home.helpers({
  rooms: function () {
    return Meteor.users.find();
  },
  numUsers: function () {
    return Meteor.users.find({'rooms.room': this._id}).count();
  }
});
