Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    return Meteor.subscribe('global');
  }
});

Router.map(function () {
  this.route('home', {
    path: '/',
    fastRender: true
  });
  this.route('room', {
    path: '/rooms/:_id',
    waitOn: function () {
      return Meteor.subscribe('queue', this.params._id);
    },
    data: function () {
      return Meteor.users.findOne(this.params._id);
    },
    onBeforeAction: function () {
      Session.set('roomId', this.params._id);
    },
    onStop: function () {
      Session.set('roomId', null);
    },
    fastRender: true
  });
});
