Template.room.helpers({
  roomOwner: function () {
    return Meteor.users.findOne(Router.current().params._id).profile.name;
  },
  users: function () {
    return Meteor.users.find({'rooms.room': Router.current().params._id});
  },
  isHost: function () {
    return Router.current().params._id === Meteor.userId();
  }
});
