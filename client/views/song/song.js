Template.song.helpers({
  removable: function () {
    var room = Rooms.findOne(Router.current().params._id);
    return room && this.adderId && _.contains([room.ownerId, this.adderId], Meteor.userId());
  },
  favorited: function () {
    return Favorites.findOne({yt_id: this.yt_id});
  }
});

Template.song.events({
  'click .song.pointer': function (e) {
    $(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Router.current().params._id, handleError);
  },
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
