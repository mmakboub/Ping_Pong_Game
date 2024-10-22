import { Injectable } from "@nestjs/common";
import SaveGameDto from "./dto/save-game.dto";
import { prisma } from "../../prisma";
import { log } from "console";

@Injectable()
export class GameService {

    async save(gameData: SaveGameDto) {
        const newGame = await prisma.history.create({
            data: {
                usernameWin: gameData.usernameWin,
                usernameLose: gameData.usernameLose,
                winScore: gameData.winScore,
                loseScore: gameData.loseScore
            }
        });
        
        return newGame;
    }

    async updateStats(gameData: SaveGameDto) {
        const userWin = await prisma.user.findUnique({ where: { username: gameData.usernameWin } });
        const userLose = await prisma.user.findUnique({ where: { username: gameData.usernameLose } });
        if (!userLose || !userWin)
            return null;
        const updateWin = await prisma.user.update({
            where: { username: gameData.usernameWin },
            data: {
                matchPlayed: userWin.matchPlayed + 1,
                matchWon: userWin.matchWon + 1,
            }
        })

        const updateLose = await prisma.user.update({
            where: { username: gameData.usernameLose },
            data: {
                matchPlayed: userLose.matchPlayed + 1,
                matchLost: userLose.matchLost + 1,
            }
        })
        this.updateAchivements(gameData);
        return { updateWin, updateLose };
    }


    async updateAchivements(gameData: SaveGameDto) {
        const userName: string = gameData.usernameWin;
        let newXp: number = 0;
        const user = await prisma.user.findUnique({
            where: {
                username: userName,
            },
            include: {
                achievements: true,
            }
        });
        if (user) {
            const userAchievements = user.achievements;
            let achievementTypeToUpdate: string;
    
            achievementTypeToUpdate =  'STRATEGIC';
            const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
            await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
            newXp = newXp + 40;
            console.log(newXp);
            console.log(userName, "unlocked Strategic Server and gained 40xp");
            if (await this.CheckLongevityAward(userName) == true) {
                achievementTypeToUpdate =  'LONGEVITY';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 20;
                console.log(userName, "unlocked Longevity Award and gained 20xp");
            }
            if (await this.CheckPingPongProdigy(userName) == true) {
                achievementTypeToUpdate =  'PRODIGY';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 50;
                console.log(userName, "unlocked Ping Pong Prodigy and gained 50xp");
            }
            if (await this.CheckGoldenPaddle(userName) == true) {
                achievementTypeToUpdate =  'GOLDEN';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 60;
                console.log(userName, "unlocked Golden Paddle and gained 60xp");
            }
            if (await this.CheckLongevityTheComebackKing(gameData) == true) {
                achievementTypeToUpdate =  'COMEBACK';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 20;
                console.log(userName, "unlocked LongevityTheComebackKing and gained 20xp");
            }
            if (await this.CheckTableMaster(gameData) == true) {
                achievementTypeToUpdate =  'MASTER';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 90;
                console.log(userName, "unlocked Table Master and gained 90xp");
            }
            if (await this.CheckRallyMaestro(gameData) == true) {
                achievementTypeToUpdate =  'RALLY';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 80;
                console.log(userName, "unlocked Table Master and gained 80xp");
            }
            if (await this.CheckConsistentChallenger(gameData) == true) {
                achievementTypeToUpdate =  'RALLY';
                const achievementToUpdate = userAchievements.find(achievement => achievement.type === achievementTypeToUpdate);
                await prisma.achievement.update({where: {id: achievementToUpdate.id}, data: {done: true}});
                newXp = newXp + 150;
                console.log(userName, "unlocked Table Master and gained 150xp");
            }
            await prisma.user.update({
                where: { username: userName },
                data: {
                    xp: user.xp + newXp,
                }
            });
        }
    }

    // Check Longevity Award
    async CheckLongevityAward(userName: string): Promise<boolean> {
        let valid: boolean;
        const lastSixGames = await prisma.history.findMany({
            where: {
                OR: [
                    { usernameWin: userName },
                    { usernameLose: userName }
                ]
            },
            orderBy: {
                date: 'desc'
            },
            take: 6
        });
        if (lastSixGames.length == 5) {
            console.log(lastSixGames);
            for (let i = 0; i < lastSixGames.length; i++) {
                console.log(lastSixGames[i].usernameWin, " == ", userName);
                if (lastSixGames[i].usernameWin !== userName) {
                    return false;
                }
            }
            return true;
        }
        else if (lastSixGames.length == 6 && lastSixGames[lastSixGames.length - 1].usernameLose == userName) {
            for (let i = 0; i < 5 && i < lastSixGames.length; i++) {
                if (lastSixGames[i].usernameWin != userName)
                    return false;
            }
            return true;
        }
        return false;
    }

        // Check Ping Pong Prodigy
        async CheckPingPongProdigy(userName: string): Promise<boolean> {
            const lastElevenGames = await prisma.history.findMany({
                where: {
                    OR: [
                        { usernameWin: userName },
                        { usernameLose: userName }
                    ]
                },
                orderBy: {
                    date: 'desc'
                },
                take: 11
            });
            if (lastElevenGames.length == 10) {
                for (let i = 0; i < lastElevenGames.length; i++) {
                    if (lastElevenGames[i].usernameWin !== userName) {
                        return false;
                    }
                }
                return true;
            }
            else if (lastElevenGames.length == 11 && lastElevenGames[lastElevenGames.length - 1].usernameLose == userName) {
                for (let i = 0; i < 10 && i < lastElevenGames.length; i++) {
                    if (lastElevenGames[i].usernameWin != userName)
                        return false;
                }
                return true;
            }
            return false;
        }

        // Check Golden Paddle
        async CheckGoldenPaddle(userName: string): Promise<boolean> {
            const user = await prisma.user.findUnique({
                where: {
                    username: userName,
                }
            });
            if (user.xp >= 500)
                return true;
            return false;
        }

        // Check Longevity The Comeback King
        async CheckLongevityTheComebackKing(gameData: SaveGameDto): Promise<boolean> {
            if (gameData.winScore == 5 && gameData.loseScore == 4)
                return true;
            return false;
        }

        // Check Table Master
        async CheckTableMaster(gameData: SaveGameDto): Promise<boolean> {
            if (gameData.winScore == 5 && gameData.loseScore == 0)
                return true;
            return false;
        }

        // Check Rally Maestro
        async CheckRallyMaestro(gameData: SaveGameDto): Promise<boolean> {
            const user = await prisma.user.findUnique({
                where: {
                    username: gameData.usernameWin,
                }
            });
            if (user.matchWon >= 25)
                return true;
            return false;
        }

        // Check Consistent Challenger
        async CheckConsistentChallenger(gameData: SaveGameDto): Promise<boolean> {
            const user = await prisma.user.findUnique({
                where: {
                    username: gameData.usernameWin,
                }
            });
            if (user.matchWon >= 50)
                return true;
            return false;
        }


}
