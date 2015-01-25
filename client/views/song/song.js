Template.song.helpers({
  removable: function () {
    var room = Rooms.findOne(Router.current().params._id);
    return room && this.adder && _.contains([room.owner._id, this.adder._id], Meteor.userId());
  },
  favorited: function () {
    return Favorites.findOne({yt_id: this.yt_id});
  },
  duration: function () {
    var h = parseInt(this.duration.match(/\d+(?=H)/)) || 0;
    var m = parseInt(this.duration.match(/\d+(?=M)/)) || 0;
    var s = parseInt(this.duration.match(/\d+(?=S)/)) || 0;
    return new Date((h*3600+m*60+s)*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/, '');
  },
  viewCount: function () {
    return this.viewCount && this.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

Template.song.events({
  'click .song.pointer': function (e) {
    $(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, Router.current().params._id, handleError);
  },
  'click .close': function (e) {
    if (Songs.find({_id: {$ne: this._id}}).count() || this.related)
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
