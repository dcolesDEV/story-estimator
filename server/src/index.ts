import "dotenv/config";
import Fastify from "fastify";
import short from "short-uuid";
import { Server } from "socket.io";
import fastifyCors from "fastify-cors";
import { Player, PlayerType, Room, ShowType, Story } from "./types";

const fastify = Fastify();

const getTimeInSeconds = () => Math.floor(Date.now() / 1000);

fastify.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST"],
});

const io = new Server(fastify.server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

setInterval(() => {
  io.emit("ping");
  log();
}, 10000);

fastify.get("/ping", async (_request: any, reply: any) => {
  reply.send("pong 🏓");
});

fastify.listen(process.env.PORT || 4000, "0.0.0.0", (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});

let players: Player[] = [];
let rooms: Room[] = [];
let stories: Story[] = [];

const updateRoom = (roomId: any) => {
  io.to(roomId).emit("update", {
    players: players.filter(p => p.roomId === roomId),
    room: rooms.find(r => r.id === roomId),
    stories: stories.filter(s => s.roomId === roomId),
  });
};

const resetGame = (roomId: any) => {
  const roomPlayers = [...players].filter(p => p.roomId === roomId);
  roomPlayers.forEach(p => (p.vote = undefined));

  io.to(roomId).emit("reset");
  io.to(roomId).emit("update", {
    players: roomPlayers,
    room: rooms.find(r => r.id === roomId),
    stories: stories.filter(s => s.roomId === roomId),
  });
};

const log = () => {
  const rooms = [...players].map(e => e.roomId);
  if (rooms) {
    rooms
      .filter((val, i, arr) => arr.indexOf(val) === i)
      .map(room => {
        const playerCount = [...players].filter(p => p.roomId === room).length;
        console.log(`🃏 Room: ${room} | Players: ${playerCount}`);
      });
  }
};

io.on("connection", socket => {
  console.log("🔌 A User Has Connected: ", socket.id);
  const roomId = socket.handshake.query["roomId"] || short.generate();

  socket.emit("room", roomId);

  if (!rooms.find(r => r.id === roomId)) {
    rooms.push({
      id: roomId as string,
      settings: {
        countdown: true,
        fastMode: false,
      },
    });
  }

  if (!stories.find(s => s.roomId === roomId)) {
    stories.push({
      id: short.generate(),
      roomId: roomId as string,
      description: "Story #1",
      vote: undefined,
      startSeconds: getTimeInSeconds(),
      endSeconds: undefined,
    });
  }

  socket.join(roomId);
  players.push({
    id: socket.id,
    name: "",
    type: PlayerType.Voter,
    emoji: "🤔",
    roomId: roomId,
    vote: undefined,
  });

  socket.on("name", name => {
    const player = [...players].find(p => p.id === socket.id);
    if (player) {
      const playerIndex = players.findIndex(x => x.id === socket.id);
      players[playerIndex] = { ...player, name };
    }
    updateRoom(roomId);
  });

  socket.on("type", type => {
    const player = [...players].find(p => p.id === socket.id);
    if (player) {
      const playerIndex = players.findIndex(x => x.id === socket.id);
      players[playerIndex] = { ...player, type, vote: undefined };
    }
    updateRoom(roomId);
  });

  socket.on("emoji", emoji => {
    const player = [...players].find(p => p.id === socket.id);
    if (player) {
      const playerIndex = players.findIndex(x => x.id === socket.id);
      players[playerIndex] = { ...player, emoji };
    }
    updateRoom(roomId);
  });

  socket.on("settings", settings => {
    if (roomId) {
      const roomIndex = rooms.findIndex(r => r.id == roomId);
      rooms[roomIndex].settings = settings;
    }
    updateRoom(roomId);
  });

  socket.on("description", description => {
    if (roomId) {
      const storyIndex = stories.findIndex(
        s => s.roomId === roomId && s.endSeconds === undefined
      );
      stories[storyIndex].description = description;
    }
    updateRoom(roomId);
  });

  socket.on("vote", vote => {
    const player = [...players].find(p => p.id === socket.id);
    if (player) {
      const playerIndex = players.findIndex(x => x.id === socket.id);
      players[playerIndex] = { ...player, vote };
      io.to(roomId || "").emit("vote");
    }

    const votersInRoom = [...players].filter(
      p => p.roomId === roomId && p.type === PlayerType.Voter
    );
    if (votersInRoom.every(p => p.vote)) {
      io.to(roomId || "").emit("show");
    }
    updateRoom(roomId);
  });

  socket.on("show", (type: ShowType) => {
    io.to(roomId || "").emit("show", type);
  });

  socket.on("reset", () => {
    resetGame(roomId);
  });

  socket.on("complete", finalVote => {
    if (roomId) {
      const storyIndex = stories.findIndex(
        s => s.roomId === roomId && s.endSeconds === undefined
      );
      stories[storyIndex].endSeconds = getTimeInSeconds();
      stories[storyIndex].vote = finalVote;
      stories.push({
        id: short.generate(),
        roomId: roomId as string,
        description: `Story #${storyIndex + 2}`,
        vote: undefined,
        startSeconds: getTimeInSeconds(),
        endSeconds: undefined,
      });
    }
    resetGame(roomId);
  });

  socket.on("pong", () => {
    players.find(p => p.id === socket.id);
  });

  socket.on("disconnect", () => {
    players = [...players].filter(player => player.id !== socket.id);
    updateRoom(roomId);
  });
});

