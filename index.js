const app = require("express");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{
    cors:true,
    origin:["*"]
});

const usersData = {};
const chatMessage = [];

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
    
    for (const message of chatMessage) {
      if (message.gameId === gameId) {
        messages.push({ userName: message.nickname, message: message.message });
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

        socket.emit('chat', {
          gameId:data.gameId,
          messages:getChatMessageByGameId(data.gameId)
      });

        console.log("connected")
        console.log(usersData);
    });

    socket.on("chat",data=>{
        chatMessage.push({ nickname: data.nickname,message:data.message,gameId:data.gameId}) ;
        console.log(getChatMessageByGameId(data.gameId));
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