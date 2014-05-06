Songs = new Meteor.Collection('songs');

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId)
      throw new Meteor.Error(401, "You need to login to add songs!");

    song = _.extend(_.pick(song, 'yt_id', 'title', 'author', 'duration', 'imgUrl'), {
      addedBy: this.userId,
      addedFrom: roomId,
      addedAt: new Date(),
      roomIds: Meteor.users.find({subs: roomId, 'status.online': true}).map(function (user) {
        return user._id;
      }).concat(roomId)
    });

    Songs.insert(song);
  },
  removeSong: function (songId, roomId) {
    Songs.update(songId, {$pull: {roomIds: roomId}});
    Songs.findOne(songId).roomIds.length || Songs.remove(songId);
  },
  subscribe: function (roomId) {
    Meteor.users.update(this.userId, {$addToSet: {subs: roomId}});
  },
  unsubscribe: function (roomId) {
    Meteor.users.update(this.userId, {$pull: {subs: roomId}});
  },
  join: function (roomId) {
    if (this.isSimulation)
      Meteor.users.update(this.userId, {$addToSet: {rooms: {room: roomId}}});
    else
      Meteor.users.update(this.userId, {$addToSet: {rooms: {room: roomId, session: this.connection.id}}});
  },
  leave: function (roomId) {
    if (this.isSimulation)
      Meteor.users.update(this.userId, {$pull: {rooms: {room: roomId}}});
    else
      Meteor.users.update(this.userId, {$pull: {rooms: {room: roomId, session: this.connection.id}}});
  }
});
