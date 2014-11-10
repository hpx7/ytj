Template.home.helpers({
  rooms: function () {
    return Rooms.find();
  },
  numListeners: function () {
    return Listeners.find({roomId: this._id, userId: {$ne: null}}).count();
  }
});
