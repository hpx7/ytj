Meteor.publish(null, function () {
  return [Meteor.users.find(this.userId), Rooms.find({'owner._id': this.userId})];
});

Meteor.publish('friendsRooms', function () {
  return Rooms.find({'owner.services.facebook.id': {$in: friendIds(this.userId)}});
});

Meteor.publish('friendsRoomsListeners', function () {
  return Listeners.find({'room.owner.services.facebook.id': {$in: friendIds(this.userId)}});
});

Meteor.publish('room', function (roomId) {
  return Rooms.find(roomId);
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedTo: roomId});
});

Meteor.publish('roomListeners', function (roomId) {
  var listenerId = Listeners.insert({user: Meteor.users.findOne(this.userId), room: Rooms.findOne(roomId)});
  this.onStop(function () {
    Listeners.remove(listenerId);
  });
  return Listeners.find({'room._id': roomId});
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});

Accounts.onCreateUser(function (options, user) {
  user.username = user.username || options.profile.name
  Rooms.insert({owner: user});
  return user;
});

Meteor.startup(function () {
  Listeners.remove({});
});
