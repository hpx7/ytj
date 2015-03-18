Template.related.onCreated(function () {
  this.subscribe('currentSong', Router.current().params._id);
});

Template.related.helpers({
  relatedSongs: function () {
    return Songs.findOne() && Songs.findOne({}, {sort: {addedAt: 1}}).related;
  }
});
