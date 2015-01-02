var songAttrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 15)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    var metadata = {adder: Meteor.user(), addedTo: roomId, addedAt: new Date()};
    Songs.insert(_.extend(_.pick(song, songAttrs), metadata));
  },
  removeSong: function (songId) {
    var song = Songs.findOne(songId);
    if (!song || (song.adder._id !== this.userId && !Rooms.findOne({_id: song.addedTo, 'owner._id': this.userId})))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    if (Songs.find({addedTo: song.addedTo}).count() === 1)
      Meteor.call('addSong', song.related[songId.charCodeAt(0) % song.related.length], song.addedTo);
    Songs.remove(songId);
  },
  updateRelated: function (songId, related) {
    if (!Songs.findOne(songId) || !Rooms.findOne({_id: Songs.findOne(songId).addedTo, 'owner._id': this.userId}))
      throw new Meteor.Error(403, 'Not allowed to update this song');
    Songs.update(songId, {$set: {related: related}});
  },
  favorite: function (song) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Favorites.find({favoriterId: this.userId}).count() > 100)
      throw new Meteor.Error(403, 'Maximum number of favorites reached');
    Favorites.insert(_.extend(_.pick(song, songAttrs), {favoriterId: this.userId}));
  },
  unfavorite: function (yt_id) {
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
