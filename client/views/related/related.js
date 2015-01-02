Template.related.helpers({
  relatedSongs: function () {
    return Songs.findOne() && Songs.findOne({}, {sort: {addedAt: 1}}).related;
  }
});
