function getSong (song) {
  var attrs = ['yt_id', 'title', 'author', 'duration', 'viewCount', 'imgUrl'];
  return Meteor.isServer ? songInfo(song.yt_id) : _.pick(song, attrs);
}

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    var metadata = {adderId: this.userId, adderName: Meteor.user().name, addedTo: roomId, addedAt: new Date()};
    Songs.insert(_.extend(getSong(song), metadata));
  },
  removeSong: function (songId, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (!Songs.findOne({_id: songId, adderId: this.userId}) && !Rooms.findOne({_id: roomId, ownerId: this.userId}))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    Songs.remove(songId);
  },
  favorite: function (song) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.insert(_.extend(getSong(song), {favoriterId: this.userId}));
  },
  unfavorite: function (yt_id) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
