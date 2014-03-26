Template.rooms.users = function () {
  return Meteor.users.find({'rooms.room': this._id});
}

Template.rooms.rooms = function () {
  return Meteor.users.find();
}

Template.rooms.numUsers = function () {
  return Meteor.users.find({'rooms.room': this._id}).count();
}

Template.rooms.events({
  'click button': function (e) {
    Meteor.call($(e.target).text().toLowerCase(), this._id);
  }
});
