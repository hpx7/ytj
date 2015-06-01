var yt = new YTPlayer({rel: 0, playsinline: 1});

Tracker.autorun(function () {
  if (yt.ready()) yt.player.addEventListener('onStateChange', function (e) {
    if (e.data === YT.PlayerState.ENDED)
      removeSong(Songs.findOne({}, {sort: {addedAt: 1}})._id);
  });
});

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song && yt.ready()) yt.player.loadVideoById(song.yt_id);
});

Template.video.onCreated(function () {
  this.subscribe('currentSong', FlowRouter.getParam('roomId'));
});

Template.video.helpers({
  disabled: function () {
    return Songs.find().count() > 1 || Related.findOne() ? '' : 'disabled';
  }
});

Template.video.events({
  'click #skipbutton': function (e) {
    removeSong(Songs.findOne({}, {sort: {addedAt: 1}})._id);
  }
});
