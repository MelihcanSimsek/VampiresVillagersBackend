const app = require("express");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{
    cors:true,
    origin:["*"]
});

const usersData = {};


io.on("connection",(socket)=>{
    
    
    socket.on('disconnect', () => {
        if(usersData[socket.id]){
        socket.broadcast.emit("leaveGame",{
            userName:usersData[socket.id].nickname,
            gameId:usersData[socket.id].gameId
        });
        console.log("Önce");
        console.log(usersData);
        delete usersData[socket.id];
        console.log("Sonra");
        console.log(usersData);
    }
      });

    socket.on("joinGame",data=>{
        usersData[socket.id] = { nickname: data.nickname,gameId:data.gameId };
        socket.broadcast.emit("joinGame",{
            userName:data.nickname+"",
            gameId:data.gameId
        });
    });
})





httpServer.listen(PORT,()=>{
    console.log("Server started !!!");
})