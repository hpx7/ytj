var ytBase = 'https://gdata.youtube.com/feeds/api/videos/';
var ytParams = {
  v: 2, alt: 'json', 'paid-content': false,
  fields: 'entry(title,author(name),yt:statistics(@viewCount),media:group(yt:videoid,yt:duration,media:thumbnail[@width=320](@url)))'
};

function formatTime (secs) {
  return new Date(secs*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/,'');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

getSongs = function (url, params, callback) {
  $.getJSON(ytBase + url, _.extend(params, ytParams), function (data) {
    callback(_.map(data.feed.entry, function (entry) {
      return {
        yt_id: entry.media$group.yt$videoid.$t,
        title: entry.title.$t,
        author: entry.author[0].name.$t,
        duration: formatTime(entry.media$group.yt$duration.seconds),
        viewCount: formatViews(entry.yt$statistics.viewCount),
        imgUrl: entry.media$group.media$thumbnail[0].url
      };
    }));
  });
}

songEnd = function () {
  var song = Songs.findOne({addedFrom: Session.get('roomId')}, {sort: {addedAt: 1}});
  if (Songs.find({addedFrom: Session.get('roomId')}).count() === 1) {
    var r = 1 + Math.random() * 16 | 0;
    getSongs(song.yt_id + '/related', {'start-index': r, 'max-results': 1}, function (songs) {
      Meteor.call('addSong', songs[0], Session.get('roomId'));
      Meteor.call('removeSong', song._id, Session.get('roomId'));
    });
  } else
    song && Meteor.call('removeSong', song._id, Session.get('roomId'));
}
