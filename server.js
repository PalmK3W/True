var app = require('express')();
var http = require('http').createServer(app);
const bodyParser = require("body-parser");
var net = require('net');
let time = 0;
let status = 0;
function Male1(){
    var client = new net.Socket();
    client.connect(9500, '127.0.0.1', function() {
        console.log('Male 15-30');
        client.write('m1');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });
}
function Male2(){
    var client = new net.Socket();
    client.connect(9500, '127.0.0.1', function() {
        console.log('Male >= 31');
        client.write('m2');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });
}
function Female1(){
    var client = new net.Socket();
    client.connect(9500, '127.0.0.1', function() {
        console.log('Female 15-30');
        client.write('f1');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });
}
function Female2(){
    var client = new net.Socket();
    client.connect(9500, '127.0.0.1', function() {
        console.log('Female >=31');
        client.write('f2');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });
}
function VIPtrig(){
    var client = new net.Socket();
    client.connect(9500, '127.0.0.1', function() {
        console.log('VIP');
        client.write('v');
    });
    
    client.on('data', function(data) {
        console.log('Received: ' + data);
        client.destroy(); // kill client after server's response
    });
    
    client.on('close', function() {
        console.log('Connection closed');
    });
}
function CountdownVIP(){
    time++
    console.log(time);
    if (time === 30){
        clearInterval(this);
        time = 0;
        status=0;
        hasReceivedData = false;
    }
}

function Countdown(){
    time++
    console.log(time);
    hasReceivedData = false;
    if(status ===2 ){
        clearInterval(this);

        status=0;
    }
    else{
        if (time === 30){
            clearInterval(this);
            time = 0;
            status=0;
            
        }
    }

}


let hasReceivedData = false;
// Middleware เพื่อตรวจสอบว่ามีการรับข้อมูลครั้งแรกแล้วหรือยัง
const checkFirstRequest = (req, res, next) => {
    if (hasReceivedData) {
      res.status(400).send('Request has been closed. No more data can be received.');
    } else {
      hasReceivedData = true;
      next();
    }
  };
  
// Middleware ที่จะทำการประมวลผลข้อมูล
const processData = (req, res) => {
        
    let x = req.body;
    //console.log(x)
    //let gender = x.features.gender.name;
    let gender = x[0].features.gender.name;
    let matched = x[0].matched;
    let VIP = x[0].matched_lists;
    try{
        console.log(gender,matched,VIP);
    if(matched===true){
        // includes ( id ของ watchlist สามารถใส่ได้หลายค่า)
        if(VIP.includes(4)&&status===2){console.log("block Trigger VIP")}
        else{
            status= 2;
            VIPtrig();
            setInterval(CountdownVIP,1000);
        }
    }
    else{
        if (status===0){
            time = 0;
            if(gender==="male"){
                if(age>=15 && age<=30){
                    status = 1;
                    Male1();
                    setInterval(Countdown,1000);
                }
                else if(age>30){
                    status = 1;
                    Male2();
                    setInterval(Countdown,1000);
                }
                   
               
            }
            else if (gender==="female"){
                if(age>=15 && age<=30){
                    status = 1;
                    Female1();
                    setInterval(Countdown,1000);
                }
                else if(age>30){
                    status = 1;
                    Female2();
                    setInterval(Countdown,1000);
                }
                
            }

        }
        else{
            console.log("block repeat Trigger")
        }
    }    
   
}
catch(error){
    console.log(error);
}
    // res.status(200).end("hey") ; //ตอบกลับรหัส 200 และ res เป็น "hey"
    res.send('Data processed successfully!');
  };
app.use(bodyParser.json());
app.post('/api',checkFirstRequest, processData);
http.listen(4000, () => {
    console.log('go to http://localhost:4000');
  });