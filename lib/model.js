Songs = new Meteor.Collection('songs');

function checkLoggedIn (userId) {
  if (!userId)
    throw new Meteor.Error(401, 'User not logged in');
}

function sanitizeSong (song) {
  var attrs = ['_id', 'yt_id', 'title', 'author', 'duration', 'imgUrl'];
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
    var song = Songs.findOne(songId);
    if (song && roomId !== this.userId && song.addedBy !== this.userId)
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    Songs.remove(songId);
  },
  favorite: function (song) {
    checkLoggedIn(this.userId);
    Meteor.users.update(this.userId, {$addToSet: {favorites: sanitizeSong(song)}});
  },
  unfavorite: function (songId) {
    checkLoggedIn(this.userId);
    Meteor.users.update(this.userId, {$pull: {favorites: {_id: songId}}});
  }
});
