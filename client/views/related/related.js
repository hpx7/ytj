Template.related.helpers({
  relatedSongs: function () {
    return Session.get('related');
  }
});

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  song && Meteor.call('related', song.yt_id, function (error, data) {
    Session.set('related', data);
  });
});
