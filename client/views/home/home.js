Template.home.helpers({
  rooms: function () {
    return Rooms.find({ownerId: {$ne: Meteor.userId()}}, {sort: {ownerName: 1}});
  },
  numListeners: function () {
    return Listeners.find({roomId: this._id, userId: {$ne: null}}).count();
  }
});
