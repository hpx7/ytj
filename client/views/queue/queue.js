Template.queue.onCreated(function () {
  this.subscribe('queue', FlowRouter.getParam('roomId'));
  this.subscribe('favorites');
});

Template.queue.helpers({
  songs: function () {
    return Songs.find({}, {sort: {addedAt: 1}});
  }
});
