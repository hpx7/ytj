function formatDuration (duration) {
  var h = parseInt(duration.match(/\d+(?=H)/)) || 0;
  var m = parseInt(duration.match(/\d+(?=M)/)) || 0;
  var s = parseInt(duration.match(/\d+(?=S)/)) || 0;
  return new Date((h*3600+m*60+s)*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/, '');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

ytAPI = function (params, cb) {
  var ytBase = 'https://www.googleapis.com/youtube/v3/';
  var key = Meteor.isServer ? Meteor.settings.server_yt_key : Meteor.settings.public.client_yt_key;
  params = _.extend({part: 'id', maxResults: 16, type: 'video', videoEmbeddable: true, key: key}, params);
  HTTP.get(ytBase + 'search', {params: params}, function (error, result) {
    var ids = _.pluck(_.pluck(result.data.items, 'id'), 'videoId');
    params = {part: 'snippet,contentDetails,statistics', id: ids, key: key};
    HTTP.get(ytBase + 'videos', {params: params}, function (error, result) {
      cb(error, _.map(result.data.items, function (item) {
        return {
          yt_id: item.id,
          title: item.snippet.title,
          author: item.snippet.channelTitle,
          imgUrl: item.snippet.thumbnails.medium.url,
          duration: formatDuration(item.contentDetails.duration),
          viewCount: formatViews(item.statistics.viewCount)
        };
      }));
    });
  });
};
