 const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = 4000;
app.use(cors());
app.use(express.static('uploads'))

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});



const createFoodTableQuery = `
    CREATE TABLE IF NOT EXISTS menuitem (
        _id INT   PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL
    )
`;


db.query(createFoodTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating menuitem table:', err);
        return;
    }
    console.log('Food table created successfully');
});



const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});




const upload = multer({ storage: storage });


app.post('/add', upload.single('image'), (req, res) => {
    const { _id,Restaurent_id,name, description, price, category } = req.body;
    const image = req.file.filename;

    const insertFoodQuery = `
        INSERT INTO menuitem (_id,Restaurent_id,name, description, price, image, category) 
        VALUES (?, ?, ?, ?, ?,?,?)
    `;
    db.query(insertFoodQuery, [_id,Restaurent_id,name, description, price, image, category], (err, result) => {
        if (err) {
            console.error('Error adding food:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ success: true, message: 'Food added successfully' });
    });
});



app.get('/list',(req,res)=>
{
    const listFood=`SELECT * FROM menuitem`;
    db.query(listFood,(err,rows)=>
{
    if(err)
    {
        console.log('error listing food:',err);
        return res.status(500).json({error:'Internal server error'})
    }


  
    res.status(200).json({success:true,data:rows})
})
})


app.get('/select/:_id',(req,res)=>
{
    const imageId=req.params._id;
    
    const selectquery=`SELECT image FROM menuitem where _id=?`
       
    db.query(selectquery,[imageId],(err,rows)=>
{
    if(err)
    {
        console.log('error selecting food',err)  
    {
        return res.status(500).json({error:'Internal server error'})
    }  }

    if (rows.affectedRows === 0) {
        return res.status(404).json({ error: 'Food item not found' });
    }

    const imageData=rows[0].image;
  
    res.status(200).json({success:true,data:rows})
})
})


//removing food

app.delete('/remove/:_id', (req, res) => {
    const foodId = req.params._id;

    const deletequery = `DELETE FROM menuitem WHERE _id = ?`;


    const getImageFilename = `SELECT image FROM menuitem WHERE _id = ?`;

    db.query(getImageFilename, [foodId], (err, result) => {
        if (err) {
            console.error('Error retrieving image filename:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        const imageFilename = result[0].image;

      
        db.query(deletequery, [foodId], (err, result) => {
            if (err) {
                console.error('Error removing food:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Food item not found' });
            }

            
            const imagePath = path.join(__dirname, 'uploads', imageFilename);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                    
                }
                
                res.status(200).json({ success: true, message: 'Food item and corresponding image deleted successfully' });
            });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});


