Template.home.helpers({
  friendsRooms: function () {
    return Rooms.find({'owner._id': {$ne: Meteor.userId()}}, {sort: {'owner.username': 1}});
  }
});
