Template.song.helpers({
  removable() {
    const room = Rooms.findOne(FlowRouter.getParam('roomId'));
    return room && this.adder && _.contains([room.owner._id, this.adder._id], Meteor.userId());
  },
  favorited() {
    return Favorites.findOne({yt_id: this.yt_id});
  },
  duration() {
    const h = parseInt(this.duration.match(/\d+(?=H)/)) || 0;
    const m = parseInt(this.duration.match(/\d+(?=M)/)) || 0;
    const s = parseInt(this.duration.match(/\d+(?=S)/)) || 0;
    return new Date((h*3600+m*60+s)*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/, '');
  },
  viewCount() {
    return this.viewCount && this.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
});

Template.song.events({
  'click .song.pointer'(e) {
    $(e.target).closest('.song').fadeOut(100).fadeIn(100);
    Meteor.call('addSong', this, FlowRouter.getParam('roomId'), handleError);
  },
  'click .close'(e) {
    if (Songs.find().count() > 1 || Related.findOne())
      removeSong(this._id);
  },
  'click .glyphicon-star-empty'(e) {
    e.stopPropagation();
    Meteor.call('favorite', this, handleError);
  },
  'click .glyphicon-star'(e) {
    e.stopPropagation();
    Meteor.call('unfavorite', this.yt_id, handleError);
  }
});
