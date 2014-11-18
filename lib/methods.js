function getSong (song) {
  if (typeof song.yt_id !== 'string') throw new Meteor.Error(403, 'Invalid song object');
  var attrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];
  return _.pick(Meteor.isServer ? songInfo(song.yt_id) : song, attrs);
}

Meteor.methods({
  addSong: function (song, roomId) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 15)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    if (Meteor.isServer && (!Rooms.findOne(roomId) || !friends(this.userId, Rooms.findOne(roomId).ownerFbId)))
      throw new Meteor.Error(403, 'Not allowed to add this song');
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
    if (Favorites.find({favoriterId: this.userId}).count() > 100)
      throw new Meteor.Error(403, 'Maximum number of favorites reached');
    Favorites.insert(_.extend(getSong(song), {favoriterId: this.userId}));
  },
  unfavorite: function (yt_id) {
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
