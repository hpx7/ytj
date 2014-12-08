var ytBase = 'https://gdata.youtube.com/feeds/api/videos/';
var entryFields = 'title,author(name),yt:statistics(@viewCount),media:group(yt:videoid,yt:duration,media:thumbnail[@width=320](@url))';

function formatTime (secs) {
  return new Date(secs*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/,'');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function entryToSong (entry) {
  return {
    yt_id: entry.media$group.yt$videoid.$t,
    title: entry.title.$t,
    author: entry.author[0].name.$t,
    duration: formatTime(entry.media$group.yt$duration.seconds),
    viewCount: formatViews(entry.yt$statistics.viewCount),
    imgUrl: entry.media$group.media$thumbnail[0].url
  };
}

getYTInfo = function (url, params, cb) {
  var ytParams = {
    v: 2, alt: 'json',
    fields: 'entry(' + entryFields + ')'
  };
  HTTP.get(ytBase + url, {params: _.extend(ytParams, params)}, function (error, result) {
    var items = result.data.feed ? result.data.feed.entry : [result.data.entry];
    cb(error, _.map(items, entryToSong));
  });
};

relatedSongs = function (yt_id) {
  return Meteor.wrapAsync(getYTInfo)(yt_id + '/related', {'paid-content': false, 'max-results': 16});
};

songInfo = function (yt_id) {
  return Meteor.wrapAsync(getYTInfo)(yt_id, {fields: entryFields})[0];
};
