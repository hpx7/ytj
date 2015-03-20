Router.configure({layoutTemplate: 'layout', fastRender: true});

Router.route('/', {name: 'home'});

Router.route('/rooms/:_id', {name: 'room'});
