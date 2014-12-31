Template.home.helpers({
  friendsRooms: function () {
    return Rooms.find({'owner._id': {$ne: Meteor.userId()}}, {sort: {'owner.username': 1}});
  },
  numListeners: function () {
    return Listeners.find({'room._id': this._id, user: {$ne: null}}).count();
  }
});
