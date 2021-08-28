const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./model");
const games = db.games;
const users = db.users;
const feedbacks = db.feedbacks;
const chats = db.chats;
app.use(cors(corsOptions));
app.use(express.json());
// ====================================================================================================
// ====================================================================================================
const got = require("got");

const apiKey = "acc_a94e63861293515";
const apiSecret = "efbb7c90953b168a17e03eae9495edb6";

let imageUrl = "link image example...";

// ====================================================================================================
// ====================================================================================================
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect database");
  })
  .catch((e) => {
    console.log(e);
    process.exit();
  });
var corsOptions = {
  origin: "http://localhost:8081",
};
app.post("/api/games/create", async (req, res) => {
  let gamea = new games(req.body);
  try {
    await gamea.save();
    res.send("Create game successfully !");
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/games/read", async (req, res) => {
  games.find({}, (err, database) => {
    if (err) {
      res.send(err);
    }
    res.send(database);
  });
});
app.put("/api/games/update/:id", async (req, res) => {
  let id = req.params.id;
  let updateGame = req.body;
  try {
    await games.findById(id, (err, game) => {
      //* title *
      game.title = updateGame.newTitle == "" ? game.title : updateGame.newTitle;
      //* description *
      game.description =
        updateGame.newDescription == ""
          ? game.description
          : updateGame.newDescription;
      //* url *
      game.url = updateGame.newUrl == "" ? game.url : updateGame.newUrl;
      //* iframe *
      game.iframe =
        updateGame.newIframe == "" ? game.iframe : updateGame.newIframe;
      //* love game *
      game.love_game =
        updateGame.newLove_game == null
          ? game.love_game
          : updateGame.newLove_game;
      //* how2play *
      game.how2play =
        updateGame.newHow2play == "" ? game.how2play : updateGame.newHow2play;
      //* Mobile game *
      game.mobile_game =
        updateGame.newNobile_game == null
          ? game.mobile_game
          : updateGame.newMobile_game;
      console.log(game);
      game.save();
      res.send(game);
    });
  } catch (err) {
    console.log(err);
  }
});
app.delete("/api/games/delete/:id", async (req, res) => {
  let _id = req.params.id;
  games.findByIdAndDelete(_id, (err, txt) => {
    try {
      res.send("Xóa thành công _ID: " + _id);
    } catch (err) {
      resp.send(err);
    }
  });
});
app.put("/api/games/update_rank/:id", async (req, res) => {
  let id = req.params.id;
  let updateGame = req.body;
  try {
    await games.findById(id, (err, game) => {
      game.rank = updateGame.rank;
      game.save();
      res.send(game);
    });
  } catch (err) {
    console.log(err);
  }
});
//===============================================================================
//================================USER============================================
//===============================================================================
app.post("/api/users/create", async (req, res) => {
  let usera = new users(req.body);
  console.log(usera);
  try {
    await usera.save();
    res.send("Create user successfully !");
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/users/read", async (req, res) => {
  users.find({}, (err, database) => {
    if (err) {
      res.send(err);
    }
    res.send(database);
  });
});
app.put("/api/users/update/:id", async (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  try {
    await users.findById(id, (err, user) => {
      user.played_games = updateUser.played_games;
      user.time_gaming = updateUser.time_gaming;
      user.save();
      res.send(user);
    });
  } catch (err) {
    console.log(err);
  }
});
// ========================== Feedback===========================
app.post("/api/feedbacks/create", async (req, res) => {
  let feedbacka = new feedbacks(req.body);
  try {
    await feedbacka.save();
    res.send(req.body);
  } catch (e) {
    console.log(e);
  }
});
app.get("/api/feedbacks/read", async (req, res) => {
  feedbacks.find({}, (err, database) => {
    if (err) {
      res.send(err);
    }
    res.send(database);
  });
});
// ========================== Feedback===========================
app.get("/api/chats/read", async (req, res) => {
  chats.find({}, (err, database) => {
    if (err) {
      res.send(err);
    }
    res.send(database);
  });
});
app.post("/api/chats/create", async (req, res) => {
  let chata = new chats(req.body);
  try {
    await chata.save();
    res.send("Create user successfully !");
  } catch (e) {
    console.log(e);
  }
});
var server = require("http").Server(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", function (socket) {
  console.log("+1 connections !!!");
  socket.on("disconnect", function () {
    console.log(socket.id + ": disconnected");
  });
  socket.on("send message", (data) => {
    io.emit("send message", { data });
  });
  socket.on("AI detect", (img) => {
    imageUrl = img;
    let url =
      "https://api.imagga.com/v2/tags?image_url=" +
      encodeURIComponent(imageUrl);
    (async () => {
      try {
        const response = await got(url, {
          username: apiKey,
          password: apiSecret,
        });
        io.emit("AI detect", response.body);
      } catch (error) {
        console.log(error.response.body);
      }
    })();
  });
});
// server.listen(port, () => console.log("Server running in port " + port));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
