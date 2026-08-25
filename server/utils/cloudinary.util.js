import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// export const uploadSingleImage = async (filePath) => {
//   try {
//     const response = await cloudinary.uploader.upload(filePath, {
//       folder: "uploads",
//       resource_type: "auto",
//     });

//     // delete locally :
//     fs.unlinkSync(filePath);

//     return response;
//   } catch (error) {
//     console.error("error", error);
//   }
// };

export const uploadSingleImage = async (filePath) => {
  try {
    const response = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      resource_type: "auto",
    });

    // Delete local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return response;
  } catch (error) {
    // 1. Log the entire error object to your terminal
    console.error("--- CLOUDINARY UPLOAD ERROR START ---");
    console.error(error);
    console.error("--- CLOUDINARY UPLOAD ERROR END ---");

    // 2. Safely clean up the local file even if the upload failed
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkError) {
        console.error("Failed to delete local file:", unlinkError);
      }
    }

    // 3. CRITICAL: Throw the error so your controller can catch it
    throw error;
  }
};

export const deleteCloudinaryImage = async (public_id) => {
  console.log("deleted", public_id);
  return cloudinary.uploader.destroy(public_id);
};

export default cloudinary;
