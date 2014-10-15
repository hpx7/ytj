Template.related.helpers({
  relatedSongs: function () {
    var song = Songs.findOne({}, {sort: {addedAt: 1}});
    return song && song.related;
  }
});
