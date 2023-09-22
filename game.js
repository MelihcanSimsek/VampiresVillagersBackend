function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Değerleri swap işlemi ile değiştiriyoruz
    }
    return array;
}

function GetUserClass(status)
{
    const ratio = Math.random() <= 0.20 ? true : false;
    if(ratio)
    {
        if(status == 1)
        {
            let role = Math.random() < 0.5 ? 6 : 7;
            return {role:role,skill:1};
        }
        else if(status == 2)
        {
            return {role:6,skill:1};
        }
        else{
            return {role:7,skill:1};
        }
    }
    else{
        return {role:2,skill:0};
    }
   
}

function AssignRole(playerList, gameSettings) {
    const selectedPlayerNumber =  gameSettings.vampireNumber + gameSettings.priestNumber + gameSettings.witchNumber + gameSettings.vampireHunterNumber;
    if (selectedPlayerNumber > playerList.length) {
        return [];
    }

    const shufflePlayerList = shuffleArray(playerList);
    const playerListWithRole = [];
    let selectedIndex = 0;
    /* 
    Villager 1,
    Vampire 2,
    Priest 3,
    Witch 4,
    VampireHunter 5,
    Shapeshifter 6,
    Transforming 7,
    */
    for (let i = 0; i < gameSettings.vampireNumber; i++) {
        
        if(gameSettings.shapeshifterVampire && gameSettings.transformingVampire)
        {
            const vampireClass = GetUserClass(1);
            playerListWithRole.push({
                id: shufflePlayerList[selectedIndex].id,
                name: shufflePlayerList[selectedIndex].name,
                role: vampireClass.role,
                skill:vampireClass.skill
            });
        }
        else if(gameSettings.shapeshifterVampire)
        {
            const vampireClass = GetUserClass(2);
            playerListWithRole.push({
                id: shufflePlayerList[selectedIndex].id,
                name: shufflePlayerList[selectedIndex].name,
                role:vampireClass.role ,
                skill:vampireClass.skill
            });
        }
        else if(gameSettings.transformingVampire)
        {
            const vampireClass = GetUserClass(3);
            playerListWithRole.push({
                id: shufflePlayerList[selectedIndex].id,
                name: shufflePlayerList[selectedIndex].name,
                role:vampireClass.role,
                skill:vampireClass.skill
            });
        }
        else{
            playerListWithRole.push({
                id: shufflePlayerList[selectedIndex].id,
                name: shufflePlayerList[selectedIndex].name,
                role: 2,
                skill:0
            });
        }

        selectedIndex++;
    }

    for (let i = 0; i < gameSettings.priestNumber; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[selectedIndex].id,
            name: shufflePlayerList[selectedIndex].name,
            role: 3,
            skill:3
        });
        selectedIndex++;
    }

    for (let i = 0; i < gameSettings.witchNumber; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[selectedIndex].id,
            name: shufflePlayerList[selectedIndex].name,
            role: 4,
            skill:3
        });
        selectedIndex++;
    }

    for (let i = 0; i < gameSettings.vampireHunterNumber; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[selectedIndex].id,
            name: shufflePlayerList[selectedIndex].name,
            role: 5,
            skill:1
        });
        selectedIndex++;
    }


    for (let i = selectedIndex; i < shufflePlayerList.length; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[i].id,
            name: shufflePlayerList[i].name,
            role: 1,
            skill:0
        });
    }

    return playerListWithRole;
}

function GetDayTimeHangedPlayer(votes)
{
    const repeatTargetNumber = {};
    let mostRepeatTarget = "";
    let mostRepeat = 0;
    votes.forEach(vote => {
        const targetid = vote.targetid;
        if(repeatTargetNumber[targetid])
        {
            repeatTargetNumber[targetid]++;
        }
        else
        {
            repeatTargetNumber[targetid] = 1;
        }
    });

    for (const targetid in repeatTargetNumber) {
        if (repeatTargetNumber[targetid] > mostRepeat) {
          mostRepeat = repeatTargetNumber[targetid];
          mostRepeatTarget = targetid;
        }
      }
      return mostRepeatTarget;
}


//2 6 7 vampir rolü
function CheckGameIsEndingForDayTime(players) {
    let vampireNumber = 0;
    let villagerNumber = 0;

    for (const player of players) {
        if ((player.role === 2 || player.role === 6 || player.role === 7) && player.live) {
            vampireNumber++;
        }

        if ((player.role === 1 || player.role === 3 || player.role === 4 || player.role === 5) && player.live) {
            villagerNumber++;
        }
    }

    console.log("vampir number == "+vampireNumber);
    console.log("Villager number == "+villagerNumber);
    if (vampireNumber === 0) {
        return { gameover: true, winner: 1 };
    } else if (vampireNumber >= villagerNumber) {
        return { gameover: true, winner: 2 };
    } else {
        return { gameover: false, winner: 3 };
    }
}

function CheckGameIsEndingForNightTime()
{

}

module.exports = {
    AssignRole: AssignRole,
    GetDayTimeHangedPlayer:GetDayTimeHangedPlayer,
    CheckGameIsEndingForDayTime:CheckGameIsEndingForDayTime,
    CheckGameIsEndingForNightTime:CheckGameIsEndingForNightTime
};
