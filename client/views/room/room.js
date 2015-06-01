Template.room.onCreated(function () {
  this.subscribe('room', FlowRouter.getParam('roomId'));
});

Template.room.helpers({
  currentRoom: function () {
    return Rooms.findOne(FlowRouter.getParam('roomId'));
  }
});
