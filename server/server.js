Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({addedFrom: roomId});
});

UserStatus.events.on('connectionLogout', function (params) {
	Meteor.users.update(params.userId, {$pull: {rooms: {session: params.connectionId}}});
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
