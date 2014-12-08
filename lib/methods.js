function getSong (song) {
  if (typeof song.yt_id !== 'string') throw new Meteor.Error(403, 'Invalid song object');
  var attrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];
  if (Meteor.isServer)
    return _.extend(_.pick(songInfo(song.yt_id), attrs), {related: relatedSongs(song.yt_id)});
  else
    return _.pick(song, attrs);
}

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 15)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    if (Rooms.findOne(roomId)) {
      var metadata = {adder: Meteor.user(), addedTo: roomId, addedAt: new Date()};
      Songs.insert(_.extend(getSong(song), metadata));
    }
  },
  removeSong: function (songId, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (!Songs.findOne({_id: songId, 'adder._id': this.userId}) && !Rooms.findOne({_id: roomId, 'owner._id': this.userId}))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    if (!Songs.find({_id: {$ne: songId}, addedTo: roomId}).count()) {
      var song = Songs.findOne({_id: songId, addedTo: roomId});
      if (!song || !song.related)
        return;
      Meteor.call('addSong', song.related[songId.charCodeAt(0) % 16], roomId);
    }
    Songs.remove(songId);
  },
  favorite: function (song) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Favorites.find({favoriterId: this.userId}).count() > 100)
      throw new Meteor.Error(403, 'Maximum number of favorites reached');
    Favorites.insert(_.extend(getSong(song), {favoriterId: this.userId}));
  },
  unfavorite: function (yt_id) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
