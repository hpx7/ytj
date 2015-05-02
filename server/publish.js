Meteor.publish(null, function () {
  return [Rooms.find({'owner._id': this.userId})];
});

Meteor.publish('friendsRooms', function () {
  return Rooms.find({'owner.services.facebook.id': {$in: FriendIDs(this.userId)}});
});

Meteor.publish('room', function (roomId) {
  if (this.userId) {
    var id = this.connection.id, user = Meteor.users.findOne(this.userId);
    Rooms.update(roomId, {$addToSet: {listeners: {_id: id, user: user}}});
    this.onStop(function () {
      Rooms.update(roomId, {$pull: {listeners: {_id: id}}});
    });
  }
  return Rooms.find(roomId);
});

Meteor.publish('currentSong', function (roomId) {
  return Songs.find({addedTo: roomId}, {sort: {addedAt: 1, limit: 1}});
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedTo: roomId});
});

Meteor.publish('favorites', function () {
  return Favorites.find({favoriterId: this.userId});
});
