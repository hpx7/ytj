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

function getSongs (url, params, cb) {
  HTTP.get(ytBase + url, {params: _.extend(params, ytParams)}, function (err, result) {
    cb(_.map(result.data.feed.entry, function (entry) {
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

Meteor.publish('users', function () {
  return Meteor.users.find();
});

Meteor.publish('queue', function (roomId) {
  var self = this;
  Meteor.users.update(self.userId, {$addToSet: {rooms: {room: roomId, session: self.connection.id}}});
  this.onStop(function () {
    Meteor.users.update(self.userId, {$pull: {rooms: {room: roomId, session: self.connection.id}}});
  });
  return Songs.find({addedFrom: roomId});
});

Meteor.publish('related', function (yt_id) {
  var self = this;
  getSongs(yt_id + '/related', {'max-results': 16}, function (songs) {
    _.each(songs, function (song) {
      self.added('related', Random.id(), song);
    });
  });
});

Meteor.publish('search', function (query) {
  var self = this;
  getSongs('', {'max-results': 16, q: query}, function (songs) {
    _.each(songs, function (song) {
      self.added('search', Random.id(), song);
    });
  });
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
