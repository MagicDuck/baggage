// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:4000');

// Connection opened
socket.addEventListener('open', function (event) {
    console.log("hi");
    socket.send('Hello Server!');
});

function appendScript(pathToScript) {
    var head = document.getElementsByTagName("head")[0];
    var js = document.createElement("script");
    js.type = "text/javascript";
    js.src = pathToScript;
    head.appendChild(js);
}

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server', event.data, typeof event.data);
    let message = JSON.parse(event.data);
    appendScript(message.path); 
})

window.foo = function() {
for (let i of ["uno", "dos", "tres"]) {
    console.log("yo");
    console.log("foo");
    console.log("xxxy");
    console.log("---iiiij", i);
}
};