var songAttrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];

function maybeUpdateRelated (roomId) {
  var song = Songs.findOne({addedTo: roomId}, {sort: {addedAt: 1}});
  if (!song.related) {
    var related = Meteor.wrapAsync(SearchYT)({relatedToVideoId: song.yt_id, maxResults: 16}, YTMapping);
    Songs.update(song._id, {$set: {related: related}});
  }
}

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 50)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    var metadata = {adder: Meteor.user(), addedTo: roomId, addedAt: new Date()};
    Songs.insert(_.extend(_.pick(song, songAttrs), metadata));
    if (Meteor.isServer) maybeUpdateRelated(roomId);
  },
  removeSong: function (songId) {
    var song = Songs.findOne(songId);
    if (!song || (song.adder._id !== this.userId && !Rooms.findOne({_id: song.addedTo, 'owner._id': this.userId})))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    Songs.remove(songId);
    if (!Songs.find({addedTo: song.addedTo}).count())
      Meteor.call('addSong', song.related[songId.charCodeAt(0) % song.related.length], song.addedTo);
    if (Meteor.isServer) maybeUpdateRelated(song.addedTo);
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
