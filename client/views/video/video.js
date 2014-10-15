var yt = new YTPlayer('player', Template.player, {rel: 0});

Tracker.autorun(function () {
  if (yt.ready()) {
    yt.player.addEventListener('onStateChange', function (e) {
      if (e.data === YT.PlayerState.ENDED) songEnd();
    });
  }
});

function songEnd () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  Meteor.call('removeSong', song._id, Session.get('roomId'));
}

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  if (song && yt.ready()) yt.player.loadVideoById(song.yt_id);
});

Template.video.helpers({
  queueEmpty: function () {
    return !Songs.findOne();
  }
});

Template.video.events({
  'click #skipbutton': songEnd
});
