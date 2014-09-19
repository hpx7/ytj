Songs = new Meteor.Collection('songs');

function checkLoggedIn (userId) {
  if (!userId)
    throw new Meteor.Error(401, 'User not logged in');
}

function sanitizeSong (song) {
  var attrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];
  if (_.difference(attrs, _.keys(song)).length)
    throw new Meteor.Error(422, 'Invalid song object');
  return _.pick(song, attrs);
}

Meteor.methods({
  addSong: function (song, roomId) {
    checkLoggedIn(this.userId);
    Songs.insert(_.extend(sanitizeSong(song), {
      addedBy: this.userId,
      addedFrom: roomId,
      addedAt: new Date()
    }));
  },
  removeSong: function (songId, roomId) {
    checkLoggedIn(this.userId);
    Songs.remove(songId);
  },
  favorite: function (song) {
    checkLoggedIn(this.userId);
    Meteor.users.update(this.userId, {$addToSet: {favorites: sanitizeSong(song)}});
  },
  unfavorite: function (song) {
    checkLoggedIn(this.userId);
    Meteor.users.update(this.userId, {$pull: {favorites: sanitizeSong(song)}});
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
