Template.queue.helpers({
  songs: function () {
    return Songs.find({}, {sort: {addedAt: 1}});
  }
});
