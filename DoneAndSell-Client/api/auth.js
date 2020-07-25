import client from "./client";

const login = (email, password) => client.post("/login", { email, password });

const upload = async (imagesArray) => {
  let imageUrls = [];

  let i = 0;

  for (i = 0; i < imagesArray.length; i++) {
    let splittedArray = imagesArray[i].split("/");
    let imageName = splittedArray[splittedArray.length - 1];

    const uri =
      Platform.OS === "android"
        ? imagesArray[i]
        : imagesArray[i].replace("file://", "");
    const type = "image/" + `${imagesArray[i].substr(imagesArray.length - 3)}`;
    const name = imageName;
    const source = { uri, type, name };

    const data = new FormData();
    data.append("file", source);
    data.append("upload_preset", "doneandsell");
    data.append("cloud_name", "shian");

    await fetch("https://api.cloudinary.com/v1_1/shian/image/upload", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progress) => {
        onUploadProgress(progress.loaded / progress.total);
      },
    })
      .then(async (res) => res.json())
      .then((data) => {
        imageUrls = [...imageUrls, data.url];
      })
      .catch((err) => {
        console.log("Failed to upload. Error: ", err);
        return;
      });
  }

  return imageUrls;
};

const register = async (userInfo) => {
  let newUser = null;
  const imageUrlArray = await upload(userInfo.image);

  newUser = {
    imageUrl: imageUrlArray[0],
    name: userInfo.name,
    email: userInfo.email,
    password: userInfo.password,
  };
  return client.post("/register", newUser);
};

export default {
  login,
  register,
};
