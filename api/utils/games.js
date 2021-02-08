
class Games {
    constructor () {
        this.games = [];
    }
    addGame(adminId, state, room){
        if(!room) return { error: 'Game not available!' };
      
        const existingGame = this.games.find((game) => game.room === room);
        if(existingGame) return { error: 'There is already game that exist at this route' };

        const newGame = { adminId, state, room };
      
        this.games.push(newGame);
            
        return { newGame };
    }
    removeGame(room){
        const index = this.games.findIndex((game) => game.room === room);

        if(index !== -1) return this.games.splice(index, 1)[0];
    }
    getGame(room){
        return this.games.find((game) => game.room === room);
    }
    getGames(adminId){
        return this.games.filter((game) => game.adminId === adminId);
    }
}

module.exports = Games;