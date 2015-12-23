Template.favorites.onCreated(function () {
  this.subscribe('favorites');
});

Template.favorites.helpers({
  favoriteVideos() {
    return Favorites.find({}, {sort: {addedAt: -1}});
  }
});
