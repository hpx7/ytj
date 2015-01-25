var search = MeteorSearch();

RegisterAsyncHelper({template: Template.search, helperName: 'searchResults', global: true}, function (cb) {
  if (search.getSearchQuery()) {
    SearchYT({q: search.getSearchQuery(), maxResults: 16}, YTMapping, function (err, data) {
      cb(data);
    });
  } else
    cb([]);
});

Template.search.rendered = function () {
  $('.queryinput').autocomplete({
    source: function (request, response) {
      var url = 'https://suggestqueries.google.com/complete/search?callback=?';
      $.getJSON(url, {client: 'youtube', ds: 'yt', q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  });
};
