Template.room.helpers({
  listeners: function () {
    return Listeners.find({'room._id': this._id, user: {$ne: null}});
  }
});
