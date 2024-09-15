import { v2 as cloudinary } from 'cloudinary';

const cloudinary_config = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.cloudinary_cloud_name,
      api_key: process.env.cloudinary_api_key,
      api_secret: process.env.cloudinary_api_secret
    });
  } catch (error) {
    console.log("Error occurred for Cloudinary Configuration!!!",error);
  }
} 

export default cloudinary_config;