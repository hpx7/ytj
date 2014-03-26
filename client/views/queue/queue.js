Template.queue.songs = function () {
  return Songs.find({roomIds: this._id}, {sort: {addedAt: 1}});
}
