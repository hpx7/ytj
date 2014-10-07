Template.favorites.helpers({
  favoriteVideos: function () {
    return Favorites.find({favoritedBy: Meteor.userId()});
  }
});
