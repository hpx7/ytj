Router.configure({layoutTemplate: 'layout', onBeforeAction: 'dataNotFound', fastRender: true});

Router.route('/', {
  name: 'home',
  onBeforeAction: function () {
    Meteor.subscribe('rooms');
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
    Meteor.subscribe('favorites');
    Meteor.subscribe('queue', this.params._id);
    this.next();
  }
});
