var mapping = {
  yt_id: 'id',
  title: 'snippet.title',
  author: 'snippet.channelTitle',
  imgUrl: 'snippet.thumbnails.medium.url',
  duration: 'contentDetails.duration',
  viewCount: 'statistics.viewCount'
};

CreateYTSearch = function (getYTParams, collection) {
  Tracker.autorun(function () {
    collection.remove({});
    SearchYT(getYTParams(), mapping, function (err, data) {
      _.each(data, function (result) {
        collection.insert(result);
      });
    });
  });
};
