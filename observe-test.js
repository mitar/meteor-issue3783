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
      console.log("changed", EJSON.equals(newDocument, oldDocument), newDocument, oldDocument);
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
    var id = collection.findOne().counter.length;

    function Document(id) {
      this.id = id;
      this.foobar = function () {};
    }

    console.log(new Document(id));

    collection.update({}, {
      $addToSet: {
        counter: new Document(id)
      }
    });
  }
});