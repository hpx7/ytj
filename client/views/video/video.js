var yt = new YTPlayer('player', Template.video, {rel: 0, playsinline: 1});

Tracker.autorun(function () {
  yt.ready() && yt.player.addEventListener('onStateChange', function (e) {
    if (e.data === YT.PlayerState.ENDED) songEnd();
  });
});

function songEnd () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  if (song) {
    Meteor.call('removeSong', song._id, Session.get('roomId'), handleError);
    if (!Songs.find().count()) {
      getYTInfo(song.yt_id + '/related', {}, function (data) {
        Meteor.call('addSong', data[Math.random() * data.length | 0], Session.get('roomId'), handleError);
      });
    }
  }
}

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  if (song && yt.ready()) yt.player.loadVideoById(song.yt_id);
});

Template.video.helpers({
  disabled: function () {
    return Songs.find().count() ? '' : 'disabled';
  }
});

Template.video.events({
  'click #skipbutton': songEnd
});
