Template.search.searchResults = function () {
  return Session.get('searchResults');
}

Deps.autorun(function () {
  var query = Session.get('searchQuery');
  if (query) {
    getSongs('', {'max-results': 16, q: query}, function (songs) {
      Session.set('searchResults', songs);
    });
  } else
    Session.set('searchResults', null);
});

Template.search.rendered = function () {
  $('#queryinput').autocomplete({
    source: function (request, response) {
      var url = 'http://clients1.google.com/complete/search?client=youtube&ds=yt&callback=?';
      $.getJSON(url, {q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  }).on('autocompleteselect', function (event, ui) {
    Session.set('searchQuery', ui.item.value);
  });
}

Template.search.events({
  'submit form': function (e) {
    e.preventDefault();
    var query = $('#queryinput').val();
    query && $('#queryinput').blur() && Session.set('searchQuery', query);
  }
});
