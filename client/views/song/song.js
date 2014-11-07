Template.song.helpers({
  removable: function () {
    return this.adderId && _.contains([Rooms.findOne().ownerId, this.adderId], Meteor.userId());
  },
  favorited: function () {
    return Favorites.findOne({yt_id: this.yt_id});
  }
});

Template.song.events({
  'click .close': function (e) {
    Meteor.call('removeSong', this._id, Router.current().params._id, handleError);
  },
  'click .glyphicon-star-empty': function (e) {
  	Meteor.call('favorite', this, handleError);
    return false;
  },
  'click .glyphicon-star': function (e) {
    Meteor.call('unfavorite', this.yt_id, handleError);
    return false;
  }
});
