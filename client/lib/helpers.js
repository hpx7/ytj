handleError = function (error) {
  if (error) alert('Error: ' + error.message);
};

removeSong = function (songId) {
  var related = Related.find().fetch(), roomId = FlowRouter.getParam('roomId');
  Meteor.call('removeSong', songId, roomId, handleError);
  if (related.length && !Songs.findOne())
    Meteor.call('addSong', related[Math.random() * related.length | 0], roomId, handleError);
};

createYTSearch = function (getYTParams, collection) {
  Tracker.autorun(function () {
    collection.remove({});
    SearchYT(getYTParams(), YTMapping, function (err, data) {
      _.each(data, function (result) {
        collection.insert(result);
      });
    });
  });
};

Template.registerHelper('routeName', function () {
  return FlowRouter.getRouteName();
});

Template.registerHelper('numSongs', function () {
  return Songs.find().count();
});

Template.registerHelper('myRoom', function () {
  return Rooms.findOne({'owner._id': Meteor.userId()});
});

Template.registerHelper('inMyRoom', function () {
  return Rooms.findOne({_id: FlowRouter.getParam('roomId'), 'owner._id': Meteor.userId()});
});
