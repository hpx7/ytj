Tracker.autorun(function () {
  Related.remove({});
  var song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song) {
    SearchYT({relatedToVideoId: song.yt_id, maxResults: 16}, YTMapping, function (err, data) {
      _.each(data, function (relatedSong) {
        Related.insert(relatedSong);
      });
    });
  }
});

Template.related.onCreated(function () {
  this.subscribe('currentSong', Router.current().params._id);
});

Template.related.helpers({
  relatedSongs: function () {
    return Related.find();
  }
});
