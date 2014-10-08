var player;

onYouTubeIframeAPIReady = initPlayer;

function songEnd () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  var next = RelatedSongs.find().fetch()[Math.random() * 16 | 0];
  if (song && next) {
    if (Songs.find().count() === 1) Meteor.call('addSong', next, Session.get('roomId'));
    Meteor.call('removeSong', song._id, Session.get('roomId'));
  }
}

function initPlayer () {
  player = typeof YT !== 'undefined' && new YT.Player('player', {
    events: {
      'onStateChange': function (e) {
        if (e.data === YT.PlayerState.ENDED) songEnd();
      },
      'onReady': playSong
    },
    playerVars: {'rel': 0}
  });
}

function playSong () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  try {
    if (song && player) player.loadVideoById(song.yt_id);
  } catch (err) {}
}

Tracker.autorun(playSong);

Template.video.helpers({
  queueEmpty: function () {
    return !Songs.findOne();
  }
});

Template.player.rendered = initPlayer;

Template.video.events({
  'click #skipbutton': songEnd
});

Meteor.startup(function() {
  $.getScript('//www.youtube.com/iframe_api');
});
