// load
var select_id=0;
var total = 0;

var menu_table_id = document.getElementById("menu_table");
var blacktea_price, milktea_price, greentea_price;
var db = firebase.database();


db.ref("/menu").once('value', function(snapshot){
    if(snapshot.exists()){
        var content = '';           
        snapshot.forEach(function(data){
            var val = data.val();

            content += '<tr>';
            content += '<td><img src="' + val.image + '" height="50" width="50"></td>';
            content += '<td>' + val.name + '</td>';
            content += '<td>' + val.price + '</td>';

            content += '<td><select class="sss" id="select' + select_id +'">' ;
            for(var i=0;i<11;i++){
              content += '<option value="' + i + '">' + i + '</option>';
            }
            content += '</select></td>';
            
            content += '</tr>';
            select_id++;
        });
        $('#menu_table').append(content);

        $(document).ready(function(){
            $("#select0").change(function(){
                blacktea_price = menu_table_id.rows[1].cells[2].innerHTML;
                milktea_price = menu_table_id.rows[2].cells[2].innerHTML;
                greentea_price = menu_table_id.rows[3].cells[2].innerHTML;

                total = blacktea_price*document.getElementById("select0").value + 
                        milktea_price*document.getElementById("select1").value + 
                        greentea_price*document.getElementById("select2").value;
                //$('#total_price').append(total);
                document.getElementById("total_price").innerHTML = total;
            });
            $("#select1").change(function(){
                blacktea_price = menu_table_id.rows[1].cells[2].innerHTML;
                milktea_price = menu_table_id.rows[2].cells[2].innerHTML;
                greentea_price = menu_table_id.rows[3].cells[2].innerHTML;
            
                total = blacktea_price*document.getElementById("select0").value + 
                        milktea_price*document.getElementById("select1").value + 
                        greentea_price*document.getElementById("select2").value;
                document.getElementById("total_price").innerHTML = total;
            });
            $("#select2").change(function(){
                blacktea_price = menu_table_id.rows[1].cells[2].innerHTML;
                milktea_price = menu_table_id.rows[2].cells[2].innerHTML;
                greentea_price = menu_table_id.rows[3].cells[2].innerHTML;

                total = blacktea_price*document.getElementById("select0").value + 
                        milktea_price*document.getElementById("select1").value + 
                        greentea_price*document.getElementById("select2").value;
                document.getElementById("total_price").innerHTML = total;
            });
        });
        
    }
});

function send(theform){
    var table = document.getElementById("table_number").value;
    var price = document.getElementById("total_price").innerHTML;
    var amount_blacktea = document.getElementById("select0").value;
    var amount_greentea = document.getElementById("select1").value;
    var amount_milktea = document.getElementById("select2").value;
    
    var data = {
        "table": table,
        "price": price,
        "meals": {
            "blacktea": amount_blacktea,
            "milktea": amount_milktea,
            "greentea": amount_greentea
        }
    }
    //db.ref("/order").set(data);
    db.ref("/order").push(data);
    //刷新頁面 暫無功能
    window.location.replace(location.href);
}
