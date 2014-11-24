Meteor.publish(null, function () {
  return [Meteor.users.find(this.userId, {fields: {name: 1}}), Rooms.find({ownerId: this.userId})];
});

Meteor.publish('friendsRooms', function () {
  return Rooms.find({ownerFbId: {$in: friendIds(this.userId)}});
});

Meteor.publish('friendsRoomsListeners', function () {
  return Listeners.find({roomFbId: {$in: friendIds(this.userId)}});
});

Meteor.publish('room', function (roomId) {
  return Rooms.find(roomId);
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedTo: roomId});
});

Meteor.publish('roomListeners', function (roomId) {
  var user = Meteor.users.findOne(this.userId), room = Rooms.findOne(roomId);
  var listenerId = Listeners.insert({userId: this.userId, name: user.name, roomFbId: room.ownerFbId, roomId: roomId});
  this.onStop(function () {
    Listeners.remove(listenerId);
  });
  return Listeners.find({roomId: roomId});
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});

Accounts.onCreateUser(function (options, user) {
  Rooms.insert({ownerId: user._id, ownerName: options.profile.name, ownerFbId: user.services.facebook.id});
  return _.extend(user, {name: options.profile.name});
});

Meteor.startup(function () {
  Listeners.remove({});
});
