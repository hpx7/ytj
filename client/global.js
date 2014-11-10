handleError = function (error) {
  if (error) alert('Error: ' + error.message);
};

Template.registerHelper('handleReady', function (handleName) {
  return Router.current() && Router.current()[handleName].ready()
});
