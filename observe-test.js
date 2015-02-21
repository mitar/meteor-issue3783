collection = new Meteor.Collection('Test');

if (Meteor.isClient) {
  Template.hello.helpers({
    counter: function () {
      var c = collection.findOne();
      return c && c.counter && c.counter.length || 0;
    }
  });

  Template.hello.events({
    'click button': function () {
      Meteor.call('increase', function (error) {
        if (error) alert(error);
      })
    }
  });

  collection.find().observe({
    changed: function (newDocument, oldDocument) {
      console.log("changed", newDocument, oldDocument);
    }
  })
}
else {
  if (!collection.find().count()) {
    collection.insert({counter: []});
  }
}

Meteor.methods({
  increase: function () {
    var random = Random.id();
    collection.update({
      counter: {
        $not: {
          $elemMatch: {
            random: random
          }
        }
      }
    }, {
      $addToSet: {
        counter: {
          random: random
        }
      }
    });
  }
});