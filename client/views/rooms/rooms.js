Template.rooms.roomName = function () {
  return Session.get('roomId') && Meteor.users.findOne(Session.get('roomId')).username;
}

Template.rooms.ownRoom = function () {
  return Session.equals('roomId', Meteor.userId());
}

Template.rooms.subText = function () {
  return Meteor.user() && _.contains(Meteor.user().subs, this._id) ? 'Unsubscribe' : 'Subscribe';
}

Template.rooms.users = function () {
  return Meteor.users.find({'rooms.room': Session.get('roomId')});
}

Template.rooms.rooms = function () {
  return Meteor.users.find();
}

Template.rooms.currentRoom = function () {
  return Session.equals('roomId', this._id);
}

Template.rooms.numUsers = function () {
  return Meteor.users.find({'rooms.room': this._id}).count();
}

Template.rooms.events({
  'click button': function (e) {
    Meteor.call($(e.target).text().toLowerCase(), this._id);
  }
});
