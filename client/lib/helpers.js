handleError = (error) => {
  if (error) alert('Error: ' + JSON.stringify(error));
};

removeSong = (songId) => {
  const related = Related.find().fetch(), roomId = FlowRouter.getParam('roomId');
  Meteor.call('removeSong', songId, roomId, handleError);
  if (related.length && !Songs.findOne())
    Meteor.call('addSong', related[Math.random() * related.length | 0], roomId, handleError);
};

createYTSearch = (getYTParams, collection) => {
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
