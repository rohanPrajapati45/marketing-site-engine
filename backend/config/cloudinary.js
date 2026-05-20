import { v2 as cloudinary } from 'cloudinary';

// With ES modules, all imports are hoisted and executed before
// any top-level code (like dotenv.config()) in app.js runs.
// So we export a lazy getter that configures on first use,
// ensuring env vars are available by the time it's called.

let configured = false;

function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
  return cloudinary;
}

export default getCloudinary;
