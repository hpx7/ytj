Template.favorites.favoriteVideos = function () {
  return Meteor.user() && Meteor.user().favorites;
}
