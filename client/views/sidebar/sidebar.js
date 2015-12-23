const tabs = ['Related', 'Search', 'Favorites'];

Template.sidebar.helpers({
  tabs() {
    return tabs;
  },
  currentTab() {
    return (FlowRouter.getQueryParam('tab') || tabs[0]).toLowerCase();
  },
  isSelected(tab) {
    return tab === (FlowRouter.getQueryParam('tab') || tabs[0]);
  }
});

Template.sidebar.events({
  'click a.pointer'(e) {
    FlowRouter.setQueryParams({tab: String(this)});
  }
});
