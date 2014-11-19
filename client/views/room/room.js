Template.room.helpers({
  listeners: function () {
    return Listeners.find({roomId: this._id, userId: {$ne: null}});
  }
});
