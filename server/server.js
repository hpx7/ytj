var ytBase = 'https://gdata.youtube.com/feeds/api/videos/';
var ytParams = {
  v: 2, alt: 'json', 'paid-content': false, 'max-results': 16,
  fields: 'entry(title,author(name),yt:statistics(@viewCount),media:group(yt:videoid,yt:duration,media:thumbnail[@width=320](@url)))'
};

function formatTime (secs) {
  return new Date(secs*1000).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1').replace(/^0*:?0?/,'');
}

function formatViews (x) {
  return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function publishSongs (client, collection, url, params) {
  HTTP.get(ytBase + url, {params: _.extend(params, ytParams)}, function (err, result) {
    _.each(result.data.feed.entry, function (entry) {
      client.added(collection, Random.id(), {
        yt_id: entry.media$group.yt$videoid.$t,
        title: entry.title.$t,
        author: entry.author[0].name.$t,
        duration: formatTime(entry.media$group.yt$duration.seconds),
        viewCount: formatViews(entry.yt$statistics.viewCount),
        imgUrl: entry.media$group.media$thumbnail[0].url
      });
    });
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
  publishSongs(this, 'related', yt_id + '/related', {});
});

Meteor.publish('search', function (query) {
  publishSongs(this, 'search', '', {q: query});
});

Meteor.startup(function () {
  Meteor.users.update({}, {$set: {rooms: []}}, {multi: true});
});
