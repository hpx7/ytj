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
      Meteor.call('next', song.yt_id, function (error, data) {
        Meteor.call('addSong', data, Session.get('roomId'), handleError);
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
