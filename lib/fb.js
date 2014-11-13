getFriendIds = function (userId, fb_id) {
  var fbInfo = Meteor.users.findOne(userId).services.facebook;
  return _.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + fbInfo.id + '/friends', {
    params: {access_token: fbInfo.accessToken, limit: 1000}
  }).data.data, 'id');
};
