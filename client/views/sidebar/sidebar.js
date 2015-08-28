var tabs = ['Related', 'Search', 'Favorites'];

Template.sidebar.helpers({
  tabs: function () {
    return tabs;
  },
  currentTab: function () {
    return (FlowRouter.getQueryParam('tab') || tabs[0]).toLowerCase();
  },
  isSelected: function (tab) {
    return tab === (FlowRouter.getQueryParam('tab') || tabs[0]);
  }
});

Template.sidebar.events({
  'click a.pointer': function (e) {
    FlowRouter.setQueryParams({tab: String(this)});
  }
});
