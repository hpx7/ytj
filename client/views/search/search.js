Template.search.helpers({
  searchResults: function () {
    return Session.get('searchResults');
  },
  query: function () {
    return Router.current().params.query.q;
  }
});

Tracker.autorun(function () {
  var query = Router.current() && Router.current().params.query && Router.current().params.query.q;
  query ? ytAPI({q: query}, function (error, data) {
    Session.set('searchResults', data);
  }) : Session.set('searchResults', null);
});

Template.search.rendered = function () {
  $('#queryinput').autocomplete({
    source: function (request, response) {
      var url = 'https://clients1.google.com/complete/search?client=youtube&ds=yt&callback=?';
      $.getJSON(url, {q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  });
};

Template.search.events({
  'submit form': function (e) {
    $('#queryinput').blur();
    Router.go('room', {_id: Router.current().params._id}, {query: {q: $('#queryinput').val()}, hash: 'Search'});
    return false;
  }
});
