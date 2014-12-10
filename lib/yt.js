var ytBase = 'https://gdata.youtube.com/feeds/api/videos/';

function formatTime (secs) {
  return new Date(secs*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/,'');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

getYTInfo = function (url, params, cb) {
  var ytParams = {
    v: 2, alt: 'json', 'paid-content': false, 'max-results': 16,
    fields: 'entry(title,author(name),yt:statistics(@viewCount),media:group(yt:videoid,yt:duration,media:thumbnail[@width=320](@url)))'
  };
  HTTP.get(ytBase + url, {params: _.extend(ytParams, params)}, function (error, result) {
    var items = result.data.feed ? result.data.feed.entry : [result.data.entry];
    cb(error, _.map(items, function (entry) {
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
};
