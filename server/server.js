Meteor.publish(null, function () {
  return [Meteor.users.find(this.userId, {fields: {name: 1}}), Rooms.find({ownerId: this.userId})];
});

Meteor.publish('rooms', function (roomId) {
  var friendIds = this.userId ? getFriendIds(this.userId) : [];
  return roomId ? Rooms.find({_id: roomId, ownerFbId: {$in: friendIds}}) : Rooms.find({ownerFbId: {$in: friendIds}});
});

Meteor.publish('listeners', function (roomId) {
  var userName = this.userId && Meteor.users.findOne(this.userId).name;
  var listenerId = Listeners.insert({userId: this.userId, name: userName, roomId: roomId, sessionId: this.connection.id});
  this.onStop(function () {
    Listeners.remove(listenerId);
  });
  return roomId ? Listeners.find({roomId: roomId}) : Listeners.find();
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedTo: roomId});
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
