ldtApp.factory('DataFactory',['$http','$firebaseAuth', '$location',function($http, $firebaseAuth,$location) {
console.log('Data Factory running');
var self = this;
var auth = $firebaseAuth();
var userObject = {};
var userEvents = {};
var eventObject = {};
var currentUser = {details: {}};
var claimedThings = {};
var unclaimedThings = {};
var eventOrganizers = {};
var eventAttendees = {};
var isLoggedIn = false


function logIn() {
  // the auth.$signInWithPopUp is a 'promise', after .then() is a 'callback'
  auth.$signInWithPopup('google').then(function(firebaseUser){ // which OAuth provider do you want? This is setup in the Firebase portal
    console.log('Firebase authenticated user as: ',firebaseUser.user);
    //firebaseUser at this point is an object with a 'user' attrib
    console.log('var firebaseUser is ',firebaseUser);
    //loads the view related to the Angualar route '/user'
    // isLoggedIn =  true;
    $location.url('/user');
  }).catch(function(error){
    console.log('Error with auth: ',error);
  });
} // end logIn()

//here we are sending the token to the backend
auth.$onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) { // if the object exists...aka. "true", but if the auth state changes due to logout, 'firebaseuser' will not resolve to true.
        firebaseUser.getToken().then(function(idToken) {
          //firebaseUser, at this point, does not have a .user attrib
            currentUser.details = firebaseUser;
            getUserData(idToken);
            getMyEvents(idToken);

        }); //end getToken().then()
    } else {
        console.log('Not logged in or not authorized');
    } // end else
}); // end $onAuthStateChanged

function getUserData(idToken) {
  console.log('getUserData called(idToken)called');
    $http({
        method: 'GET',
        url: '/user/data',
        headers: {
            id_token: idToken
        }
    }).then(function(response) {
        userObject.userData = response.data;
    }); // end http
} // end getUserData()

function getMyEvents(idToken) {
  $http({
      method: 'GET',
      url: '/user/myEvents',
      headers: {
          id_token: idToken
      }
  }).then(function(response) {
      userEvents.myEvents = response.data;

  }); // end http
}//end getMyEvents()

function getBasicEventData(eventId) {
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/event/data/',
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        eventObject.eventData = response.data[0]; //the response is object with a single array of many objects.  Here is where we unpack that into a regular object
        console.log('DataFactory response is: ',eventObject.eventData);
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
      eventObject = {};
    }//end if(firebaseUser)
  }// end function getBasicEventData

// get organizer info
function getOrganizers(eventId) {
  console.log('dataFactory getOrganizers() called')
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/event/organizers/',
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        eventOrganizers.organizers = response.data[0];
        console.log('eventOrganizers.organizers is: ', eventOrganizers.organizers);
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
      eventObject = {};
    }//end if(firebaseUser)
  }// end function getBasicEventData

// get event attendees
function getAttendees(eventId) {
  console.log('dataFactory getAttendees() called')
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/event/attendees/',
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        eventAttendees.attendees = response.data;
        console.log('eventAttendees.attendees is: ', eventAttendees.attendees);
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
      eventObject = {};
    }//end if(firebaseUser)
  }// end function getAttendees

function inviteAttendee(newAttendee){
  console.log('inviteAttendee() @ DF',newAttendee);
  // var newAttendeeEmail = attendee.email
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'PUT',
        url: '/event/invite/',
        headers: {
          id_token: idToken
        },
        data: newAttendee

      }).then(function(response) {
        console.log('inviteAttendee()response from the server is: ', response);
        var newUserEmail = newAttendee.email;
        var newUserFirstName = newAttendee.firstName;
        var newUserLastName = newAttendee.lastName;
        $http({
          method: 'POST',
          url: '/user/add/',
          headers: {
            id_token: idToken
          },
          params: {
            firstName: newUserFirstName,
            lastName: newUserLastName,
            email: newUserEmail
          }
        }).then(function(response){
          console.log('response from server:',response);
          getAttendees(newAttendee.eventId);

        })
      })
      });

    } else {
      console.log('not logged in or authorized');
    }//end if(firebaseUser)
}//end inviteAttendee()


// function sendInvitationEmail(eventId,attendee){
//   console.log('sendInvitationEmail()called',emailData);
//   var emailBody = 'Hey ' + attendee.firstName + 'you have been invited to a party!' +
//   'Please check out the event details at ' + emailData.eventUrl + 'and bring a few things from the list!';
//   $http({
//     method: 'POST',
//     url: '/event/notify',
//     headers: {
//       id_token: idToken
//     },
//     data: emailBody
//   }).then(function(response){
//     console.log('response from server:',response);
//   }
// }
//


function getThingsForEvent(eventId) {
  console.log('getThingsForEvent(eventId) has been called');
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/event/things/' + eventId,
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        claimedThings.data = response.data; //the response is object with a single array of many objects.  Here is where we unpack that into a regular object
        console.log('DataFactory response for getThingsForEvent is: ',response.data);
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
      eventObject = {};
    }//end if(firebaseUser)
  }// end function getThingsForEvent

function getUnclaimedThingsForEvent(eventId){
  console.log('getUnclaimedThingsForEvent(eventId) has been called');
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/event/unclaimedThings/' + eventId,
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        unclaimedThings.data = response.data; //the response is object with a single array of many objects.  Here is where we unpack that into a regular object
        // console.log('DataFactory response for getUnclaimedThingsForEvent is: ',response.data);

      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
      eventObject = {};
    }//end if(firebaseUser)
}//end getUnclaimedThingsForEvent

function logOut() {
    auth.$signOut().then(function(){
      console.log('Logging out the user, they will no longer be authenticated');
      currentUser = {};
      isLoggedIn =  false;
      $location.url('/#!/login');

    })
} // end logOut()

function claimThing(eventId,thing){
  console.log('DataFactory.claimThing() has been called with the following params',eventId,thing);
  console.log(currentUser.email);
  if(currentUser.details) {
    currentUser.details.getToken().then(function(idToken){
      $http({
        method: "PUT",
        url: "/event/claim",
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId,
          thing: thing,
          claimer: currentUser.details.email
        }
      }).then(function(response) {
        console.log('Response from /event/claim PUT request is: ',response);
      });
    })
  } else {
    console.log('not logged in or authorized');
    eventObject = {};
  }
} // end claimThing()

function unclaimThing(eventId,thing){
  console.log('DataFactory.claimThing() has been called with the following params',eventId,thing);
  console.log(currentUser.email);
  if(currentUser.details) {
    currentUser.details.getToken().then(function(idToken){
      $http({
        method: "PUT",
        url: "/event/unclaim",
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId,
          thing: thing,
        }
      }).then(function(response) {
        console.log('Response from /event/claim PUT request is: ',response);
        getThingsForEvent(eventId);
        getUnclaimedThingsForEvent(eventId);
      });
    })
  } else {
    console.log('not logged in or authorized');
    eventObject = {};
  }
} // end unclaimThing()

function addEvent(eventObject){
    console.log('addEvent() has been called in the factory with this object: ',eventObject);
    if(currentUser.details) {
    currentUser.details.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/event/addEvent/',
          headers: {
            id_token: idToken
          },
          params: {
            eventName: eventObject.eventName,
            date: eventObject.date,
            time: eventObject.time,
            location: eventObject.location,
            organizer: currentUser.details.email,
            things_needed: eventObject.things
          }
        }).then(function(response) {
          console.log('The response from the server is: ', response);
          var newEventId = response.data
          $location.url('/event/' + newEventId);

        });
      })// end http })//end getToken().then()
      } else {
        console.log('not logged in or authorized');
      }//end if(firebaseUser)
  }//end addNew()


function deleteEvent(eventId){
  console.log('deleteEvent() has been called DF: ',eventId);
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'DELETE',
        url: '/event/delete/',
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventId
        }
      }).then(function(response) {
        console.log('The response from the server is: ', response);
        getMyEvents(idToken)
        $location.url('/user/');
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
    }//end if(firebaseUser)
}//end delete()

function updateEventData(eventObject){
  console.log('editEvent() has been called DF: ',eventObject);
  if(currentUser.details) {
  currentUser.details.getToken().then(function(idToken){
      $http({
        method: 'UPDATE',
        url: '/event/update/',
        headers: {
          id_token: idToken
        },
        params: {
          eventId: eventObject._id
        }
      }).then(function(response) {
        console.log('The response from the server is: ', response);
        getMyEvents(idToken)
        $location.url('/user/');
      });
    })// end http })//end getToken().then()
    } else {
      console.log('not logged in or authorized');
    }//end if(firebaseUser)


}//end editEventData()


function addThing(eventId, thing) {
      console.log('addThing() @ DF',eventId,thing);
      if(currentUser.details) {
      currentUser.details.getToken().then(function(idToken){
          $http({
            method: 'PUT',
            url: '/event/addThing/',
            headers: {
              id_token: idToken
            },
            params: {
              eventId: eventId,
              thing: thing
            }
          }).then(function(response) {
            console.log('addThing()response from the server is: ', response);
            getUnclaimedThingsForEvent(eventId);
            getThingsForEvent(eventId);

          });
        })// end http })//end getToken().then()
        } else {
          console.log('not logged in or authorized');
        }//end if(firebaseUser)
    }//end addNew()




return {
    logIn: logIn,
    logOut: logOut,
    userObject: userObject,
    userEvents: userEvents,
    eventObject: eventObject,
    getBasicEventData: getBasicEventData,
    getOrganizers: getOrganizers,
    getAttendees: getAttendees,
    getThingsForEvent: getThingsForEvent,
    getUnclaimedThingsForEvent,
    claimedThings : claimedThings,
    unclaimedThings: unclaimedThings,
    claimThing: claimThing,
    currentUser: currentUser,
    unclaimThing: unclaimThing,
    addEvent: addEvent,
    eventOrganizers: eventOrganizers,
    eventAttendees: eventAttendees,
    deleteEvent: deleteEvent,
    isLoggedIn: isLoggedIn,
    updateEventData: updateEventData,
    addThing: addThing,
    inviteAttendee: inviteAttendee

  } // end factory returns

}]); // end factory
