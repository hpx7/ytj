createYTSearch(() => {
  if (FlowRouter.getQueryParam('q'))
    return {q: FlowRouter.getQueryParam('q'), maxResults: 16};
}, SearchResults);

Template.search.onCreated(function () {
  this.subscribe('favorites');
});

Template.search.onRendered(() => {
  $('.queryinput').autocomplete({
    source(request, response) {
      const url = 'https://suggestqueries.google.com/complete/search?callback=?';
      $.getJSON(url, {client: 'youtube', ds: 'yt', q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    },
    select(e, ui) {
      FlowRouter.setQueryParams({q: ui.item.value});
    }
  });
});

Template.search.helpers({
  searchResults() {
    return SearchResults.find();
  }
});

Template.search.events({
  'submit form'(e) {
    e.preventDefault();
    $('.queryinput').blur();
    FlowRouter.setQueryParams({q: $(e.target).find('.queryinput').val() || null});
  }
});
