Template.room.helpers({
  listeners: function () {
    return Listeners.find({roomId: this._id});
  },
  isHost: function () {
    return this.ownerId === Meteor.userId();
  }
});
