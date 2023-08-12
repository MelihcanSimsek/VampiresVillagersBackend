const app = require("express");
const PORT = 3000;
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer,{
    cors:true,
    origin:["*"]
});
const nameDictionary = {};

const addName = (userData) =>{
  nameDictionary[userData.id] = userData.name+"";
  console.log(nameDictionary);
}

const deleteName = (id) =>{
    delete nameDictionary[id];
}




io.on("connection",(socket)=>{
    

    socket.on('disconnect', () => {
        socket.broadcast.emit("joinGame",nameDictionary[socket.id]+" user disconnected from the server");
        deleteName(socket.id);
      });

    socket.on("joinGame",data=>{
        addName({id:socket.id,name:data.name});
        socket.broadcast.emit("joinGame",nameDictionary[socket.id]+" user joined to server");
        
    });
})




httpServer.listen(PORT,()=>{
    console.log("Server started !!!");
})