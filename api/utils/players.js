class Players {
    constructor () {
        this.players = [];
    }

    addPlayer(playerId, playerData, room) {

        if(!room) return { error: 'Game PIN are required.' };
      
        const name = playerData.name;
        const googleId = playerData.googleId;
        const image = playerData.image;
      
        const existingPlayer = this.players.find((player) => player.room === room && player.googleId === googleId);
        if(existingPlayer) return { error: 'You are already waiting for the game!' };
      
        const newPlayer = { playerId, googleId, name, image, room };
      
        this.players.push(newPlayer);
            
        return { newPlayer };
    }
    removePlayer(playerId){
        const index = this.players.findIndex((player) => player.playerId === playerId);

        if(index !== -1) return this.players.splice(index, 1)[0];
    }
    getPlayer(playerId){
        return this.players.find((player) => player.playerId === playerId)
    }
    getPlayers(room){
        return this.players.filter((player) => player.room === room);
    }
}

module.exports = Players;