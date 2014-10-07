var tabs = ['Related', 'Search', 'Favorites'];

Template.sidebar.helpers({
  tabs: function () {
    return tabs;
  },
  currentTab: function () {
    return (Session.get('tab') || tabs[0]).toLowerCase();
  },
  isSelected: function (tab) {
    return tab === (Session.get('tab') || tabs[0]);
  }
});

Template.sidebar.events({
  'click .song': function (e) {
  	$(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Session.get('roomId'), handleError);
  },
  'click a': function (e) {
    Session.set('tab', e.target.text);
    IronLocation.pushState(null, 'YouTube Jukebox', e.target.href, true);
    return false;
  }
});
