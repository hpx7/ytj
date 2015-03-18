Template.queue.onCreated(function () {
  this.subscribe('queue', Router.current().params._id);
});

Template.queue.helpers({
  songs: function () {
    return Songs.find({}, {sort: {addedAt: 1}});
  }
});
