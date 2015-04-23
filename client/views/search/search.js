createYTSearch(function () {
  var query = Router.current() && Router.current().params.query && Router.current().params.query.q;
  if (query) return {q: query, maxResults: 16};
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
    return Router.current().params.query.q;
  },
  searchResults: function () {
    return SearchResults.find();
  }
});

Template.search.events({
  'submit form': function (e) {
    e.preventDefault();
    $('.queryinput').blur();
    var params = Router.current().params;
    params.query.q = $(e.target).find('.queryinput').val();
    Router.go(Router.current().route.getName(), params, {query: params.query, hash: params.hash});
  }
});
