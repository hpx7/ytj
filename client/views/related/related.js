Template.related.relatedVideos = function () {
  return Session.get('relatedVideos');
}

Deps.autorun(function () {
  var song = Songs.findOne({addedFrom: Session.get('roomId')}, {sort: {addedAt: 1}});
  if (song) {
    getSongs(song.yt_id + '/related', {'max-results': 16}, function (songs) {
      Session.set('relatedVideos', songs);
    });
  } else
    Session.set('relatedVideos', null);
});
