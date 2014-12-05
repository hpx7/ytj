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
  var id = Listeners.insert({userId: this.userId, name: user && user.name, roomFbId: room && room.ownerFbId, roomId: roomId});
  this.onStop(function () {
    Listeners.remove(id);
  });
  return Listeners.find({roomId: roomId});
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});

Accounts.onCreateUser(function (options, user) {
  user.name = user.username || options.profile.name;
  var fbId = user.services.facebook && user.services.facebook.id
  Rooms.insert({ownerId: user._id, ownerName: user.name, ownerFbId: fbId});
  return user;
});

Meteor.startup(function () {
  Listeners.remove({});
});
