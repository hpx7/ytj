Template.song.addedBy = function () {
  return Meteor.users.findOne(this.addedBy).username;
}

Template.song.removable = function () {
  return this.addedBy && Session.equals('roomId', Meteor.userId()) || this.addedBy === Meteor.userId();
}

Template.song.events({
  'click .close': function () {
    Meteor.call('removeSong', this._id, Session.get('roomId'));
  }
});
