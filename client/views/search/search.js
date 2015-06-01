createYTSearch(function () {
  if (FlowRouter.getQueryParam('q'))
    return {q: FlowRouter.getQueryParam('q'), maxResults: 16};
}, SearchResults);

Template.search.onCreated(function () {
  this.subscribe('favorites');
});

Template.search.onRendered(function () {
  $('.queryinput').autocomplete({
    source: function (request, response) {
      var url = 'https://suggestqueries.google.com/complete/search?callback=?';
      $.getJSON(url, {client: 'youtube', ds: 'yt', q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  });
});

Template.search.helpers({
  query: function () {
    return FlowRouter.getQueryParam('q');
  },
  searchResults: function () {
    return SearchResults.find();
  }
});

Template.search.events({
  'submit form': function (e) {
    e.preventDefault();
    $('.queryinput').blur();
    FlowRouter.setQueryParams({q: $(e.target).find('.queryinput').val() || null});
  }
});
