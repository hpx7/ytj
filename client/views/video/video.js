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
  var next = RelatedSongs.find().fetch()[Math.random() * 16 | 0];
  if (song && next) {
    if (Songs.find().count() === 1) Meteor.call('addSong', next, Session.get('roomId'));
    Meteor.call('removeSong', song._id, Session.get('roomId'));
  }
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
