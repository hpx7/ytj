Template.home.helpers({
  rooms: function () {
    return Rooms.find({}, {sort: {ownerName: 1}});
  },
  numListeners: function () {
    return Listeners.find({roomId: this._id, userId: {$ne: null}}).count();
  }
});
