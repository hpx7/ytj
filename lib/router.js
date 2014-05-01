Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    return Meteor.subscribe('users');
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
      return Meteor.users.findOne(this.params._id, {fields: {username: 1}});
    },
    onBeforeAction: function () {
      Meteor.call('join', this.params._id);
      Session.set('roomId', this.params._id);
    },
    onStop: function () {
      Meteor.call('leave', this.params._id);
      Session.set('roomId', null);
    },
    fastRender: true
  });
});
