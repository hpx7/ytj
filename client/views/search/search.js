SearchSongs = new Meteor.Collection('search');

Template.search.helpers({
  searchResults: function () {
    return SearchSongs.find();
  },
  query: function () {
    return Session.get('searchQuery');
  }
});

Tracker.autorun(function () {
  var query = Session.get('searchQuery');
  if (query) Meteor.subscribe('search', query);
});

Template.search.rendered = function () {
  $('#queryinput').autocomplete({
    source: function (request, response) {
      var url = 'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=?';
      $.getJSON(url, {q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  }).on('autocompleteselect', function (event, ui) {
    Session.set('searchQuery', ui.item.value);
  });
};

Template.search.events({
  'submit form': function (e) {
    e.preventDefault();
    var query = $('#queryinput').val();
    if (query) {
      $('#queryinput').blur();
      Session.set('searchQuery', query);
    }
  }
});
