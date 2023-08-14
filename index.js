const app = require("express");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{
    cors:true,
    origin:["*"]
});

const usersData = {};
const chatMessage = {};

function getNicknamesByGameId(gameId) {
    const nicknames = [];
    
    for (const key in usersData) {
      if (usersData.hasOwnProperty(key) && usersData[key].gameId === gameId) {
        nicknames.push(usersData[key].nickname);
      }
    }
    
    return nicknames;
  }

  function getChatMessageByGameId(gameId) {
    const messages = [];
    
    for (const key in chatMessage) {
      if (chatMessage.hasOwnProperty(key) && chatMessage[key].gameId === gameId) { // Bukooda düzenleme olcak kafam karıştı mk gece gece
        messages.push({userName:usersData[key].nickname,});
      }
    }
    
    return messages;
  }


io.on("connection",(socket)=>{
    
    
    socket.on('disconnect', () => {
        if(usersData[socket.id]){
            const gameId = usersData[socket.id].gameId;
            const name = usersData[socket.id].gameId;
            delete usersData[socket.id];
        socket.broadcast.emit("leaveGame",{
            userName:name,
            gameId:gameId,
            playerList:getNicknamesByGameId(gameId)
        });
        
        console.log("disconnected");
    }   console.log(usersData);
      });

    socket.on("joinGame",data=>{
        usersData[socket.id] = { nickname: data.nickname,gameId:data.gameId };
        socket.broadcast.emit("joinGame",{
            userName:data.nickname+"",
            gameId:data.gameId,
            playerList:getNicknamesByGameId(data.gameId)
        });

        socket.emit('joinGame', {
            userName:data.nickname+"",
            gameId:data.gameId,
            playerList:getNicknamesByGameId(data.gameId)
        });

        console.log("connected")
        console.log(usersData);
    });

    socket.on("chat",data=>{
        chatMessage[data.gameId] = { nickname: data.nickname,message:data.message };
        socket.broadcast.emit("chat",{
            gameId:data.gameId,
            messages:getChatMessageByGameId(data.gameId)
        });

        socket.emit('chat', {
            gameId:data.gameId,
            messages:getChatMessageByGameId(data.gameId)
        });
    })
})





httpServer.listen(PORT,()=>{
    console.log("Server started !!!");
})