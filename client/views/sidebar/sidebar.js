Template.sidebar.searchTab = function () {
  return Session.equals('tabHash', '#search');
}

Template.sidebar.events({
  'click .song': function (e) {
  	$(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Session.get('roomId'));
  },
  'click a': function (e) {
  	e.preventDefault();
    Session.set('tabHash', e.target.hash);
  } 
});
