var myWindow;

var Map = React.createClass({
  displayName: "Map",
  getInitialState: function getInitialState() {
    return {

      width: 40,
      height: 50,
      wallRender: 0,
      gameLevel: 0,
      playerMessage: "kill the black-faced boss",
      Probabilities: {
        levelA: [3, 5, 2],
        levelB: [3.5, 3, 3.5],
        levelC: [8, 1, 1]
      }

    };
  },
  componentWillMount: function componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);

    var map = [];
    var rooms = [];
    var render = [];
    var level = this.state.gameLevel;
    //use rot.js to generate map
    var w = this.state.width,
        h = this.state.height;
    var objects = ["e", "h", "w"];
    var probability;

    var enemies = [];
    var weapon = [];
    var health = [];

    if (level == 0) {
      probability = this.state.Probabilities.levelA;
    } else if (level == 1) {
      probability = this.state.Probabilities.levelB;
    } else {
      probability = this.state.Probabilities.levelC;
    }

    // var map = new ROT.Map.Digger();
    var data = {};
    var rotMap = new ROT.Map.Rogue(w, h);

    var display = new ROT.Display({ width: w, height: h, fontSize: 6 });

    rotMap.create(function (x, y, type) {
      data[x + "," + y] = type;
      display.DEBUG(x, y, type);
    });

    map = rotMap.map;
    var rooms = rotMap.rooms;
    // console.log(map);
    // console.log(rooms)


    var playerPosition = [rooms[0][0].x + 1, rooms[0][0].y + 1];
    var portalPosition = [rooms[2][2].x + 2, rooms[2][2].y + 2];
    // console.log(playerPosition)

    map[playerPosition[0]][playerPosition[1]] = "p";
    map[portalPosition[0]][portalPosition[1]] = "*";
    var pp = playerPosition;
    //     
    // set up enemies and health
    rooms.map(function (rooms) {
      rooms.map(function (room) {

        var rx = room.x;var ry = room.y;

        var noe = Math.floor(Math.random() * (1 + 2 - 2 + 1)) + 2;

        for (var i = 0; i < noe; i++) {
          //     generate enemy postions
          var ex = Math.floor(Math.random() * (room.width + rx - rx + 1)) + rx;
          var ey = Math.floor(Math.random() * (room.height + ry - ry + 1)) + ry;

          if (ex >= rx && ex < room.width + rx && ey >= ry && ey < room.height + ry) {

            var totalProbability = eval(probability.join("+")); //get total weight (in this case, 10)
            var weighedObjects = new Array(); //new array to hold "weighted" fruits
            var currentObject = 0;

            while (currentObject < objects.length) {
              for (i = 0; i < probability[currentObject]; i++) {
                weighedObjects[weighedObjects.length] = objects[currentObject];
              }currentObject++;
            }

            var randomnumber = Math.floor(Math.random() * totalProbability);
            var x = weighedObjects[randomnumber];

            if (x == 'e') {
              map[ex][ey] = "e";
              var stats = {
                loc: ex + " " + ey,
                health: 5,
                damage: 20
              };
              enemies.push(stats);
            } else if (x == 'h') {
              map[ex][ey] = "h";
              var stats = {
                loc: ex + " " + ey,
                boost: 80
              };
              health.push(stats);
            } else if (x == 'w') {
              map[ex][ey] = "w";
              var stats = {
                loc: ex + " " + ey,
                damageBoost: 40
              };
              weapon.push(stats);
            }

            // console.log(ex + " " + ey + " " + (room.width + rx) + " " + (room.height + ry))
          }
        }
      });
    });

    //     place enemy

    // console.log(enemies);
    // console.log(health);
    // console.log(weapon)


    //    setup field of view
    var fov = this.setFov(pp);

    this.setState({
      gameState: map,
      gameRooms: rooms,
      playerPosition: playerPosition,
      playerHealth: 50,
      playerDamage: 5,
      portalPosition: portalPosition,
      fov: fov,
      enemies: enemies,
      health: health,
      weapon: weapon

    });
  },
  levelRender: function levelRender() {
    console.log("level rendered");

    var map = [];
    var rooms = [];
    var render = [];
    var level = this.state.gameLevel;

    //use rot.js to generate map
    var w = this.state.width,
        h = this.state.height;
    var objects = ["e", "h", "w"];
    var probability;

    var enemies = [];
    var weapon = [];
    var health = [];

    if (level == 0) {
      probability = this.state.Probabilities.levelA;
    } else if (level == 1) {
      probability = this.state.Probabilities.levelB;
    } else {
      probability = this.state.Probabilities.levelC;
    }

    // var map = new ROT.Map.Digger();
    var data = {};
    var rotMap = new ROT.Map.Rogue(w, h);

    var display = new ROT.Display({ width: w, height: h, fontSize: 6 });

    rotMap.create(function (x, y, type) {
      data[x + "," + y] = type;
      display.DEBUG(x, y, type);
    });

    map = rotMap.map;
    var rooms = rotMap.rooms;

    var playerPosition = [rooms[0][0].x + 1, rooms[0][0].y + 1];

    if (level == 0 || level == 1) {
      var portalPosition = [rooms[2][2].x + 2, rooms[2][2].y + 2];
      map[portalPosition[0]][portalPosition[1]] = "*";
    } else {
      var bossPosition = [rooms[2][2].x + 2, rooms[2][2].y + 2];
      map[bossPosition[0]][bossPosition[1]] = "boss";
    }

    map[playerPosition[0]][playerPosition[1]] = "p";

    var pp = playerPosition;
    //     
    // set up enemies and health
    rooms.map(function (rooms) {
      rooms.map(function (room) {

        var rx = room.x;var ry = room.y;

        var noe = Math.floor(Math.random() * (1 + 2 - 2 + 1)) + 2;

        for (var i = 0; i < noe; i++) {
          //     generate enemy postions
          var ex = Math.floor(Math.random() * (room.width + rx - rx + 1)) + rx;
          var ey = Math.floor(Math.random() * (room.height + ry - ry + 1)) + ry;

          if (ex >= rx && ex < room.width + rx && ey >= ry && ey < room.height + ry) {

            var totalProbability = eval(probability.join("+")); //get total weight (in this case, 10)
            var weighedObjects = new Array(); //new array to hold "weighted" fruits
            var currentObject = 0;

            while (currentObject < objects.length) {
              for (i = 0; i < probability[currentObject]; i++) {
                weighedObjects[weighedObjects.length] = objects[currentObject];
              }currentObject++;
            }

            var randomnumber = Math.floor(Math.random() * totalProbability);
            var x = weighedObjects[randomnumber];

            if (x == 'e') {
              map[ex][ey] = "e";
              var stats = {
                loc: ex + " " + ey,
                health: 50,
                damage: 20
              };
              enemies.push(stats);
            } else if (x == 'h') {
              map[ex][ey] = "h";
              var stats = {
                loc: ex + " " + ey,
                boost: 80
              };
              health.push(stats);
            } else if (x == 'w') {
              map[ex][ey] = "w";
              var stats = {
                loc: ex + " " + ey,
                damageBoost: 40
              };
              weapon.push(stats);
            }

            // console.log(ex + " " + ey + " " + (room.width + rx) + " " + (room.height + ry))
          }
        }
      });
    });

    //    setup field of view
    var fov = this.setFov(pp);

    console.log(this.state.gameState);

    this.setState({
      gameState: map,
      gameRooms: rooms,
      playerPosition: playerPosition,
      bossPosition: bossPosition,
      portalPosition: portalPosition,
      fov: fov,
      enemies: enemies,
      health: health,
      weapon: weapon

    });
    console.log(this.state.enemies);
  },
  setFov: function setFov(playerPos) {
    var pp = playerPos;
    var fov = [];
    var x = pp[0];var y = pp[1];

    fov.push(x - 2 + "," + (y - 1));fov.push(x - 2 + "," + y);fov.push(x - 2 + "," + (y + 1));
    fov.push(x - 1 + "," + (y - 2));fov.push(x - 1 + "," + (y - 1));fov.push(x - 1 + "," + y);fov.push(x - 1 + "," + (y + 1));fov.push(x - 1 + "," + (y + 2));
    fov.push(x + "," + (y - 2));fov.push(x + "," + (y - 1));fov.push(x + "," + y);fov.push(x + "," + (y + 1));fov.push(x + "," + (y + 2));
    fov.push(x + 1 + "," + (y - 2));fov.push(x + 1 + "," + (y - 1));fov.push(x + 1 + "," + y);fov.push(x + 1 + "," + (y + 1));fov.push(x + 1 + "," + (y + 2));
    fov.push(x + 2 + "," + (y - 1));fov.push(x + 2 + "," + y);fov.push(x + 2 + "," + (y + 1));
    fov.push(x - 3 + "," + y);fov.push(x + 3 + "," + y);fov.push(x + "," + (y - 3));fov.push(x + "," + (y + 3));

    return fov;
  },
  playerEnemy: function playerEnemy(key, x, y) {
    var map = this.state.gameState;
    var playerPos = this.state.playerPosition;

    if (key == 37) {
      var i = x,
          j = y - 1;
    }

    if (key == 38) {
      var i = x - 1,
          j = y;
    }

    if (key == 39) {
      var i = x,
          j = y + 1;
    }

    if (key == 40) {
      var i = x + 1,
          j = y;
    }

    if (map[i][j] == "e") {
      var enemies = this.state.enemies;

      var arrval;
      var enemy = enemies.filter(function (enemy, val) {

        if (enemy.loc == i + " " + j) {
          arrval = val;
          return enemy;
        }
      });

      var playerHealth = this.state.playerHealth - enemy[0].damage;
      var enemyHealth = enemy[0].health - this.state.playerDamage;
      enemies[arrval].health = enemyHealth;

      if (enemyHealth == 0 || enemyHealth < 0) {
        console.log("iam not working");
        map[x][y] = 0;
        map[i][j] = "p";

        playerPos[0] = i;
        playerPos[1] = j;
      }

      if (playerHealth == 0 || playerHealth < 0) {
        alert("game over");
      }

      this.setState({
        playerHealth: playerHealth,
        enemies: enemies

      });
    }

    if (map[i][j] == "*") {

      var level = this.state.gameLevel + 1;

      this.setState({
        gameLevel: level
      });

      this.levelRender();

      return "red";
    }

    if (map[i][j] == 0 || map[i][j] == "w" || map[i][j] == "h") {

      if (map[i][j] == "h") {
        var health = this.state.playerHealth + 30;
        this.setState({
          playerHealth: health
        });
      }
      if (map[i][j] == "w") {
        var damage = this.state.playerDamage + 20;
        this.setState({
          playerDamage: damage
        });
      }

      map[x][y] = 0;
      map[i][j] = "p";

      playerPos[0] = i;
      playerPos[1] = j;
    }
    //      change fov


    map = this.state.gameState;

    var fov = this.setFov(playerPos);

    this.setState({
      gameState: map,
      playerPosition: playerPos,
      fov: fov
    });
  },
  handleKeyDown: function handleKeyDown(e) {
    //     left arrow

    if (e.keyCode == 37) {

      var map = this.state.gameState;
      var playerPos = this.state.playerPosition;
      var x = playerPos[0],
          y = playerPos[1];
      this.playerEnemy(37, x, y);
    }
    //  up arrow
    if (e.keyCode == 38) {

      var map = this.state.gameState;
      var playerPos = this.state.playerPosition;
      var x = playerPos[0],
          y = playerPos[1];

      this.playerEnemy(38, x, y);
    }
    //   right arrow
    if (e.keyCode == 39) {
      var map = this.state.gameState;
      var playerPos = this.state.playerPosition;
      var x = playerPos[0],
          y = playerPos[1];

      this.playerEnemy(39, x, y);
    }
    //    down arrow
    if (e.keyCode == 40) {
      var map = this.state.gameState;
      var playerPos = this.state.playerPosition;
      var x = playerPos[0],
          y = playerPos[1];

      this.playerEnemy(40, x, y);
    }
  },
  render: function render() {

    //    rendering map

    var map = this.state.gameState;
    var fov = this.state.fov;

    if (this.state.gameLevel == 1) {
      console.log(map);
    }

    var render = [];

    for (var i = 0; i < this.state.width; i++) {
      var dummy = [];

      for (var j = 0; j < this.state.height; j++) {
        var arena = { background: "#dfc0ea", color: "white", "border-spacing": "1px" };
        var wall = { background: "#789ee2", color: "grey",
          "box-shadow": "0 0 17px 2px black" };
        var enemy = { background: "blue", color: "blue", "box-shadow": "0px 0px 4px 0px black" };
        var player = { background: "red", color: "red", border: "1px solid red",
          "box-shadow": "0px 0px 4px 0px black", position: "relative" };
        var health = { background: "green", color: "green",
          "box-shadow": "0px 0px 4px 0px black", position: "relative" };
        var weapon = { background: "orange", color: "orange",
          "box-shadow": "0px 0px 4px 0px black", position: "relative" };
        var portal = { background: "brown", color: "brown",
          "box-shadow": "0px 0px 4px 0px black", position: "relative" };
        var boss = { background: "black", color: "black",
          "box-shadow": "0px 0px 4px 0px black", position: "relative"
          //       check if cell is in fov  
        };var val = i + "," + j;

        if (map[i][j] == 0) {
          //           implement field of view
          var x = arena;
          if (fov.includes(val)) {
            x.visibility = "visible";
            console.log(val);
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: x }));
        } else if (map[i][j] == "p") {
          var x = player;
          dummy.push(React.createElement("td", { style: player }));
        } else if (map[i][j] == "e") {
          var x = enemy;
          if (fov.includes(val)) {
            x.visibility = "visible";
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: enemy }));
        } else if (map[i][j] == "h") {
          var x = health;
          if (fov.includes(val)) {
            x.visibility = "visible";
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: health }));
        } else if (map[i][j] == "*") {
          var x = portal;
          if (fov.includes(val)) {
            x.visibility = "visible";
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: portal }));
        } else if (map[i][j] == "w") {
          var x = weapon;
          if (fov.includes(val)) {
            x.visibility = "visible";
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: weapon }));
        } else if (map[i][j] == "boss") {
          //           var x = boss;
          if (fov.includes(val)) {
            x.visibility = "visible";
          } else {
            x.visibility = "hidden";
          }

          dummy.push(React.createElement("td", { style: boss }));
        } else {
          var x = wall;
          if (fov.includes(val)) {
            x.visibility = "visible";
            //             console.log(val)
          } else {
            x.visibility = "hidden";
          }
          // generate random hue of colors

          dummy.push(React.createElement("td", { style: wall }));
        }
      }

      render.push(React.createElement(
        "tr",
        null,
        dummy
      ));
    }

    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "DUNGEON CRAWLER"
      ),
      React.createElement(
        "h4",
        null,
        "Message:",
        this.state.playerMessage
      ),
      React.createElement("br", null),
      React.createElement(
        "div",
        { "class": "container", id: "gameArea", tabIndex: "0" },
        React.createElement(
          "div",
          { id: "info" },
          React.createElement(
            "span",
            { id: "health" },
            "Health:",
            this.state.playerHealth,
            " "
          ),
          React.createElement(
            "span",
            { id: "damage" },
            "Damage:",
            this.state.playerDamage,
            " "
          ),
          React.createElement(
            "span",
            { id: "level" },
            "Level:",
            this.state.gameLevel
          ),
          React.createElement("br", null)
        ),
        React.createElement(
          "table",
          { clas: "table", align: "right" },
          render
        )
      )
    );
  }
});

React.render(React.createElement(Map, null), document.getElementById("app"));