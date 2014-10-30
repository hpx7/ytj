Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Songs.insert(_.extend(song, {addedBy: this.userId, addedFrom: roomId, addedAt: new Date()}));
  },
  removeSong: function (songId, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    var song = Songs.findOne(songId);
    if (song && roomId !== this.userId && song.addedBy !== this.userId)
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    Songs.remove(songId);
  },
  favorite: function (song) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.insert(_.extend(song, {favoritedBy: this.userId}));
  },
  unfavorite: function (yt_id) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.remove({favoritedBy: this.userId, yt_id: yt_id});
  }
});
