
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
            content += '<td></tr>';
            
        });
        $(document).ready(function(){
            /* render */
            head = '<thead><tr><th>#</th><th>name</th><th>table</th><th>robot</th></tr></thead>';
            head += content;
            $('#seperate_table').empty();
            $('#seperate_table').append(head);
            
            pub_table = $("td").eq(1).html();       //get table number

            // add a topic 
            var listener = new ROSLIB.Topic({
                ros : ros,
                name : '/listener',
                messageType : 'std_msgs/String'
            });

            //subscribe topic
            listener.subscribe(function(home) {
                console.log('Received message on ' + listener.name + ': ' + home.data);
                
                // if robot back to origin
                if(home.data == "r1" || home.data == "r2"){
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
            });

            // add a topic 
            var order_info = new ROSLIB.Topic({
                ros : ros,
                name : '/order_info',
                messageType : 'std_msgs/String'
            });

            // publish topic 
            var msg = new ROSLIB.Message({
                "table": pub_table
            });
            order_info.publish(msg);
            
        });
    }
});



 
