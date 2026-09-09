import multer from "multer";
import path from "path";
import fs from "fs";

const createUpload = (
  folder,
  maxFiles = 2
) => {
  const uploadDir = `uploads/${folder}`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
      recursive: true,
    });
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },

    filename(req, file, cb) {
      const extension =
        path.extname(
          file.originalname
        );

      cb(
        null,
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`
      );
    },
  });

  const fileFilter = (
    req,
    file,
    cb
  ) => {
    if (
      file.mimetype.startsWith(
        "image/"
      )
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed"
        )
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize:
        5 * 1024 * 1024,
      files: maxFiles,
    },
  });
};


/*
|--------------------------------------------------------------------------
| Existing requirements upload
|--------------------------------------------------------------------------
*/

export const upload =
  createUpload(
    "requirements",
    2
  );


/*
|--------------------------------------------------------------------------
| Maintenance upload
|--------------------------------------------------------------------------
*/

export const uploadMaintenance =
  createUpload(
    "maintenance",
    2
  );