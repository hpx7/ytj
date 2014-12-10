function sanitizeSong (song) {
  return _.pick(song, ['yt_id', 'title', 'author', 'duration', 'imgUrl']);
}

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 15)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    var related = Meteor.isServer ? Meteor.wrapAsync(getYTInfo)(song.yt_id + '/related', {}) : null;
    var metadata = {adder: Meteor.user(), addedTo: roomId, addedAt: new Date(), related: related};
    Songs.insert(_.extend(sanitizeSong(song), metadata));
  },
  removeSong: function (songId, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (!Songs.findOne({_id: songId, 'adder._id': this.userId}) && !Rooms.findOne({_id: roomId, 'owner._id': this.userId}))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    if (!Songs.find({_id: {$ne: songId}, addedTo: roomId}).count()) {
      var song = Songs.findOne(songId);
      if (song) Meteor.call('addSong', song.related[songId.charCodeAt(0) % song.related.length], roomId);
    }
    Songs.remove(songId);
  },
  favorite: function (song) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Favorites.find({favoriterId: this.userId}).count() > 100)
      throw new Meteor.Error(403, 'Maximum number of favorites reached');
    Favorites.insert(_.extend(sanitizeSong(song), {favoriterId: this.userId}));
  },
  unfavorite: function (yt_id) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
