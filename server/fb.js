friendIds = function (userId) {
  var user = Meteor.users.findOne(userId);
  if (!user || !user.services.facebook) return [];
  return _.pluck(HTTP.get('https://graph.facebook.com/v2.2/' + user.services.facebook.id + '/friends', {
    params: {access_token: user.services.facebook.accessToken, limit: 1000}
  }).data.data, 'id').concat(user.services.facebook.id);
};
