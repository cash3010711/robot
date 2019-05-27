//import { equal } from "assert";

/* set url */ 
/*var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
 });*/

/* if connect then print */ 
/*ros.on('connection', function() {
    console.log('Connected to websocket server.');
});*/

/* add a topic */
/*var order_info = new ROSLIB.Topic({
    ros : ros,
    name : '/order_info',
    messageType : 'std_msgs/String'
 });*/

var index = 0;

var db = firebase.database();
db.ref("/seperate").on('value', function(snapshot){
    if(snapshot.exists()){
        
        /* print data from firebase */ 
        var content = '';      
        snapshot.forEach(function(data){
            var val = data.val();
            //content += '<tr id="t' + bal.index + '">';
            content += '<tr>';
            content += '<th>' + val.index + '</th>';
            content += '<td>' + val.name + '</td>';
            content += '<td>' + val.table + '</td>';
            content += '<td><button type="button" class="done">done</button></tr>';
            //content += '<td><button type="button" id="b' + val.index + '">done</button></tr>';

        });


        $(document).ready(function(){
            head = '<thead><tr><th>#</th><th>name</th><th>table</th><th>state</th></tr></thead>';
            head += content;
            $('#seperate_table').empty();
            $('#seperate_table').append(head);

            console.log($("td").eq(1).html());
            console.log($("th").eq(4).html());
            //document.getElementById('seperate_table').deleteRow(1);
        });

        /* deal with each seperate order */
        $("#seperate_table").on('click','.done',function(){
                var getindex = $(this).closest('tr').find('th').text().trim();
                
                db.ref("/seperate").once('value', function(snap){
                    snap.forEach(function(data){
                        var val = data.val();
                        if(val.index == getindex){
                            var id = data.key;
                            //var index = val.index;  // order index
                            var name = val.name;    // order name
                            var table = val.table;  // table number
                            
                            /* publish topic */
                            /*var msg = new ROSLIB.Message({
                                "index": index,
                                "name": name,
                                "table": table
                            });
                            order_info.publish(msg);*/

                            /* delete firebase seperate */
                            db.ref("/seperate/" + id ).remove();
                            console.log(data.key);
                            console.log(val.index);
                            console.log(val.name);
                            console.log(val.table);

                            /* add to buffer*/
                            snapshot.ref.root.child('buffer').push({"index" : index, "name" : name, "table" : table});
                            index++;
                        }
                    });
                });
                /* delete html tr */
                $(this).closest('tr').remove();
            });


        /* when robot back to original place*/ 
        /*
        $("#bbb").click(function(){
            
            if($("button").eq(0).attr('disabled') == 'disabled'){
                console.log("**if**" + $("button").eq(0).attr('disabled'));
                $("button").eq(0).removeAttr('disabled');
            }
            else if($("button").eq(0).attr('disabled') == undefined){
                console.log("**else**" + $("button").eq(0).attr('disabled'));
                $("button").eq(1).removeAttr('disabled');
            }

        });
        */
    }
});

