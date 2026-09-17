import multer from "multer";
import path from "path";
import fs from "fs";

const createUpload = (
  folder,
  maxFiles = 2
) => {
  const uploadDir = path.join(
  process.cwd(),
  "uploads",
  folder
);

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
      const extension = path.extname(
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
    3
  );


/*
|--------------------------------------------------------------------------
| Trip uploads
|--------------------------------------------------------------------------
|
| Trip lifecycle has different image types:
|
| 1. Initial meter image
| 2. Destination selfie
| 3. Destination meter image
| 4. Fuel slip
| 5. Final meter image
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Trip start
|--------------------------------------------------------------------------
|
| Initial meter image
|
*/

export const uploadTripStart =
  createUpload(
    "trips/start",
    1
  );


/*
|--------------------------------------------------------------------------
| Destination evidence
|--------------------------------------------------------------------------
|
| selfie
| meterImage
|
*/

export const uploadTripEvidence =
  createUpload(
    "trips/evidence",
    2
  );


/*
|--------------------------------------------------------------------------
| Fuel slip
|--------------------------------------------------------------------------
|
| One fuel slip per upload request.
|
*/

export const uploadTripFuel =
  createUpload(
    "trips/fuel",
    1
  );


/*
|--------------------------------------------------------------------------
| Trip finalization
|--------------------------------------------------------------------------
|
| Final meter image
|
*/

export const uploadTripFinal =
  createUpload(
    "trips/final",
    1
  );