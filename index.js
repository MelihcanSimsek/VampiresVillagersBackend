const  game  = require("./game");
const db = require("./database.js");
const app = require("express");
const { AssignRole } = require("./game");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{
    cors:true,
    origin:["*"]
});

const usersData = {};
const chatMessage = [];



  function getPlayerListByGameId(gameId) {
    const playerList = [];
    
    for (const key in usersData) {
      if (usersData.hasOwnProperty(key) && usersData[key].gameId === gameId) {
        playerList.push({userName:usersData[key].nickname,id:key});
      }
    }
    
    return playerList;
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
        
           db.GetPlayerBySocketId(socket.id).then(player=>{
            db.DeletePlayer(socket.id).then(()=>{
              db.GetPlayersbyGameId(player.rows[0].gameid).then(players=>{

                
                socket.broadcast.emit("leaveGame",{
                  userName:player.rows[0].name,
                  gameId:player.rows[0].gameid,
                  playerList:players
             })
              })

            })
        });
        
        console.log("disconnected");
    }  
      );

    socket.on("joinGame",data=>{
        db.AddPlayer(socket.id,data.nickname,data.gameId).then(()=>{
        db.GetPlayersbyGameId(data.gameId).then(players=>{
          db.GetChatMessagebyGameId(data.gameId).then(messages =>{
            console.log("index");
            console.log(messages.rows);
            socket.broadcast.emit("joinGame",{
              userName:data.nickname+"",
              gameId:data.gameId,
              playerList:players
          });
  
          socket.emit('joinGame', {
              userName:data.nickname+"",
              gameId:data.gameId,
              playerList:players
          });
  
          socket.emit('chat', {
            gameId:data.gameId,
            messages:messages.rows
        });
        io.to(socket.id).emit('id',socket.id);
          })
        })
        })
    });

    socket.on("chat",data=>{
      db.GetPlayerBySocketId(socket.id).then(player=>{
        console.log(socket.id)
        console.log(player.rows[0].name+" "+player.rows[0].gameid,+" "+data.message);
        
        db.AddChat(player.rows[0].name,player.rows[0].gameid,data.message).then(()=>{
          
          db.GetChatMessagebyGameId(player.rows[0].gameid).then(messages=>{
            console.log(messages.rows);
            
            socket.broadcast.emit("chat",{
                gameId:player.rows[0].gameid,
                messages:messages.rows
            });
           
            socket.emit('chat', {
                gameId:player.rows[0].gameid,
                messages:messages.rows
            });
  
          },error=>{
            console.log(error);
          })


        })
      })
      
    

    })

    socket.on("startGame",data=>{
      db.GetPlayersbyGameId(data.gameId).then(players=>{

        const playerListWithRole = game.AssignRole(players,data.gameSettings);
        console.log(playerListWithRole);
        playerListWithRole.forEach(element => {
          io.to(element.id).emit('role',element.role);
        });
        
  
        socket.broadcast.emit("startGame",{
          gameId:data.gameId,
          playerList:playerListWithRole
        })
  
        socket.emit("startGame",{
          gameId:data.gameId,
          playerList:playerListWithRole
        })

      })
    
    })
})





httpServer.listen(PORT,()=>{
    console.log("Server started !!!");
})