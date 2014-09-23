Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('queue', function (roomId) {
  var self = this;
  Meteor.users.update(self.userId, {$addToSet: {rooms: {room: roomId, session: self.connection.id}}});
  this.onStop(function () {
    Meteor.users.update(self.userId, {$pull: {rooms: {room: roomId, session: self.connection.id}}});
  });
  return Songs.find({addedFrom: roomId});
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
