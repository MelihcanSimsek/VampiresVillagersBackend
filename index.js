const game = require("./game");
const db = require("./database.js");
const app = require("express");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: true,
  origin: ["*"]
});









io.on("connection", (socket) => {


  socket.on('disconnect', () => {

    db.GetPlayerBySocketId(socket.id).then(player => {
      db.DeletePlayer(socket.id).then(() => {
        db.GetPlayersbyGameId(player.rows[0].gameid).then(players => {


          socket.broadcast.emit("leaveGame", {
            userName: player.rows[0].name,
            gameId: player.rows[0].gameid,
            playerList: players
          })
        })

      })
    });
  }
  );

  socket.on("joinGame", data => {
    db.AddPlayer(socket.id, data.nickname, data.gameId).then(() => {
      db.GetPlayersbyGameId(data.gameId).then(players => {
        db.GetChatMessagebyGameId(data.gameId).then(messages => {
          socket.broadcast.emit("joinGame", {
            userName: data.nickname + "",
            gameId: data.gameId,
            playerList: players
          });

          socket.emit('joinGame', {
            userName: data.nickname + "",
            gameId: data.gameId,
            playerList: players
          });

          socket.emit('chat', {
            gameId: data.gameId,
            messages: messages.rows
          });
          io.to(socket.id).emit('id', socket.id);
        })
      })
    })
  });

  socket.on("chat", data => {
    db.GetPlayerBySocketId(socket.id).then(player => {

      db.AddChat(player.rows[0].name, player.rows[0].gameid, data.message).then(() => {

        db.GetChatMessagebyGameId(player.rows[0].gameid).then(messages => {

          socket.broadcast.emit("chat", {
            gameId: player.rows[0].gameid,
            messages: messages.rows
          });

          socket.emit('chat', {
            gameId: player.rows[0].gameid,
            messages: messages.rows
          });

        }, error => {
          console.log(error);
        })


      })
    })
  })

  socket.on("startGame", data => {
    db.GetPlayersbyGameId(data.gameId).then(players => {
      db.AddGame(data.gameId,data.gameSettings).then(()=>{
        db.AddRole(data.gameId,game.AssignRole(players, data.gameSettings)).then(()=>{
          db.GetPlayersRoleByGameId(data.gameId).then(playerListWithRole=>{
            playerListWithRole.rows.forEach(element => {
              io.to(element.id).emit('role', element.role);
            });
            socket.broadcast.emit("startGame", {
              gameId: data.gameId,
              playerList: playerListWithRole.rows,
              gameSettings:data.gameSettings,
              day:1
            })
            socket.emit("startGame", {
              gameId: data.gameId,
              playerList: playerListWithRole.rows,
              gameSettings:data.gameSettings,
              day:1
            })
          })
        })
      })
      })
    })

    socket.on("vote",data=>{
      db.GetVote(data).then(voteResponse=>{
        if(voteResponse.rows.length <= 0 )
        {
          db.AddVote(data).then(()=>{
          db.GetAllVote(data).then(votes=>{
            socket.broadcast.emit("vote",{
              gameId:data.gameId,
              votes:votes.rows
            });

            socket.emit("vote",{
              gameId:data.gameId,
              votes:votes.rows
            });
          })

          })
        }
        else
        {
          db.UpdateVote(data).then(()=>{

          })
        }
      })
    })

    // Gündüz Oylaması ve Geceye Dönüş
    socket.on("day",data=>{
      db.GetAllVote(data).then(votes=>{
        const victim = game.GetDayTimeHangedPlayer(votes.rows);
        if(victim != " ")
        {
          db.ChangePlayerLiveState(victim).then(()=>{
            db.GetPlayersRoleByGameId(data.gameId).then(playersWithRole=>{
              db.GetPlayerRoleBySocketId(victim).then(victimPlayer=>{
                const isGameEnded = game.CheckGameIsEndingForDayTime(playersWithRole.rows);
                socket.broadcast.emit("day",{
                  gameId:data.gameId,
                  victim:victimPlayer.rows[0],
                  players:playersWithRole.rows,
                  game:isGameEnded,
                  dayType:!data.dayType,
                  day:data.day
                });

                socket.emit("day",{
                  gameId:data.gameId,
                  victim:victimPlayer.rows[0],
                  players:playersWithRole.rows,
                  game:isGameEnded,
                  dayType:!data.dayType,
                  day:data.day
                });

              })
            })

          })
        }
        else{
          socket.broadcast.emit("day",{
            gameId:data.gameId,
            victim:null,
            players:null,
            game:{gameover:false,winner:3},
            dayType:!data.dayType,
            day:data.day
          })

          socket.emit("day",{
            gameId:data.gameId,
            victim:null,
            players:null,
            game:{gameover:false,winner:3},
            dayType:!data.dayType,
            day:data.day
          })
        }

      })

    })

    // Gece Oylaması ve Gündüze Dönüş
    socket.on("night",data=>{
      
    })

  })





httpServer.listen(PORT, () => {
  console.log("Server started !!!");
})