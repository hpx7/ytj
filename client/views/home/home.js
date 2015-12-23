Template.home.onCreated(function () {
  this.subscribe('friendsRooms');
});

Template.home.helpers({
  friendsRooms() {
    return Rooms.find({'owner._id': {$ne: Meteor.userId()}}, {sort: {'owner.username': 1}});
  }
});
