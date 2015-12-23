const songAttrs = ['yt_id', 'title', 'author', 'duration', 'imgUrl'];

Meteor.methods({
  addSong(song, roomId) {
    check(song, Match.ObjectIncluding(_.object(songAttrs, [String, String, String, String, String])));
    check(roomId, String);
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Songs.find({addedTo: roomId}).count() > 50)
      throw new Meteor.Error(403, 'Maximum queue size reached');
    Songs.insert(_.extend(_.pick(song, songAttrs), {adder: Meteor.user(), addedTo: roomId, addedAt: new Date()}));
  },
  removeSong(songId) {
    check(songId, String);
    const song = Songs.findOne(songId);
    if (song && song.adder._id !== this.userId && !Rooms.findOne({_id: song.addedTo, 'owner._id': this.userId}))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    Songs.remove(songId);
  },
  favorite(song) {
    check(song, Match.ObjectIncluding(_.object(songAttrs, [String, String, String, String, String])));
    if (!this.userId) throw new Meteor.Error(401, 'User not logged in');
    if (Favorites.find({favoriterId: this.userId}).count() > 100)
      throw new Meteor.Error(403, 'Maximum number of favorites reached');
    Favorites.insert(_.extend(_.pick(song, songAttrs), {favoriterId: this.userId, addedAt: new Date()}));
  },
  unfavorite(yt_id) {
    check(yt_id, String);
    Favorites.remove({favoriterId: this.userId, yt_id: yt_id});
  }
});
