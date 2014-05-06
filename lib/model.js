Songs = new Meteor.Collection('songs');

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId)
      throw new Meteor.Error(401, "You need to login to add songs!");

    song = _.extend(_.pick(song, 'yt_id', 'title', 'author', 'duration', 'imgUrl'), {
      addedBy: this.userId,
      addedFrom: roomId,
      addedAt: new Date()
    });

    Songs.insert(song);
  },
  removeSong: function (songId, roomId) {
    Songs.remove(songId);
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
