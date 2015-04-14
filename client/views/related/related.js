CreateYTSearch(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song) return {relatedToVideoId: song.yt_id, maxResults: 16};
}, Related);

Template.related.onCreated(function () {
  this.subscribe('currentSong', Router.current().params._id);
});

Template.related.helpers({
  relatedSongs: function () {
    return Related.find();
  }
});
