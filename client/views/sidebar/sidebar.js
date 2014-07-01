Template.sidebar.tabIs = function (tab, isDefault) {
  return (isDefault && !Session.get('tabHash')) || Session.equals('tabHash', tab);
}

Template.sidebar.events({
  'click .song': function (e) {
  	$(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Session.get('roomId'), handleError);
  },
  'click a': function (e) {
  	e.preventDefault();
    Session.set('tabHash', e.target.hash);
  } 
});
