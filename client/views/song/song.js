Template.song.helpers({
  addedBy: function () {
    return Meteor.users.findOne(this.addedBy).profile.name;
  },
  removable: function () {
    return this.addedBy && Session.equals('roomId', Meteor.userId()) || this.addedBy === Meteor.userId();
  },
  favorited: function () {
    return Favorites.findOne({yt_id: this.yt_id});
  }
});

Template.song.events({
  'click .close': function (e) {
    Meteor.call('removeSong', this._id, Session.get('roomId'), handleError);
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
