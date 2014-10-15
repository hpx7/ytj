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

function checkLoggedIn (userId) {
  if (!userId)
    throw new Meteor.Error(401, 'User not logged in');
}

function sanitizeSong (song) {
  var attrs = ['yt_id', 'title', 'author', 'duration', 'viewCount', 'imgUrl'];
  if (_.difference(attrs, _.keys(song)).length)
    throw new Meteor.Error(422, 'Invalid song object');
  return _.pick(song, attrs);
}

Meteor.methods({
  addSong: function (song, roomId) {
    checkLoggedIn(this.userId);
    Songs.insert(_.extend(sanitizeSong(song), {
      related: getYTInfo(song.yt_id + '/related', {}),
      addedBy: this.userId,
      addedFrom: roomId,
      addedAt: new Date()
    }));
  },
  removeSong: function (songId, roomId) {
    checkLoggedIn(this.userId);
    var song = Songs.findOne(songId);
    if (!song || (roomId !== this.userId && song.addedBy !== this.userId))
      throw new Meteor.Error(403, 'Not allowed to remove this song');
    if (Songs.find().count() === 1)
      Meteor.call('addSong', song.related[Math.random() * 16 | 0], roomId);
    Songs.remove(songId);
  },
  favorite: function (song) {
    checkLoggedIn(this.userId);
    Favorites.insert(_.extend(sanitizeSong(song), {favoritedBy: this.userId}));
  },
  unfavorite: function (yt_id) {
    checkLoggedIn(this.userId);
    Favorites.remove({favoritedBy: this.userId, yt_id: yt_id});
  },
  searchResults: function (query) {
    return query && getYTInfo('', {q: query});
  }
});
