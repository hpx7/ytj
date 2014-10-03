Template.queue.helpers({
  songs: function () {
    return Songs.find({addedFrom: this._id}, {sort: {addedAt: 1}});
  }
});
