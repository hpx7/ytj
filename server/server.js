Meteor.publish('users', function () {
  return Meteor.users.find({}, {fields: {services: 0}});
});

Meteor.publish('queue', function (roomId) {
  return Songs.find({roomIds: roomId});
});

// UserStatus.on('sessionLogout', function (params) {
// 	Meteor.users.update(params.userId, {$pull: {rooms: {session: params.sessionId}}});
// });

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
