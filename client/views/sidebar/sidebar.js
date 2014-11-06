var tabs = ['Related', 'Search', 'Favorites'];

Template.sidebar.helpers({
  tabs: function () {
    return tabs;
  },
  currentTab: function () {
    return (Router.current().getParams().hash || tabs[0]).toLowerCase();
  },
  isSelected: function (tab) {
    return tab === (Router.current().getParams().hash || tabs[0]);
  }
});

Template.sidebar.events({
  'click .song': function (e) {
  	$(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Router.current().params._id, handleError);
  }
});
