var ytBase = 'https://gdata.youtube.com/feeds/api/videos/';
var ytParams = {
  v: 2, alt: 'json', 'paid-content': false, 'max-results': 16,
  fields: 'entry(title,author(name),yt:statistics(@viewCount),media:group(yt:videoid,yt:duration,media:thumbnail[@width=320](@url)))'
};

function formatTime (secs) {
  return new Date(secs*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/,'');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getYTInfo (url, params) {
  var result = HTTP.get(ytBase + url, {params: _.extend(params, ytParams)});
  return _.map(result.data.feed.entry, function (entry) {
    return {
      yt_id: entry.media$group.yt$videoid.$t,
      title: entry.title.$t,
      author: entry.author[0].name.$t,
      duration: formatTime(entry.media$group.yt$duration.seconds),
      viewCount: formatViews(entry.yt$statistics.viewCount),
      imgUrl: entry.media$group.media$thumbnail[0].url
    };
  });
}

Meteor.methods({
  searchResults: function (query) {
    return query && getYTInfo('', {q: query});
  },
  related: function (yt_id) {
    return yt_id && getYTInfo(yt_id + '/related', {});
  },
  next: function (yt_id) {
    var related = getYTInfo(yt_id + '/related', {});
    return related[Math.random() * related.length | 0];
  }
});
