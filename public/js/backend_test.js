
/* set url */ 
var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
 });

/* if connect then print */ 
ros.on('connection', function() {
    console.log('Connected to websocket server.');
});

/* add a topic */
var order_info = new ROSLIB.Topic({
    ros : ros,
    name : '/order_info',
    messageType : 'std_msgs/String'
 });



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
            content += '<td><button type="button" class="done" disabled="disabled">done</button></tr>';
            //content += '<td><button type="button" id="b' + val.index + '">done</button></tr>';

        });


        $(document).ready(function(){
            /* render */
            head = '<thead><tr><th>#</th><th>name</th><th>table</th><th>state</th></tr></thead>';
            head += content;
            $('#seperate_table').empty();
            $('#seperate_table').append(head);

            /* deal with each seperate order */
            $("#seperate_table").on('click','.done',function(){
                var getindex = $(this).closest('tr').find('th').text().trim();
                
                db.ref("/seperate").once('value', function(snap){
                    snap.forEach(function(data){
                        var val = data.val();
                        if(val.index == getindex){
                            var id = data.key;
                            var index = val.index;  // order index
                            var name = val.name;    // order name
                            var table = val.table;  // table number
                            
                            /* publish topic */
                            var msg = new ROSLIB.Message({
                                "index": index,
                                "name": name,
                                "table": table
                            });
                            order_info.publish(msg);

                            /* delete firebase seperate */
                            db.ref("/seperate/" + id ).remove()
                            console.log("id = " + data.key);
                            console.log("index" + val.index);
                            console.log("name" + val.name);
                            console.log("table" + val.table);
                        }
                    });
                });

                /* delete html tr */
                $(this).closest('tr').remove();
            });

            /* listen topic */
            var listener = new ROSLIB.Topic({
                ros : ros,
                name : '/listener',
                messageType : 'std_msgs/String'
              });
              
            listener.subscribe(function(home) {
                console.log(home.data);
                if(home.data == "r1" || home.data == "r2"){
                    if($("button").eq(0).attr('disabled') == undefined){
                        $("button").eq(1).removeAttr('disabled');
                    }
                    $("button").eq(0).removeAttr('disabled');
                }
                listener.unsubscribe();
            });



        });
        
    }
});

