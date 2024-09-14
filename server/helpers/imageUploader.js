import cloudinary from '../config/cloudinary.config.js';
import fs from 'fs';

/**
 * Uploads an image to Cloudinary into a specific folder and returns the image URL.
 * @param {string} filePath - Path to the file on disk.
 * @param {string} folderName - Name of the folder where the image should be stored.
 * @returns {Promise<string>} - The URL of the uploaded image.
 */
export default async function uploadImage(filePath, folderName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, 
      {
        folder: folderName // Specify the folder name
      }, 
      (error, result) => {
        if (error) {
          return reject(error);
        }

        // Delete the file after uploading
        fs.unlink(filePath, (err) => {
          if (err) console.error('Failed to delete file:', err);
        });

        // Return the URL of the uploaded image
        resolve(result.secure_url);
      }
    );
  });
}
