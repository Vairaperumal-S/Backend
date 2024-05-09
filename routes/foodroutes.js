// const express = require('express');
// const { addFood } = require('../controller/foodcontroller.js');
// const multer = require('multer');

// const foodRouter = express.Router();
// //Image storage engine 


// const storage=multer.diskStorage(
//     {
//         destination:"uploads",
//         filename:(req,res,cb)=>
//         {
//             return cb(null,'${Date.now()}${file.originalname}')
//         }
//     }
// )

// const upload=multer({storage:storage})

// foodRouter.post("/add",upload.single("image"),addFood)
// module.exports = foodRouter;





const express = require('express');
const foodController = require('../controller/foodcontroller.js');
const multer = require('multer');

const foodRouter = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Route for adding a new food item
foodRouter.post("/add", upload.single("image"), foodController.addFood);

module.exports = foodRouter;

