Template.related.helpers({
  relatedSongs: function () {
    return Session.get('related');
  }
});

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  song ? getYTInfo(song.yt_id + '/related', {}, function (data) {
    Session.set('related', data);
  }) : Session.set('related', null);
});
