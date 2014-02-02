Template.queue.songs = function () {
  return Songs.find({roomIds: Session.get('roomId')}, {sort: {addedAt: 1}});
}
