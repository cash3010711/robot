// set url 
var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
 });

// if connect then print 
ros.on('connection', function() {
    console.log('Connected to websocket server.');
});
// if error then print  
ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
});
// if close then print 
ros.on('close', function() {
    console.log('Connection to websocket server closed.');
});

var first_index, pub_table;
var agvflag1 = 1, agvflag2 = 1;

var db = firebase.database();
db.ref("/buffer").on('value', function(snapshot){
    if(snapshot.exists()){
         
        /* print data from firebase */ 
        var content = '';      
        snapshot.forEach(function(data){
            var val = data.val();
            content += '<tr>';
            content += '<th>' + val.index + '</th>';
            content += '<td>' + val.name + '</td>';
            content += '<td>' + val.table + '</td>';
            content += '<td><button type="button" class="done"">done</button></tr>';
            //content += '<td></tr>';
            
        });
        $(document).ready(function(){
            /* render */
            head = '<thead><tr><th>#</th><th>name</th><th>table</th><th>send</th></tr></thead>';
            head += content;
            $('#buffer_table').empty();
            $('#buffer_table').append(head);
            
            //pub_table = $("td").eq(1).html();       //get table number

            /*
            //subscribe topic
            listener.subscribe(function(home) {
                console.log('Received message on ' + listener.name + ': ' + home.data);
                
                // if robot back to origin
                if(home.data == "r1"){
                    // delete first row
                    first_index = $("th").eq(4).html();       // get first index
                    snapshot.forEach(function(data){
                        var val = data.val();
                        if(val.index == first_index){
                            var id = data.key;
                            db.ref("/buffer/" + id ).remove();  
                        }
                    });
                }

                listener.unsubscribe();
            });*/

            // add a topic 
            var listener1 = new ROSLIB.Topic({
                ros : ros,
                name : '/listener1',
                messageType : 'std_msgs/String'
            });
            
            listener1.subscribe(function(home) {
                console.log('Received message on ' + listener1.name + ': ' + home.data);
                agvflag1 = 1;
                listener1.unsubscribe();
            });

            var listener2 = new ROSLIB.Topic({
                ros : ros,
                name : '/listener2',
                messageType : 'std_msgs/String'
            });
            
            listener2.subscribe(function(home) {
                console.log('Received message on ' + listener2.name + ': ' + home.data);
                agvflag2 = 1;
                listener2.unsubscribe();
            });
        });

        
        

        var order_info1 = new ROSLIB.Topic({
            ros : ros,
            name : '/order_info1',
            messageType : 'std_msgs/String'
        });

        var order_info2 = new ROSLIB.Topic({
            ros : ros,
            name : '/order_info2',
            messageType : 'std_msgs/String'
        });

        $("#buffer_table").on('click','.done',function(){
            var getindex = $(this).closest('tr').find('th').text().trim();
            
            db.ref("/buffer").once('value', function(snap){
                snap.forEach(function(data){
                    var val = data.val();
                    if(val.index == getindex){
                        var id = data.key;
                        var table = val.table;

                        if(agvflag1 == 1){   // agv1 is idle
                            /* publish topic */
                            var msg1 = new ROSLIB.Message({data: table});
                            console.log(msg1);
                            order_info1.publish(msg1);
                            agvflag1 = 0;   // agv1 is busy
                            console.log("agv1");
                            /* delete firebase seperate */
                            db.ref("/buffer/" + id ).remove();
                            /* delete html tr */
                            $(this).closest('tr').remove();
                        }
                        else if(agvflag1 == 0 && agvflag2 == 1){    // agv1 is busy && agv2 is idle
                            /* publish topic */
                            var msg2 = new ROSLIB.Message({data: table});
                            console.log(msg2);
                            order_info2.publish(msg2);
                            agvflag2 = 0;   // agv2 is busy
                            console.log("agv2");
                            /* delete firebase seperate */
                            db.ref("/buffer/" + id ).remove();
                            /* delete html tr */
                            $(this).closest('tr').remove();
                        }

                        
                    }
                });
            });
            
        });

        
    }
});



 
