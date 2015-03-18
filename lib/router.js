Router.configure({layoutTemplate: 'layout', loadingTemplate: 'spinner', onBeforeAction: 'dataNotFound', fastRender: true});

Router.route('/', {name: 'home'});

Router.route('/rooms/:_id', {
  name: 'room',
  waitOn: function () {
    return Meteor.subscribe('room', this.params._id);
  },
  data: function () {
    return Rooms.findOne(this.params._id);
  }
});
