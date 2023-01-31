const fs = require("fs");
const path = require("path");

const apiEndpoint = "http://localhost:8080";

const getPath = (relativePath) => {
  return path.join(__dirname, relativePath);
};

const readMediaFilesFromDb = () => {
  const data = fs.readFileSync(getPath("./mediaFilesDb.json"));
  const mediaFiles = JSON.parse(data);
  return mediaFiles;
};

const writeMediaFilesToDb = (mediaFiles) => {
  fs.writeFileSync(getPath("./mediaFilesDb.json"), JSON.stringify(mediaFiles));
};

const getMediaFiles = () => {
  try {
    const mediaFiles = readMediaFilesFromDb();
    //iterate for categories here too
    return mediaFiles;
  } catch (error) {
    throw error;
  }
};

const getMediaFile = (mediaFileId) => {
  try {
    const mediaFiles = readMediaFilesFromDb();
    return mediaFiles.find((mediaFile) => mediaFile.id === mediaFileId);
    //iterate for category
  } catch (error) {
    throw error;
  }
};

const addMediaFile = (content, mediaFileConfig, imageConfig) => {
  try {
    // get list
    const mediaFiles = readMediaFilesFromDb();
    // read media file
    console.log(mediaFileConfig.path, "path here");
    const mediaFile = fs.readFileSync(mediaFileConfig.path);
    const image = fs.readFileSync(imageConfig.path);

    //create id and paths
    const newId = mediaFiles[mediaFiles.length - 1].id + 1;

    const mediaFileExt = mediaFileConfig.originalname.match(/\.[0-9a-z]+$/i)[0];
    const mediaURLPath = "/assets/mediafiles/mediaFile" + newId + mediaFileExt; // name can have spaces so don't include
    const mediaPath = "./public" + mediaURLPath;

    const imageExt = imageConfig.originalname.match(/\.[0-9a-z]+$/i)[0];
    const imageURLPath = "/assets/images/image" + newId + imageExt; // name can have spaces so don't include
    const imagePath = "./public" + imageURLPath;

    //create file safely
    fs.writeFileSync(getPath(mediaPath), mediaFile);
    fs.writeFileSync(getPath(imagePath), image);

    // remove media file in tmp
    fs.rmSync(mediaFileConfig.path); // gives full path so don't need getPath()
    fs.rmSync(imageConfig.path); // gives full path so don't need getPath()

    //create new list and append
    const newMediaFile = {
      id: newId,
      name: content.name,
      comment: content.comment,
      isLiked: content.isLiked,
      categories: content.categories,
      media: apiEndpoint + mediaURLPath,
      mediaPath, // create path
      type: mediaFileExt, // get path info
      image: apiEndpoint + imageURLPath,
      imagePath,
    };

    // remove from tmp folder

    mediaFiles.push(newMediaFile);

    // write back
    writeMediaFilesToDb(mediaFiles);
    return newMediaFile;
  } catch (error) {
    throw error;
  }
};

// const updateMediaFileCategory = (mediaFileId, newCategory) => {
//   try {
//     const mediaFiles = readMediaFilesFromDb();
//     // get the category item and update
//     const index = mediaFiles.findIndex((mediaFile) => {
//       return mediaFile.id === mediaFileId;
//     });
//     mediaFiles[index].categories = newCategory;
//   } catch (error) {
//     throw errors;
//   }
// };

const updateMediaFile = (
  mediaFileId,
  updates,
  mediaFileConfig,
  imageConfig
) => {
  try {
    const mediaFiles = readMediaFilesFromDb();

    const index = mediaFiles.findIndex((mediaFile) => {
      return mediaFile.id === mediaFileId;
    });

    // can you wrap a fn inside a fn?
    // const updateValue = (newValue, oldValue, value) => {
    //   if (newValue) {
    //     const value = newValue;
    //   } else {
    //     const value = oldValue;
    //   }
    //   return value;
    // };

    // const name = updateValue(updates.name, mediaFiles[index].name, name);

    console.log(updates.name, "updates.name");
    let newName = mediaFiles[index].name;
    if (updates.name) {
      newName = updates.name;
    }
    // const comment = updateValue(
    //   updates.comment,
    //   mediaFiles[index].comment,
    //   comment
    // );
    // const isLiked = updateValue(
    //   updates.isLiked,
    //   mediaFiles[index].isLiked,
    //   isLiked
    // );
    // const categories = updateValue(
    //   updates.categories,
    //   mediaFiles[index].categories,
    //   categories
    // );


    // DON'T NEED THIS
    // if (mediaFileConfig) {
    //   // overwrite existing media file (remove old file)
    // }

    if (imageConfig) {
      // as above
    }

    // const mediaFile = mediaFiles.find(
    //   (mediaFile) => mediaFile.id === mediaFileId
    // );
    // mediaFile.comment = updatedComment;

    // const newMediaFile = {
    //   id: newId,
    //   name: mediaName,
    //   // comment,
    //   // isLiked,
    //   // categories,
    //   // media: apiEndpoint + mediaURLPath,
    //   // mediaPath, // create path
    //   // type: mediaFileExt, // get path info
    //   // image: apiEndpoint + imageURLPath,
    //   // imagePath,
    // };

    mediaFiles[index].name = newName;

    // mediaFiles[index].comment = updatedComment;
    writeMediaFilesToDb(mediaFiles);
    return mediaFiles[index];
  } catch (error) {
    throw error;
  }
};

const deleteMediaFile = (mediaFileId) => {
  try {
    const mediaFiles = readMediaFilesFromDb();

    const index = mediaFiles.findIndex((mediaFile) => {
      return mediaFile.id === mediaFileId;
    });
    console.log(index, "index here");

    if (index === -1) {
      return;
    }

    const deletedMediaFileArray = mediaFiles.splice(index, 1); // returns an array
    const deletedMediaFile = deletedMediaFileArray[0];

    // remove the image and media files associated with it
    if (deletedMediaFile.media) {
      fs.rmSync(deletedMediaFile.mediaPath);
    }

    if (deletedMediaFile.image) {
      fs.rmSync(deletedMediaFile.imagePath);
    }

    writeMediaFilesToDb(mediaFiles);
    return deletedMediaFile;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPath,
  getMediaFiles,
  getMediaFile,
  addMediaFile,
  updateMediaFile,
  deleteMediaFile,
};
