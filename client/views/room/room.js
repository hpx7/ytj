Template.room.helpers({
  isHost: function () {
    return this.ownerId === Meteor.userId();
  }
});
