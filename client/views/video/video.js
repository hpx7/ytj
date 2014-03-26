var player = null;

onYouTubeIframeAPIReady = initPlayer;

function initPlayer () {
  try {
    player = new YT.Player('player', {
      events: {
        'onStateChange': function (e) {
          if (e.data === YT.PlayerState.ENDED)
            songEnd();
        },
        'onReady': playSong
      },
      playerVars: {'rel': 0}
    });
  } catch (err) {}
}

function playSong () {
  var song = Songs.findOne({roomIds: Session.get('roomId')}, {sort: {addedAt: 1}});
  try {
    song && player.loadVideoById(song.yt_id);
  } catch (err) {}
}

Deps.autorun(playSong);

Template.video.queueEmpty = function () {
  return !Songs.findOne({roomIds: Session.get('roomId')});
}

Template.player.rendered = initPlayer;

Template.video.events({
  'click #skipbutton': songEnd
});

Meteor.startup(function() {
  $.getScript('//www.youtube.com/iframe_api');
});
