Router.configure({
  layoutTemplate: 'layout',
  waitOn: function () {
    return [Meteor.subscribe('users'), Meteor.subscribe('favorites')];
  }
});

Router.route('/', {name: 'home', fastRender: true});

Router.route('/rooms/:_id', function () {
  Meteor.subscribe('room', this.params._id);
  this.render(Meteor.users.findOne(this.params._id) ? 'room' : 'notFound');
}, {name: 'room', fastRender: true});
