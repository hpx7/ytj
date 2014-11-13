Router.configure({layoutTemplate: 'layout', loadingTemplate: 'spinner', onBeforeAction: 'dataNotFound'});

Router.route('/', {
  name: 'home',
  onBeforeAction: function () {
    this.listenersHandle = Meteor.subscribe('listeners');
    this.roomsHandle = Meteor.subscribe('rooms');
    this.next();
  }
});

Router.route('/rooms/:_id', {
  name: 'room',
  waitOn: function () {
    return Meteor.subscribe('rooms', this.params._id);
  },
  data: function () {
    return Rooms.findOne(this.params._id);
  },
  onBeforeAction: function () {
    this.queueHandle = Meteor.subscribe('queue', this.params._id);
    this.listenersHandle = Meteor.subscribe('listeners', this.params._id);
    this.favoritesHandle = Meteor.subscribe('favorites');
    this.next();
  }
});
