const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


var table, num_blacktea, num_milktea, num_sandwich;
var index=0;

exports.seperate = functions.database.ref('/order/{id}')
  .onCreate((snapshot, context) => {
        console.log('********', context.params.id, snapshot.val());
     
        var object = snapshot.val();
        table = object.table;
        num_blacktea = object.meals.blacktea;
        num_milktea = object.meals.milktea;
        num_sandwich = object.meals.sandwich;

        /*console.log('table : ', object.table);
        console.log('meals : ', object.meals);
        console.log('blacktea : ', object.meals.blacktea);
        console.log('milktea : ', object.meals.milktea);
        console.log('sandwich : ', object.meals.sandwich);*/

        //seperate blacktea
        for(var j=0; j<num_blacktea; j++){
            index %= 12;
            snapshot.ref.root.child('seperate').push({"index" : index, "name" : "blacktea", "table" : table});
            index++;
        }  
        //seperate milktea
        for(var j=0; j<num_milktea; j++){
            index %= 12;
            snapshot.ref.root.child('seperate').push({"index" : index, "name" : "milktea", "table" : table});
            index++;
        } 
        //seperate sandwich
        for(var j=0; j<num_sandwich; j++){
            index %= 12;
            snapshot.ref.root.child('seperate').push({"index" : index, "name" : "sandwich", "table" : table});
            index++;
        } 
        
  });