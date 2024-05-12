const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = 5000;
app.use(cors());
app.use(express.static('uploads'))
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'signup'
})

db.connect((err)=>
{
    if(err)
        {
            console.error('Error executing to mysql:',err);
            return ;
        }
        else{
               console.log('Connected to mysql')
        }
})

const createrestaurant =`CREATE TABLE IF NOT EXISTS Restaurant
(
    Restaurant_id INT PRIMARY KEY,
    Restaurant_name VARCHAR(255) NOT NULL,
    Restaurant_address VARCHAR(255) NOT NULL,
    Phone_num VARCHAR(255) NOT NULL
) `;

db.query(createrestaurant,(err,result)=>
{
    if(err)
        {

            console.log('Error creating resaturant table:',err)
            return;
        }
        else{
            console.log('Restaurant table created succesfully')
        }
})


const alter=`ALTER TABLE IF NOT EXISTS Restaurant ADD COLUMN Res_img VARCHAR(255) NOT NULL`;

db.query(alter,(err,res)=>
{
    if(err)
        {
            console.log('Error while add column in Restaurant table');
            return 
        }
        else{
            console.log('Image column successfully added in Restaurant table ')
        }
})

const storage=multer.diskStorage(
    {
        destination:"uploads",
        filename:(req,file,cb)=>
            {
                cb(null,`${Date.now()}-${file.originalname}`);
            }
    }
)


const upload=multer({storage:storage})

app.post('/add',upload.single('Res_img'),(req,res)=>
{
    const {Restaurant_id,Restaurant_name,Restaurant_address,phone_num}=req.body;
    const Res_img=req.file.filename;
    const insertquery='INSERT INTO Restaurant (Restaurant_id,Restaurant_name,Restaurant_address,phone_num,Res_img)VALUES(?,?,?,?,?)'
    db.query(insertquery,[Restaurant_id,Restaurant_name,Restaurant_address,phone_num,Res_img],(err,result)=>
        {
          if(err)
            {
                console.error('Error adding Restaurant:',err)
                return res.status(500).json({error:'Internal server error '})

            }
            res.status(200).json({success:true,message:'Restaurant added successfully'})
        }
    

    )
})

app.get('/listres',(req,res)=>
{
    const listrestaurant=`SELECT * FROM Restaurant`;
    db.query(listrestaurant,(err,rows)=>
    {
        if(err)
            {
                console.log('error listing Restaurant:',err);
                return res.status(500).json({error:'Internal server error'})
            }
            res.status(200).json({success:true,data:rows})
    })
})


app.get('/selectres/:id',(req,res)=>
{
    const Imageid=req.params.id;
    const selectquery=`SELECT Res_img from Restaurant where Restaurant_id=?`;
    db.query(selectquery,[Imageid],(err,rows)=>
    {
        if(err)
            {
                console.log('error  selecting restaurant',err);
                return res.status(500).json({error:'Internal server error'})
            }

        if(!rows ||rows.length===0)
            {
                return res.status(404).json({error:'Restaurant not found'})
            }

            const imagedata=rows[0].Res_img;
            return res.status(200).json({success:true,data:rows})
    })
})



    app.delete('/removeres/:id',(req,res)=>
    {

        const resid =req.params.id;
        const removerestaurant=`DELETE FROM Restaurant where Restaurant_id=? `;
        const getimagefilename=`SELECT Res_img from Restaurant where Restaurant_id=?`

        db.query(getimagefilename,[resid],(err,result)=>
            {
                if(err)
                    {
                        console.error('Error retrieving image filename',err)
                        return res.status(500).json({error:'Internal server error'})
                    }

                    if(result.length===0)
                        {
                            return res.status(404).json({error:'Restauarnt not found'})
                        }

                 const imagefilename=result[0].Res_img;

                 db.query(removerestaurant,[resid], (err, result) => {
                    if (err) {
                        console.error('Error removing food:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
        
                    if (result.length === 0) {
                        return res.status(404).json({ error: 'Food item not found' });
                    }
                    const imagePath=path.join(__dirname,'uploads',imagefilename);
                    fs.unlink(imagePath,(err)=>
                    {
                       if(err)
                        {
                            console.error('Error deleting image file:',err);

                        }

                    })

                    return  res.status(200).json({success:true,message:'Restaurant removed successfully'
                    })

            })

    })

})
app.listen(PORT,()=>
{
   console.log(`Server running at port ${PORT}`)
})