Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    return Meteor.subscribe('users');
  }
});

Router.map(function () {
  this.route('home', {
    path: '/'
  });
  this.route('room', {
    path: '/rooms/:_id',
    waitOn: function () {
      return Meteor.subscribe('queue', this.params._id);
    },
    data: function () {
      return Meteor.users.findOne(this.params._id, {fields: {username: 1}});
    },
    before: function () {
      Meteor.call('join', this.params._id);
      Session.set('roomId', this.params._id);
    },
    unload: function () {
      Meteor.call('leave', this.params._id);
      Session.set('roomId', null);
    }
  });
});
