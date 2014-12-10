var yt = new YTPlayer('player', Template.player, {rel: 0, playsinline: 1});

Tracker.autorun(function () {
  yt.ready() && yt.player.addEventListener('onStateChange', function (e) {
    if (e.data === YT.PlayerState.ENDED) songEnd();
  });
});

function songEnd () {
  Meteor.call('removeSong', Songs.findOne({}, {sort: {addedAt: 1}})._id, Router.current().params._id, handleError);
}

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}, fields: {yt_id: 1}});
  if (song && yt.ready()) yt.player.loadVideoById(song.yt_id);
});

Template.video.helpers({
  disabled: function () {
    var song = Songs.findOne({}, {sort: {addedAt: 1}});
    return song && song.related ? '' : 'disabled';
  }
});

Template.video.events({
  'click #skipbutton': songEnd
});
