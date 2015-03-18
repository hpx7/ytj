Template.favorites.onCreated(function () {
  this.subscribe('favorites');
});

Template.favorites.helpers({
  favoriteVideos: function () {
    return Favorites.find();
  }
});
