// const foodmodel = require('../Models/food-models');
// const fs = require('fs');


// const addFood = async (req, res) => {
//     const { name, description, price, category } = req.body;
//     const image_filename = req.filename;
  
//     const sql = `INSERT INTO foods (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;
//     const values = [name, description, price, category, image_filename];
  
//     connection.query(sql, values, (err, result) => {
//       if (err) {
//         console.error('Error inserting food:', err);
//         res.json({ success: false, message: 'Error inserting food' });
//         return;
//       }
//       console.log('Food inserted successfully');
//       res.json({ success: true, message: 'Food added' });
//     });
//   };
  

// module.exports = { addFood };


const foodmodel = require('../Models/food-models');
const fs = require('fs');


const addFood = async (req, res) => {
    const { name, description, price, category } = req.body;
    const image_filename = req.filename;
  
    const sql = `INSERT INTO foods (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)`;
    const values = [name, description, price, category, image_filename];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting food:', err);
        res.json({ success: false, message: 'Error inserting food' });
        return;
      }
      console.log('Food inserted successfully');
      res.json({ success: true, message: 'Food added' });
    });
  };
  

module.exports = { addFood };

