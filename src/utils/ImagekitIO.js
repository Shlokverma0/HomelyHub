import "dotenv/config";
import ImageKit from "imagekit";

let client;

const getClient = () => {
  const { IMAGEKIT_PUBLICKEY, IMAGEKIT_PRIVATEKEY, IMAGEKIT_URLENDPOINT } =
    process.env;
  if (!IMAGEKIT_PUBLICKEY || !IMAGEKIT_PRIVATEKEY || !IMAGEKIT_URLENDPOINT) {
    throw new Error("ImageKit is not configured. Add its keys to the backend .env file.");
  }

  client ??= new ImageKit({
    publicKey: IMAGEKIT_PUBLICKEY,
    privateKey: IMAGEKIT_PRIVATEKEY,
    urlEndpoint: IMAGEKIT_URLENDPOINT,
  });
  return client;
};

const imagekit = {
  upload: (options) => getClient().upload(options),
};

export default imagekit;
