const io = require("socket.io-client")
const socket = io("http://localhost:3000", {
	reconnectionDelayMax: 10000,
	// secure: true,
	reconnection: true,
	//   rejectUnauthorized: false,
	//   transports: ['websocket']
});

socket.on("connect",() => {
    console.log("connected");

})

socket.on('notification', notification => {
	console.log('Received notification:', notification);
});

socket.on("disconnect",() => {
    console.log("disconnected user")
})

