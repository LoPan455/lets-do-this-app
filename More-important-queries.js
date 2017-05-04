db.getCollection('events').find({});



db.events.updateMany(
{},
{ $rename: {"things":"things_needed"}})


db.events.update({},
                          {$set : {"things_claimed":1}},
                          {upsert:false,
                          multi:true})




db.events.update(
            { id_: ObjectId("58d54a8104ea01e8419ab2c8") },
            {
                "$addToSet" : {
                    "things_claimed" : {
                        "name" : "Tacos",
                        "claimedBy" : "tjohander@gmail.com"
                    }
                }
            })


db.events.update({},{$unset: {"new_field":1}},{multi: true});
db.events.update({_id: ObjectId("58d54a8104ea01e8419ab2c8")},
                          {$set : {"things_claimed.name": "Tacos"},"things_claimed.claimedBy": "tjohander@gmail.com"},
                          {upsert:false,
                          multi:false})
db.events.find({
    things_needed : { $elemMatch : { name: "Volleyball Net" } }
    })


use ldt

db.events.find(

    { "things_needed.name": "Volleyball Net"}
    )

db.events.find(

    {"things_needed.name" : "Tacos"}

    )

db.events.find({})

db.events.update(
    {
        _id: ObjectId("58d036d7f10b24d21fa36c35"),
        "things_needed.name" : "Volleyball Net"
     },

     {
         $set:
            {
                "things_needed.$.claimedBy": "tjohander@gmail.com"
            }
        }
        )






// adding things needed to an event

db.events.update(
  { _id: ObjectId("58d11f30f10b24d21fa36c38") },
  {
    $push: {
      things_needed: {
         $each: [ { name: "chips", claimedBy: "" }, { name: "Hats", claimedBy: "" }, { wk: "Wings", claimedBy: "" } ],

      }
    }
  }
)
