Template.song.addedBy = function () {
  return Meteor.users.findOne(this.addedBy).profile.name;
}

Template.song.removable = function () {
  return this.addedBy && Session.equals('roomId', Meteor.userId()) || this.addedBy === Meteor.userId();
}

Template.song.favorited = function () {
  return Meteor.userId() && _.findWhere(Meteor.user().favorites, {yt_id: this.yt_id});
}

Template.song.events({
  'click .close': function () {
    Meteor.call('removeSong', this._id, Session.get('roomId'), handleError);
  },
  'click .glyphicon-star-empty': function () {
  	Meteor.call('favorite', this, handleError);
  },
  'click .glyphicon-star': function () {
    Meteor.call('unfavorite', this, handleError);
  }
});
