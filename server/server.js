Meteor.publish('global', function () {
  return [Meteor.users.find(), Favorites.find({favoritedBy: this.userId})];
});

Meteor.publish('room', function (roomId) {
  var self = this;
  Meteor.users.update(self.userId, {$addToSet: {rooms: {room: roomId, session: self.connection.id}}});
  this.onStop(function () {
    Meteor.users.update(self.userId, {$pull: {rooms: {room: roomId, session: self.connection.id}}});
  });
  return Songs.find({addedFrom: roomId});
});

Meteor.publish('search', function (query) {
  var self = this;
  _.each(getSearchResults(query), function (result) {
    self.added('search', Random.id(), result);
  });
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
