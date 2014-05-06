Template.rooms.users = function () {
  return Meteor.users.find({'rooms.room': this._id});
}

Template.rooms.rooms = function () {
  return Meteor.users.find();
}

Template.rooms.numUsers = function () {
  return Meteor.users.find({'rooms.room': this._id}).count();
}
