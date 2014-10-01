RelatedSongs = new Meteor.Collection('related');

Template.related.relatedSongs = function () {
  return RelatedSongs.find();
};

Tracker.autorun(function () {
  var song = Songs.findOne({addedFrom: Session.get('roomId')}, {sort: {addedAt: 1}});
  if (song) Meteor.subscribe('related', song.yt_id);
});
