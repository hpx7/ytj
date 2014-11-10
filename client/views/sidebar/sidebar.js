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
