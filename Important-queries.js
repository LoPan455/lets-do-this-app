db.getCollection('events').find({})



//This will add the organizerName field, with a match between the event.organzier field and grabbing that user document
db.events.aggregate([
   {
       $lookup:
       {   from: "users",
           localField: "organizer",
           foreignField: "email",
           as: "organizer"
       }
   }
   ]);


// Get the basic event info:

db.events.aggregate([
   {
       $match: {_id: ObjectId("58d036d7f10b24d21fa36c35")}
   },
   {
       $project:
       {
           _id: 1,
           eventName: 1,
           date: 1,
           time: 1,
           location: 1
       }
   }
   ])



db.events.aggregate([
   {
       $match: {_id: ObjectId("58d036d7f10b24d21fa36c35")}
   },
   {
       $unwind: "$organizer
   },
   {
       $lookup:
       {
           from: "users",
           localField: "organizer",
           foreignField: "email",
           as: "organizer"

       },
   },
   {
       $project:
        {
           _id: 1,
           firstName: 1,
           date: 1,
           time: 1,
           location: 1
       }
   }
   ])





//lookup stuff
db.events.aggregate([
   {
       $match: {_id: ObjectId("58d036d7f10b24d21fa36c35")}
   },
   {
       $lookup:
         {
            from: "users",
            localField: "organizer",
            foreignField: "email",
            as: "organizer"
         }
     },
   {
      $unwind: "$attendees"
   },
   {
      $lookup:
         {
            from: "users",
            localField: "attendees",
            foreignField: "email",
            as: "attendees_names",


       }
   }
])

db.events.aggregate(  [
   {
       $match: {_id: ObjectId("58d54a8104ea01e8419ab2c8")}
   },
   {
      $lookup:
         {
            from: "users",
            localField: "attendees",
            foreignField: "email",
            as: "attendees_names"
        }

   }

//    //
//    {
//       $unwind: "$attendees"
//    },
//    {
//        $project:
//             {
//                 attendees.firstName: 1,
//                 attendees.lastName: 1,
//                 attendees.phoneNumber: 1,
//                 attendees.smsOptIn: 1
//             }
//     }
] )


db.events.aggregate([
    {
        $match: {_id: ObjectId("58d036d7f10b24d21fa36c35")}
    },
    {
        $unwind: "$things_needed"
    }
    ])



db.events.aggregate(  [
   {
       $match: {_id: "58d54a8104ea01e8419ab2c8"}
   },
   {
       $lookup:
       {
           from: "users",
           localField: "attendees",
           foreignField: "email",
           as: "attendee_info"
       }
   }


] )

db.events.update(
   {eventName: "Taco Time"},

   {
     $push: { attendees: "tacovar2017@gmail.com" }
   }
);

db.getCollection('events').find(
   {
    attendees: "tjohander@gmail.com"
   }
    );




events.insert({
    eventName: "Taco Time",
    date: "2018-05-04",
    time: "12:00",
    location: "Taco Town",
    organizer: "tjohander@gmail.com",
    attendees:["tjohander@gmail.com"],
    things_needed: [ {name:'Tacos', claimedBy:'tjohander@gmail.com'}, {name:'Taco Sauce', claimedBy: ''} ]
});

db.events.updateOne(
   {_id: ObjectId("58d036d7f10b24d21fa36c35") },

   {
     $pull: { attendees: ObjectId("58d11ff3f10b24d21fa36c3a") }
   }
);


///try with the same $lookup aggregate:

db.events.aggregate(  [
   {
       $match:
        {_id: ObjectId("58d54a8104ea01e8419ab2c8")},
        {"things_needed.claimedBy" = ""}

   },
   {
       $lookup:
       {
           from: "users",
           localField: "attendees",
           foreignField: "email",
           as: "attendee_info"
       }
   },

] )


// this will still return a new document for each "thing".  But the lookup works.
db.events.aggregate(
   [
   {
       $match : { _id : ObjectId("58d54a8104ea01e8419ab2c8") }
   },
   {
       $unwind: "$things_needed"
   },
   {
       $lookup:
       {
           "localField" : "things_needed.claimedBy",
           "from" : "users",
           "foreignField" : "email",
           "as" : "things_claimers"
       },
       {   from: "users",
           localField: "organizer",
           foreignField: "_id",
           as: "organizer"
           }
   },
   {
       $unwind: "$things_claimers"
   },
   {
       $project:
       {
           "_id" : 0,
           "name" : "$things_needed.name",
           "claimerFirstName" : "$things_claimers.firstName",
           "claimerLastName" : "$things_claimers.lastName"
           "claimerEmail": "$things_claimers.email"
       }
   }


   ])



db.events.aggregate([
   {
       $match : {"_id": ObjectId("58d54a8104ea01e8419ab2c8")}
   },
   {
       $unwind : "$things_needed"
   },
   {
       $project :
        {
            eventName : 1,
            things_needed : 1
       }
   },
   {
       $lookup :
        {
            from: "users",
            localField: "things_needed.claimedBy",
            foreignField: "email",
            as: "claimer"
        }
   },
   {
       $unwind : "$claimer"
   }
   ]);

db.events.aggregate([
   {
       $match : {_id: ObjectId("58d54a8104ea01e8419ab2c8")}
   },
   {
       $unwind : "$things_needed"
   },
   {
       $lookup:
        {
           from: "users",
           localField: "things_needed.claimedBy",
           foreignField: "email",
           as: "things_claimer"
        }
    }
   ])


db.users.update({},{$unset: {organizerFor:1}},{multi: true});
db.users.find({})
db.events.update(
    {_id: ObjectId("58d54a8104ea01e8419ab2c8"), "things_needed.name" : "Sour Cream"},
    { $set : { "things_needed.$.claimedBy" : "tjohander@gmail.com"  } }
    )





{
    $unwind : "$things_needed"
},
{
    $match : {"things_needed.name" :  "Sour Cream" }
},
{
    $set : { "$things_needed.claimedBy" : "tjohander@gmail.com" }
}
)





db.events.update(
  { _id : ObjectId("58d54a8104ea01e8419ab2c8")  },
  {
    "$push" : {
      "things_needed" : {
        "name" : "Guacamole",
        "claimedBy" : "tjohander@gmail.com"
      }
    }
  }
);


db.events.aggregate([
    {
      $match: {_id: eventId }
    },
    {
      $lookup:
      {
        from: "users",
        localField: "attendees",
        foreignField: "email",
        as: "attendee_info"
      },


    }
  ]
