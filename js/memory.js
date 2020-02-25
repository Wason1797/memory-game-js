const coverTilePath = "/img/cover-tile.svg";
const exitTilePath = "/img/deleted.png";
const tileSprites = [
  "/img/yin-yang.svg",
  "/img/om.svg",
  "/img/sintoismo.svg",
  "/img/budismo.svg",
  "/img/ayyavazhi.svg",
  "/img/jainismo.svg",
  "/img/sijismo.svg",
  "/img/caodaismo.svg"
];
const tileAmmount = tileSprites.length * 2;

const tileTemplate = document.querySelector("#game-tile-template").innerHTML;
const gameSpace = document.querySelector("#game-space");
const scoreText = document.querySelector("#score");

const maxClicks = 2;
let currentClicks = 0;
let score = 0;
const activeTiles = new Set();
const correctTiles = new Set();

const shuffleArray = array => {
  for (let i = 0; i < array.length - 1; i++) {
    const j = Math.floor(Math.random() * i);
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateGame = numberOfPairs => {
  const halfGame = Array.from(Array(numberOfPairs).keys());
  const fullGame = [...halfGame, ...halfGame];
  shuffleArray(fullGame);
  return fullGame;
};

const buildTile = (tileTemplate, tileValues) =>
  Mustache.render(tileTemplate, tileValues);

const initialGame = generateGame(tileSprites.length);

const renderTile = (parentId, tilePath) => {
  const tile = document.getElementById(parentId);
  tile.innerHTML = buildTile(tileTemplate, {
    imgPath: tilePath
  });
};

const checkCorrectPairs = activeTiles => {
  const activeTilesArray = Array.from(activeTiles);
  const isCorrect =
    activeTilesArray.length === 2
      ? initialGame[activeTilesArray[0]] === initialGame[activeTilesArray[1]]
      : false;
  if (isCorrect) {
    setTimeout(() => {
      activeTilesArray.forEach(tile => {
        correctTiles.add(tile);
        renderTile(tile, exitTilePath);
      });
      score++;
      scoreText.innerHTML = score;
    }, 500);
  }
  return isCorrect;
};

const clickTile = event => {
  const parentId = event.target.parentNode.id;
  if (parentId !== "game-space") {
    if (
      !activeTiles.has(parentId) &&
      currentClicks < maxClicks &&
      !correctTiles.has(parentId)
    ) {
      renderTile(parentId, tileSprites[initialGame[parentId]]);
      currentClicks++;
      activeTiles.add(parentId);
      const iscorrectMatch = checkCorrectPairs(activeTiles);
      setTimeout(() => {
        if (!iscorrectMatch && !correctTiles.has(parentId)) {
          renderTile(parentId, coverTilePath);
        }
        activeTiles.delete(parentId);
        currentClicks--;
      }, 1500);
    }
  }
};

const renderInitialGameBoard = () => {
  for (let i = 0; i < tileAmmount; i++) {
    const newNode = document.createElement("div");
    newNode.classList.add("game-tile-container");
    newNode.id = i;
    newNode.onclick = clickTile;
    newNode.innerHTML = buildTile(tileTemplate, {
      imgPath: coverTilePath
    });
    gameSpace.appendChild(newNode);
  }
};

renderInitialGameBoard();
