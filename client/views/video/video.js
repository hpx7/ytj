var player = null, ytReady = false, divRendered = false;

onYouTubeIframeAPIReady = function () {
  ytReady = true;
  initPlayer();
}

function initPlayer () {
  if (!ytReady || !divRendered || $('iframe#player').length)
    return;
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
}

function playSong () {
  var song = Songs.findOne({roomIds: Session.get('roomId')}, {sort: {addedAt: 1}});
  try {
    song && player.loadVideoById(song.yt_id);
  } catch (err) {}
}

Deps.autorun(playSong);

Deps.autorun(function () {
  var song = Songs.findOne({roomIds: Session.get('roomId')});
  Session.set('queueEmpty', !song);
});

Template.video.queueEmpty = function () {
  return Session.get('queueEmpty');
}

Template.player.rendered = function () {
  divRendered = true;
  initPlayer();
}

Template.video.events({
  'click #skipbutton': songEnd
});

Meteor.startup(function() {
  $.getScript('//www.youtube.com/iframe_api');
});
