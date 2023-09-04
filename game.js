function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Değerleri swap işlemi ile değiştiriyoruz
    }
    return array;
}

function AssignRole(playerList, gameSettings) {
    const selectedPlayerNumber =
        gameSettings.vampireNumber + gameSettings.priestNumber;
    if (selectedPlayerNumber > playerList.length) {
        return [];
    }

    const shufflePlayerList = shuffleArray(playerList);
    const playerListWithRole = [];
    let selectedIndex = 0;
    // Villager id 1 ; Vampire id 2; Priest id 3
    for (let i = 0; i < gameSettings.vampireNumber; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[selectedIndex].id,
            name: shufflePlayerList[selectedIndex].name,
            role: 2,
        });
        selectedIndex++;
    }

    for (let i = 0; i < gameSettings.priestNumber; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[selectedIndex].id,
            name: shufflePlayerList[selectedIndex].name,
            role: 3,
        });
        selectedIndex++;
    }
    for (let i = selectedIndex; i < shufflePlayerList.length; i++) {
        playerListWithRole.push({
            id: shufflePlayerList[i].id,
            name: shufflePlayerList[i].name,
            role: 1,
        });
    }

    return playerListWithRole;
}

module.exports = {
    AssignRole: AssignRole,
};
