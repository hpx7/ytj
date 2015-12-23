Template.room.onCreated(function () {
  this.subscribe('room', FlowRouter.getParam('roomId'));
});

Template.room.helpers({
  currentRoom() {
    return Rooms.findOne(FlowRouter.getParam('roomId'));
  }
});
