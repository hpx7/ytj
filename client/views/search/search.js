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
  $('.queryinput').autocomplete({
    source: function (request, response) {
      var url = 'https://suggestqueries.google.com/complete/search?callback=?';
      $.getJSON(url, {client: 'youtube', ds: 'yt', q: request.term}, function (data) {
        response(_.map(data[1], _.first));
      });
    }
  });
};

Template.search.events({
  'submit form': function (e) {
    $('.queryinput').blur();
    var query = $(e.target).find('.queryinput').val();
    Router.go('room', {_id: Router.current().params._id}, {query: {q: query}, hash: 'Search'});
    return false;
  }
});
