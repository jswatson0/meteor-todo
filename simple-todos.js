// simple-todos.js
Tasks = new Mongo.Collection("tasks");


if (Meteor.isClient) {

  // This code only runs on the client
  Template.body.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")) {
        //if .hideCompleted is checked, filter the tasks
        return Tasks.find({checked: {$ne: true}}, {sort:{createdAt: -1}});
      } else {
        //otherwise return all
        return Tasks.find({}, {sort:{createdAt: -1}});
      }
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
    },

    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // this func is called when new-task form is submited
      console.log(event);

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date(), // current time
        owner: Meteor.userId(), // id of logged in user
        username: Meteor.user().username // username of logged in user
      })

      // clear form
      event.target.text.value = "";

      // prevent default form submit
      return false;
    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // set the checked property to the opposite of its current value
      Tasks.update(this._id, {$set: {checked: !this.checked}});
    },

    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })
}