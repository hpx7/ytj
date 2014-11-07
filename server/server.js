Meteor.publish('rooms', function (roomId) {
  return roomId ? Rooms.find(roomId) : Rooms.find();
});

Meteor.publish('listeners', function (roomId) {
  var userName = Meteor.users.findOne(this.userId).name;
  var listenerId = Listeners.insert({userId: this.userId, name: userName, roomId: roomId, sessionId: this.connection.id});
  this.onStop(function () {
    Listeners.remove(listenerId);
  });
  return roomId ? Listeners.find({roomId: roomId}) : Listeners.find();
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedFrom: roomId});
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});

Accounts.onCreateUser(function (options, user) {
  Rooms.insert({ownerId: user._id, ownerName: options.profile.name, listeners: []});
  return _.extend(user, {name: options.profile.name});
});

Meteor.startup(function () {
  Listeners.remove({});
});
