Meteor.publish('rooms', function () {
  return Rooms.find();
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedFrom: roomId});
});

Meteor.publish('room', function (roomId) {
  var listener = {userId: this.userId, name: Meteor.users.findOne(this.userId).name, sessionId: this.connection.id};
  Rooms.update(roomId, {$addToSet: {listeners: listener}});
  this.onStop(function () {
    Rooms.update(roomId, {$pull: {listeners: listener}});
  });
  return Rooms.find(roomId);
});

Accounts.onCreateUser(function (options, user) {
  Rooms.insert({ownerId: user._id, ownerName: options.profile.name, listeners: []});
  return _.extend(user, {name: options.profile.name});
});

Meteor.startup(function () {
  Rooms.update({}, {$set: {listeners: []}}, {multi: true});
});
