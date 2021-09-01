Let's Do This!
=============

Let's Do This is a MEAN stack (MongoDB, Express.js, Angular.js and Node.js) application.  

When we plan road trips, potlucks and dinner parties, the first thing people ask is often, _"What can I bring?"_.  "Let's Do This" solves this problem by giving people an easy to way to plan events, invite friends and publish a list of things people can bring.  It also offers a way to quickly see who is bringing what.

The project is live on Heroku at (https://lets-do-this.herokuapp.com/)

To get started, simply log in with a Google account.  Once logged in a user can look at the events for which he/she is invited or organize a new event.  If the user is an attendee or an organizer for any event, there will be an entry for each event in the "My Events" menu.

If you don't have any events scheduled, you can click create an event to get started.  Fill out the pertinent details in the form, and add items you need for your event.  Each item will appear after typing a name and pressing the enter key.

Once your event is all set, click "Let's Do This" and you'll be taken to the event's page.  As the event organizer, you'll be able to edit the event deatils as well as delete the event.  

What you'll see in the event view:

The organizer for the event is listed so everyone knows who to contact with questions.  

Attendees are listed, as well as a simple form to invite someone.  All that's needed is a First and Last Name and and an email address.  Nodemailer will send out an email to each invitee letting them know they've been invited to an event.  

The items that still need to be claimed are listed as well as the responsible attendee.  If the logged in user is the responsible attendee, this person will also be able to 'unclaim' an item.  

Things Left Unclaimed is a list of all the items that are left to be claimed by an attendee.  To claim an item, a user simply clicks on the name of the item and it will be moved to the "Things We Have Covered" section.

The last portion of the Event view is "Are We Forgetting Something".  This allows anyone (Event Organizer or Attendee) to add more items to the list of the "Things Left Unclaimed"









