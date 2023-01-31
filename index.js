const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const {
  getPath,
  getMediaFiles,
  getMediaFile,
  addMediaFile,
  updateMediaFile,
  deleteMediaFile,
} = require("./mediaFilesDb");
const uploader = multer({ dest: getPath("./tmp") });
const { getPlaylists } = require("./playlistsDb");

const app = express();
const port = 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("Hello you");
});

/* #region MediaFiles */
app.get("/mediafiles", (req, res) => {
  const mediaFiles = getMediaFiles(); // get media files
  console.log(mediaFiles);
  res.send(mediaFiles); // return
});

app.get("/mediafiles/:id", (req, res) => {
  const id = Number(req.params.id);
  const mediaFile = getMediaFile(id);
  res.send(mediaFile);
});

app.post(
  "/mediafiles",
  uploader.fields([
    { name: "mediaFile", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  (req, res) => {
    // console.log(req); // try this
    // console.log(req.body, ", request body");
    // console.log(req.body.name, ", name");
    // console.log(req.files);
    // console.log(req.files.image);
    // console.log(req.files.mediaFile);
    // console.log(req.files.mediaFile[0].path);
    // console.log(req.files.mediaFile.path, "path in controller");
    // console.log(req.file[0], ",file [0]");
    // console.log(req.file[1], ",file [1\]");

    // res.send("OK for now");

    const newMediaFile = addMediaFile(
      req.body,
      req.files.mediaFile[0],
      req.files.image[0]
    ); // these are arrays so need to return the 1st obj
    res.send(newMediaFile);
  }
);

app.patch(
  "/mediafiles/:id",
  uploader.fields([
    { name: "mediaFile", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  (req, res) => {
    // to fix - hadn't installed body-parser package
    const id = Number(req.params.id);
    console.log(req.body, "req.body");
    console.log(req.body.comment, ", comment");
    const updatedMediaFile = updateMediaFile(id, req.body);
    res.send(updatedMediaFile);
  }
);

// app.patch("/mediafiles/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const updatedMediaFile = updateMediaFileCategory(id, req.body.categories);
//   res.send(updatedMediaFile);
// });

app.delete("/mediafiles/:id", (req, res) => {
  const id = Number(req.params.id); // otherwise it tries to match a string to a number!
  console.log(req.params.id), "delete id";
  console.log(id), "delete id";
  const deletedMediaFile = deleteMediaFile(id);
  console.log(deletedMediaFile, "deleted media file");

  if (!deletedMediaFile) {
    res.status(404);
    res.send("Media file does not exist");
  }

  res.send(deletedMediaFile);
});

/* #endregion */

/* #region Playlists */
app.get("/playlists", (req, res) => {
  const playlists = getPlaylists();
  // iterate playlists and display song info in each playlist
  res.send(playlists);
});
/* #endregion */

app.listen(port, () => {
  console.log(`Media organiser listening on port ${port}`);
});
