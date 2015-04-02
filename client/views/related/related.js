Template.related.onCreated(function () {
  this.subscribe('currentSong', Router.current().params._id);
});

Tracker.autorun(function () {
  Session.set('related', null);
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  if (song) {
    SearchYT({relatedToVideoId: song.yt_id, maxResults: 16}, YTMapping, function (err, data) {
      Session.set('related', data);
    });
  }
});

Template.related.helpers({
  relatedSongs: function () {
    return Session.get('related');
  }
});
