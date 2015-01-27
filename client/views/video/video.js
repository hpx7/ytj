var yt = new YTPlayer({rel: 0, playsinline: 1});

Tracker.autorun(function () {
  if (yt.ready()) yt.player.addEventListener('onStateChange', function (e) {
    if (e.data === YT.PlayerState.ENDED) songEnd();
  });
});

function songEnd () {
  Meteor.call('removeSong', Songs.findOne({}, {sort: {addedAt: 1}})._id, Router.current().params._id, handleError);
}

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song && yt.ready()) {
    yt.player.loadVideoById(song.yt_id);
    SearchYT({relatedToVideoId: song.yt_id, maxResults: 16}, YTMapping, function (error, related) {
      Meteor.call('updateRelated', song._id, related, handleError);
    });
  }
});

Template.video.helpers({
  disabled: function () {
    return Songs.find().count() > 1 || Songs.findOne().related ? '' : 'disabled';
  }
});

Template.video.events({
  'click #skipbutton': songEnd
});
