createYTSearch(() => {
  const song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song) return {relatedToVideoId: song.yt_id, maxResults: 16};
}, Related);

Template.related.onCreated(function () {
  this.subscribe('currentSong', FlowRouter.getParam('roomId'));
  this.subscribe('favorites');
});

Template.related.helpers({
  relatedSongs() {
    return Related.find();
  }
});
