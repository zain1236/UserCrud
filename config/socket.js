const io = require('socket.io')();


io.on("connection", async function (socket) {
    console.log("user connected")

    socket.on('disconnect', function () {
        console.log("user disconnected");
    });
});



module.exports = {io};