// QueueSongs = new Meteor.Collection('queueSongs');

Template.queue.songs = function () {
  return Songs.find({addedFrom: this._id}, {sort: {addedAt: 1}});
}
