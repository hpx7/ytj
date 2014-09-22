Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('queue', function (roomId) {
  var userId = this.userId, connectionId = this.connection.id;
  if (userId) {
    console.log('publish ' + roomId + ' ' + connectionId);
    Meteor.users.update(userId, {$addToSet: {rooms: {room: roomId, session: connectionId}}});
    this.onStop(function () {
      console.log('unpublish ' + roomId + ' ' + connectionId);
      Meteor.users.update(userId, {$pull: {rooms: {room: roomId, session: connectionId}}});
    });
    return Songs.find({addedFrom: roomId});
  }
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
