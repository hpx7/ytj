Template.room.onCreated(function () {
  this.subscribe('room', Router.current().params._id);
});

Template.room.helpers({
  currentRoom: function () {
    return Rooms.findOne(Router.current().params._id);
  }
});
