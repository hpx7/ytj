var tabs = ['Related', 'Search', 'Favorites'];

Template.sidebar.tabs = function () {
  return tabs;
}

Template.sidebar.currentTab = function () {
  return (Session.get('tab') || tabs[0]).toLowerCase();
}

Template.sidebar.isSelected = function (tab) {
  var selectedTab = Session.get('tab') || tabs[0];
  return tab === selectedTab;
}

Template.sidebar.tabIs = function (tab, isDefault) {
  return (isDefault && !Session.get('tab')) || Session.equals('tab', tab);
}

Template.sidebar.events({
  'click .song': function (e) {
  	$(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Session.get('roomId'), handleError);
  },
  'click a': function (e) {
    e.preventDefault();
    Session.set('tab', e.target.text);
    IronLocation.pushState(null, 'YouTube Jukebox', e.target.href, true);
  }
});
