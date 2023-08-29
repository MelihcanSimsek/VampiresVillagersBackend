const {Client} = require('pg');

const client = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"password",
    database:"vampirevillager"
})

client.connect();


//PLAYER TABLE
async function AddPlayer(id, name, gameId) {
    try {
    
  
      const insertQuery = 'INSERT INTO "Player" (Id, Name, GameId) VALUES ($1, $2, $3)';
      const values = [id, name, gameId];
  
      await client.query(insertQuery, values);
  
      console.log('Oyuncu eklendi');
    } catch (error) {
      console.error('Hata:', error); 
    } 
  }

  async function DeletePlayer(id)
  {
    try {
    
        const deleteQuery = 'DELETE FROM "Player" WHERE Id=$1';
        const values = [id];
    
        await client.query(deleteQuery, values);
    
        console.log('Oyuncu silindi');
      } catch (error) {
        console.error('Hata:', error);
      }
  }

  async function GetPlayersbyGameId(gameId)
  {
    try {
    
    
        const selectQuery = 'SELECT Id,Name from "Player" WHERE GameId=$1';
        const values = [gameId];
    
        const result = await client.query(selectQuery, values);
        return result.rows;
        
      } catch (error) {
        console.error('Hata:', error);
      } 
  }

  async function GetPlayerBySocketId(socketId)
  {
    try{
      const selectQuery = 'SELECT Id,Name,GameId from "Player" WHERE Id=$1';
      const values = [socketId];
     
      const result = await client.query(selectQuery, values);
      return result;

    }catch(error)
    {
      console.error('Hata:', error);
    }
  }

  //Chat Table
  async function AddChat(name,gameId,message)
  {
    
    try{
      const currentTime = new Date();
      
      const hour = currentTime.getHours();
      const minute = currentTime.getMinutes();
      const second = currentTime.getSeconds();

      const formattedTime = `${hour}:${minute}:${second}`;

      const insertQuery = 'INSERT INTO "Chat" (Id,Name,GameId,Message,CreationDate ) VALUES (DEFAULT, $1,$2, $3,$4)';
      const values = [name, gameId, message,formattedTime];
      await client.query(insertQuery, values);
    }catch(error)
    {
      console.error('Hata:', error);
    }
  }

  async function DeleteChat(gameId)
  {
    try{
      const deleteQuery = 'DELETE FROM "Chat" WHERE GameId=$1';
      const values = [gameId];
      await client.query(deleteQuery, values);
    }catch(error)
    {
      console.error('Hata:', error);
    }

  }

  async function GetChatMessagebyGameId(gameId)
  {
    try{
     const selectQuery = 'SELECT Name,Message FROM "Chat" WHERE GameId = $1';
     const values = [gameId];
     const result =  await client.query(selectQuery, values);
     return result;
    }catch(error)
    {
      console.error('Hata:', error);
    }
  }




  module.exports = {
    AddPlayer:AddPlayer,
    DeletePlayer:DeletePlayer,
    GetPlayersbyGameId:GetPlayersbyGameId,
    GetPlayerBySocketId:GetPlayerBySocketId,
    AddChat:AddChat,
    DeleteChat:DeleteChat,
    GetChatMessagebyGameId:GetChatMessagebyGameId
  };