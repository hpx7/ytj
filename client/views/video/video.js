var songTracker = null;

function songEnd () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  var next = RelatedSongs.find().fetch()[Math.random() * 16 | 0];
  if (song && next) {
    if (Songs.find().count() === 1) Meteor.call('addSong', next, Session.get('roomId'));
    Meteor.call('removeSong', song._id, Session.get('roomId'));
  }
}

function initPlayer () {
  player = new YT.Player('player', {
    events: {
      'onStateChange': function (e) {
        if (e.data === YT.PlayerState.ENDED) songEnd();
      },
      'onReady': function () {
        songTracker = Tracker.autorun(function () {
          var song = Songs.findOne({}, {sort: {addedAt: 1}});
          if (song) player.loadVideoById(song.yt_id);
        });
      }
    },
    playerVars: {'rel': 0}
  });
}

Template.video.helpers({
  queueEmpty: function () {
    return !Songs.findOne();
  }
});

Template.video.rendered = function () {
  if (typeof YT !== 'undefined') initPlayer();
};

Template.video.destroyed = function () {
  if (songTracker) songTracker.stop();
};

Template.video.events({
  'click #skipbutton': songEnd
});

Meteor.startup(function() {
  onYouTubeIframeAPIReady = initPlayer;
  $.getScript('//www.youtube.com/iframe_api');
});
