Router.onBeforeAction('dataNotFound');

Router.configure({
  layoutTemplate: 'layout',
  notFoundTemplate: 'notFound',
  waitOn: function () {
    return [Meteor.subscribe('users'), Meteor.subscribe('favorites')];
  },
  onBeforeAction: function () {
    Session.set('roomId', this.params._id);
    Session.set('searchQuery', this.params.q);
    Session.set('tab', this.params.hash);
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
      return Meteor.subscribe('room', this.params._id);
    },
    data: function () {
      return Meteor.users.findOne(this.params._id);
    },
    onStop: function () {
      Session.set('roomId', null);
    },
    fastRender: true
  });
});
