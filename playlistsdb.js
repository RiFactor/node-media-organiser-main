const fs = require("fs");
const path = require("path");

const getPath = (relativePath) => {
  return path.join(__dirname, relativePath);
};

const readPlaylistsFromDb = () => {
  const data = fs.readFileSync(getPath("./playlistsDb.json"));
  const playlists = JSON.parse(data);
  return playlists;
  // parse
};

const writePlaylistsToDb = (playlists) => {
  // stringify
  fs.writeFileSync(getPath("./playlistsDb.json"), JSON.stringify(playlists));
};

const getPlaylists = () => {
  try {
    const playlists = readPlaylistsFromDb();
    // iterate over playlist here to display (minimal code in controller)
    return playlists;
  } catch (error) {
    throw error;
  }
};

const addPlaylist = () => {};

const updatePlaylist = () => {};

const deletePlaylist = () => {};

// delete playlist but not delete song
// remove ref to playlist from song as well (cleanup)

module.exports = {
  getPath,
  getPlaylists,
};
