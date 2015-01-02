Router.configure({layoutTemplate: 'layout', loadingTemplate: 'spinner', onBeforeAction: 'dataNotFound', fastRender: true});

Router.route('/', {
  name: 'home',
  onBeforeAction: function () {
    this.friendsRoomsHandle = Meteor.subscribe('friendsRooms');
    this.next();
  }
});

Router.route('/rooms/:_id', {
  name: 'room',
  waitOn: function () {
    return Meteor.subscribe('room', this.params._id);
  },
  data: function () {
    return Rooms.findOne(this.params._id);
  },
  onBeforeAction: function () {
    this.queueHandle = Meteor.subscribe('queue', this.params._id);
    this.favoritesHandle = Meteor.subscribe('favorites');
    this.next();
  }
});
