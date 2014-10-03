Template.favorites.helpers({
  favoriteVideos: function () {
    return Meteor.user() && Meteor.user().favorites;
  }
});
