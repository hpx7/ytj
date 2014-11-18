roomVisible = function (userId, roomId) {
  var room = Rooms.findOne(roomId);
  return userId && room && (room.ownerId === userId || friends(userId, room.ownerFbId));
};

Meteor.publish(null, function () {
  return [Meteor.users.find(this.userId, {fields: {name: 1}}), Rooms.find({ownerId: this.userId})];
});

Meteor.publish('rooms', function () {
  return Rooms.find({ownerFbId: {$in: friendIds(this.userId)}});
});

Meteor.publish('allListeners', function () {
  return Listeners.find({fbId: {$in: friendIds(this.userId)}});
});

Meteor.publish('room', function (roomId) {
  return roomVisible(this.userId, roomId) ? Rooms.find(roomId) : [];
});

Meteor.publish('queue', function (roomId) {
  return roomVisible(this.userId, roomId) ? Songs.find({addedTo: roomId}) : [];
});

Meteor.publish('roomListeners', function (roomId) {
  if (!roomVisible(this.userId, roomId)) return [];
  var user = Meteor.users.findOne(this.userId);
  var listener = {userId: this.userId, name: user.name, fbId: user.services.facebook.id, roomId: roomId};
  var listenerId = Listeners.insert(listener);
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
