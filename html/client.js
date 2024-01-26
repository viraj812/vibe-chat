const socket = io("https://stranger-chat-server.onrender.com/", { transports: ['websocket', 'polling', 'flashsocket'] });

// var p = document.getElementsByClassName("connection_status");

// var btnSend = document.getElementsByClassName("btnSend");

// var btnStartStop = document.getElementsByClassName("btnStartStop");

const waiting_msg = "Waiting for a Stranger to Connect.......";
const disconnected_msg = "Stranger has Vanished";
const connected_msg = "Stranger Connected";


var roomId = null;
var index = 0;

window.addEventListener("scroll", () => {
    document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
    console.log(document.body.style.getPropertyValue('--scroll'));
}, false);

socket.on("connect", () => {

    socket.on("waiting-for-connection", conn => {
        console.log("waiting for a Stranger to connect.......");
        p.innerText = waiting_msg;
    });
    
    socket.on("connection-successful", (id) => {
        console.log("connection done: ", id);
        p.innerText = connected_msg;
        roomId = id;
        btnSend.disabled = false;
    });
    
    socket.on("message-received", (message) => {
        console.log(message)
        var txtBox = document.getElementsByClassName("txtBox");
        var box = document.createElement("div");
        box.className = "receivedChats";
    
        var msg = document.createElement("div");
        msg.className = "msg";
    
        msg.appendChild(document.createTextNode(message));
    
        box.appendChild(msg);
        
        var identity = document.createElement("div");
        identity.className = "identity";
        identity.appendChild(document.createTextNode(stranger));
        box.appendChild(identity);
        
        txtBox.appendChild(box);
        
        txtBox.scrollTop = txtBox.scrollHeight;
    });
    
    socket.on("stranger-disconnected", () => {
        roomId = null;
        p.innerText = disconnected_msg;
        btnStartStop.value = "Start";
        btnSend.disabled = true;
    });
});


function sendMsg() {
    var txtMsg = document.getElementsByClassName("txtInput");
    var validated_msg = String(txtMsg.value);

    if(validated_msg != ""){
        socket.emit("message-sent", validated_msg, roomId);

        var msg_box = document.getElementsByClassName("msg_box");
               
        var msg = document.createElement("MsgComponent");
        msg.type = "sent";
        msg.value = validated_msg;

        msg_box.appendChild(msg);

        txtBox.scrollTop = txtBox.scrollHeight;

        txtMsg.value = "";
    }
}


function startStopConnection(){

    if(btnStartStop.value == "Start"){
        socket.emit("start-connection");
        btnStartStop.value = "Stop";
    }
    else {
        btnStartStop.value = "Start";
        btnSend.disabled = true;
        p.innerText = "Stopped";
        socket.emit("stranger-disconnected");
    }
}



