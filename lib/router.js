Router.configure({layoutTemplate: 'layout', onBeforeAction: 'dataNotFound', fastRender: true});

Router.route('/', {
  name: 'home',
  onBeforeAction: function () {
    Meteor.subscribe('rooms');
    Meteor.subscribe('listeners');
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
    Meteor.subscribe('listeners', this.params._id);
    Meteor.subscribe('queue', this.params._id);
    Meteor.subscribe('favorites');
    this.next();
  }
});
