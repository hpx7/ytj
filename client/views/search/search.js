RegisterAsyncHelper({template: Template.search, helperName: 'searchResults'}, function (cb) {
  var query = Router.current() && Router.current().params.query && Router.current().params.query.q;
  if (query) {
    SearchYT({q: query, maxResults: 16}, YTMapping, function (err, data) {
      cb(data);
    });
  } else
    cb([]);
});

Template.search.helpers({
  query: function () {
    return Router.current().params.query.q;
  }
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

Template.search.events({
  'submit form': function (e) {
    $('.queryinput').blur();
    var params = Router.current().params;
    params.query.q = $(e.target).find('.queryinput').val();
    Router.go(Router.current().route.getName(), params, {query: params.query, hash: params.hash});
    return false;
  }
});
