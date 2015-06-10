Accounts.onCreateUser(function (options, user) {
  user.username = user.username || options.profile.name;
  Rooms.insert({owner: user, listeners: []});
  return user;
});

Meteor.startup(function () {
  Rooms.update({}, {$set: {listeners: []}}, {multi: true});
  ServiceConfiguration.configurations.upsert({service: 'facebook'}, {
    $set: {loginStyle: 'popup', appId: Meteor.settings.fbAppId, secret: Meteor.settings.fbSecret}
  });
});
