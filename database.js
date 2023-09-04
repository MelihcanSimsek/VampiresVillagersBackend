const { Client } = require('pg');

const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "vampirevillager"
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

async function DeletePlayer(id) {
  try {

    const deleteQuery = 'DELETE FROM "Player" WHERE Id=$1';
    const values = [id];

    await client.query(deleteQuery, values);

    console.log('Oyuncu silindi');
  } catch (error) {
    console.error('Hata:', error);
  }
}

async function GetPlayersbyGameId(gameId) {
  try {


    const selectQuery = 'SELECT Id,Name from "Player" WHERE GameId=$1';
    const values = [gameId];

    const result = await client.query(selectQuery, values);
    return result.rows;

  } catch (error) {
    console.error('Hata:', error);
  }
}

async function GetPlayerBySocketId(socketId) {
  try {
    const selectQuery = 'SELECT Id,Name,GameId from "Player" WHERE Id=$1';
    const values = [socketId];

    const result = await client.query(selectQuery, values);
    return result;

  } catch (error) {
    console.error('Hata:', error);
  }
}

//Chat Table
async function AddChat(name, gameId, message) {

  try {
    const currentTime = new Date();

    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const second = currentTime.getSeconds();

    const formattedTime = `${hour}:${minute}:${second}`;

    const insertQuery = 'INSERT INTO "Chat" (Id,Name,GameId,Message,CreationDate ) VALUES (DEFAULT, $1,$2, $3,$4)';
    const values = [name, gameId, message, formattedTime];
    await client.query(insertQuery, values);
  } catch (error) {
    console.error('Hata:', error);
  }
}

async function DeleteChat(gameId) {
  try {
    const deleteQuery = 'DELETE FROM "Chat" WHERE GameId=$1';
    const values = [gameId];
    await client.query(deleteQuery, values);
  } catch (error) {
    console.error('Hata:', error);
  }

}

async function GetChatMessagebyGameId(gameId) {
  try {
    const selectQuery = 'SELECT Name,Message FROM "Chat" WHERE GameId = $1';
    const values = [gameId];
    const result = await client.query(selectQuery, values);
    return result;
  } catch (error) {
    console.error('Hata:', error);
  }
}

//Game Table

async function AddGame(gameId, gameSettings) {
  try {
    const insertQuery = 'INSERT INTO "Game" (Id,DayTime,NightTime,VampireNumber,PriestNumber,Day ) VALUES ($1,$2,$3,$4,$5,1)';
    const values = [gameId, gameSettings.dayTime, gameSettings.nightTime, gameSettings.vampireNumber, gameSettings.priestNumber];
    await client.query(insertQuery, values);

  } catch (error) {
    console.error('Hata:', error);
  }
}


async function GetGame(gameId) {
  try {
    const selectQuery = 'SELECT * FROM "Game" WHERE Id = $1';
    const values = [gameId];
    const result = await client.query(selectQuery, values);
    return result;

  } catch (error) {
    console.error('Hata:', error)
  }
}

async function DeleteGame(gameId) {
  try {
    const deleteQuery = 'DELETE FROM "Game" WHERE Id=$1';
    const values = [gameId];
    await client.query(deleteQuery, values);
  } catch (error) {
    console.error('Hata:', error);
  }
}
//ROLE Table Villager role 1, Vampire role 2, Priest role 3,
async function AddRole(gameId,playerListWithRole)
{
  try {
     await  playerListWithRole.forEach(player => {
      const insertQuery = 'INSERT INTO "GameState" (Id,Name,GameId,Role,Live) VALUES ($1,$2,$3,$4,$5)';
      const values = [player.id, player.name, gameId, player.role,true];
      client.query(insertQuery, values);
    });
   
  } catch (error) {
    console.error('Hata:', error);
  }
}



async function GetPlayersRoleByGameId(gameId)
{
  try {
    const selectQuery = 'SELECT id,name,role,live FROM "GameState" WHERE GameId = $1';
    const values = [gameId];
    const result = await client.query(selectQuery, values);
    return result;
  } catch (error) {
    console.error('Hata:', error)
  }
}

async function GetPlayerRoleBySocketId(id)
{
  try {
    const selectQuery = 'SELECT id,name,role,live FROM "GameState" WHERE Id = $1';
    const values = [id];
    const result = await client.query(selectQuery, values);
    return result;
  } catch (error) {
    console.error('Hata:', error)
  }
}

async function DeleteRole(gameId)
{
  try {
    const deleteQuery = 'DELETE FROM "GameState" WHERE GameId=$1';
    const values = [gameId];
    await client.query(deleteQuery, values);

  } catch (error) {
    console.error('Hata:', error);
  }
}

//VOTE Table
// playerId:string;
//     targetId:string;
//     day:number;
//     dayType:Boolean;
//     gameId:string;
async function AddVote(vote)
{
  try {
      
   const insertQuery = 'INSERT INTO "Vote" (Id,PlayerId,TargetId,Day,DayType,GameId) VALUES (DEFAULT,$1,$2,$3,$4,$5)';
   const values = [vote.playerId, vote.targetId, vote.day, vote.dayType,vote.gameId];
   await client.query(insertQuery, values);
  
 } catch (error) {
   console.error('Hata:', error);
 }
}

async function DeleteVote(gameId)
{
  try {
    const deleteQuery = 'DELETE FROM "Vote" WHERE GameId=$1';
    const values = [gameId];
    await client.query(deleteQuery, values);

  } catch (error) {
    console.error('Hata:', error);
  }
}

async function GetAllVote(vote)
{
  try {
    const selectQuery = 'SELECT playerid,targetid FROM "Vote" WHERE GameId = $1 AND Day=$2 AND DayType=$3';
    const values = [vote.gameId,vote.day,vote.dayType];
    const result = await client.query(selectQuery, values);
    return result;
  } catch (error) {
    console.error('Hata:', error)
  }
}

async function GetVote(vote)
{
  try {
    const selectQuery = 'SELECT * FROM "Vote" WHERE GameId = $1 AND Day=$2 AND DayType=$3 AND PlayerId=$4';
    const values = [vote.gameId,vote.day,vote.dayType,vote.playerId];
    const result = await client.query(selectQuery, values);
    return result;
  } catch (error) {
    console.error('Hata:', error)
  }
}

async function UpdateVote(vote)
{
  try {
    const updateQuery = 'UPDATE  "Vote" SET TargetId=$1 WHERE GameId = $2 AND Day=$3 AND DayType=$4 AND PlayerId=$5'
    const values = [vote.targetId,vote.gameId,vote.day,vote.dayType,vote.playerId];
    await client.query(updateQuery, values);
   
  } catch (error) {
    console.error('Hata:', error);
  }
}


module.exports = {
  AddPlayer: AddPlayer,
  DeletePlayer: DeletePlayer,
  GetPlayersbyGameId: GetPlayersbyGameId,
  GetPlayerBySocketId: GetPlayerBySocketId,
  AddChat: AddChat,
  DeleteChat: DeleteChat,
  GetChatMessagebyGameId: GetChatMessagebyGameId,
  DeleteGame: DeleteGame,
  AddGame: AddGame,
  GetGame: GetGame,
  AddRole:AddRole,
  DeleteRole:DeleteRole,
  GetPlayerRoleBySocketId:GetPlayerRoleBySocketId,
  GetPlayersRoleByGameId:GetPlayersRoleByGameId,
  AddVote:AddVote,
  DeleteVote:DeleteVote,
  GetAllVote:GetAllVote,
  UpdateVote:UpdateVote,
  GetVote:GetVote
};