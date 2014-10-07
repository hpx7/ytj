var player;

onYouTubeIframeAPIReady = initPlayer;

function songEnd () {
  var song = Songs.findOne({addedFrom: Session.get('roomId')}, {sort: {addedAt: 1}});
  if (Songs.find({addedFrom: Session.get('roomId')}).count() === 1) {
    var r = Math.random() * 16 | 0;
    Meteor.call('addSong', RelatedSongs.find().fetch()[r], Session.get('roomId'));
  }
  if (song) Meteor.call('removeSong', song._id, Session.get('roomId'));
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
  var song = Songs.findOne({addedFrom: Session.get('roomId')}, {sort: {addedAt: 1}});
  try {
    if (song && player) player.loadVideoById(song.yt_id);
  } catch (err) {}
}

Tracker.autorun(playSong);

Template.video.helpers({
  queueEmpty: function () {
    return !Songs.findOne({addedFrom: Session.get('roomId')});
  }
});

Template.player.rendered = initPlayer;

Template.video.events({
  'click #skipbutton': songEnd
});

Meteor.startup(function() {
  $.getScript('//www.youtube.com/iframe_api');
});
