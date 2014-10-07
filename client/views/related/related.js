RelatedSongs = new Meteor.Collection('related');

Template.related.helpers({
  relatedSongs: function () {
    return RelatedSongs.find();
  }
});

Tracker.autorun(function () {
  var song = Songs.findOne({}, {sort: {addedAt: 1}});
  if (song) Meteor.subscribe('related', song.yt_id);
});
