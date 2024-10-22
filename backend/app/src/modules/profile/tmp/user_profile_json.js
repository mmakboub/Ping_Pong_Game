// GET /profile
// it returns current authenticated user profile
const user_profile = {
  profile: {
    first_name: "",
    last_name: "",
    username: "",
    // current user profile picture
    avatar_url: "PATH_OF_USER_AVATAR",
    rank: 123,
    level: 9,
    xp: 170,
    games: 3104,
    wins: 5,
    losses: 3,
  },
  achievements: {
    longevity_award: true, // active (user have this achievement activated)
    strategic_server: false, // inActive (user DON'T have this achievement)
    ping_pong_prodigy: false,
    // ... the rest of achievements
  },
};

// GET /friends/:page_number
// it returns list of friends of the current authenticated user
const user_frields = {
  friends: [
    {
      // user_id in DB, it will be used in the button "Play with"
      //    to know which user we want to play against
      user_id: 111,
      // target user profile picture
      avatar_url: "PATH_OF_USER_AVATAR",
      username: "",
      rank: 123,
      level: 9,
    },
  ],
  // TODO: look for pagination in nestjs with Prisma, so we know the max number of pages we have....
  // TODO: implement friend status (online/offline) via WebSocket, to have realtime updates
};

// GET /game_history
const game_history = {
  history: [
    {
      // opponent user profile picture
      avatar_url: "PATH_OF_USER_AVATAR",
      // opponent username
      username: "",
      // opponent user level
      level: 9,
      // current authenticated user score
      own_score: 4,
      // opponent score
      opponent_score: 1,
      // game date
      game_date: "2024-01-18",
    },
  ],
  // TODO: look for pagination in nestjs with Prisma, so we know the max number of pages we have....
};
