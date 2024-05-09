



const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
const cors=require('cors');
const app = express();
const foodRouter = require("./routes/foodroutes.js");


//middleware
 app.use(cors());
app.use(bodyParser.json());
//api endpoints

// app.use("/api/food",foodRouter)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup"
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

//app.use("/images",express.static('uploads'))



 

const util = require('util');
const dbQuery = util.promisify(db.query).bind(db);

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const checkEmailQuery = "SELECT * FROM user WHERE email = ?";
        
        const result = await dbQuery(checkEmailQuery, [email]);

        if (result.length > 0) {
            return res.status(401).json({ "success": false, "message": "Email already exists" });
        }

        const passwordString = typeof password === 'string' ? password : String(password);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordString, saltRounds);

        const sql = "INSERT INTO user (name, email, password, phone) VALUES (?, ?, ?, ?)";
        const values = [name, email, hashedPassword, phone];
        
        const insertResult = await dbQuery(sql, values);
        
        console.log("Records inserted:", insertResult.affectedRows);

        return res.status(201).json({
            success: true,
            message: "Signed up successfully"
        });
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
});



            
            
            












    app.post('/login', (req, res) => {
        const { email, password } = req.body;
        
        const sql = "SELECT * FROM user WHERE email = ?";
        
        db.query(sql, [email], (err, data) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return res.status(500).json({ error: "Internal server error" });
            }
    
            if (data.length === 0) {
                return res.status(404).json({ error: "User not found" });
            }
            
            const user = data[0];
            const storedPassword = user.password;
            
   
            const passwordString = typeof password === 'string' ? password : String(password);
            const storedPasswordString = typeof storedPassword === 'string' ? storedPassword : String(storedPassword);
            
            // Compare passwords
            bcrypt.compare(passwordString, storedPasswordString).then((isValid) => {
                if (!isValid) {
                    return res.status(401).json({ error: "Incorrect password" });
                }
                
                res.status(200).json({
                    success: true,
                    message: "Login successful",
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                });
            }).catch((compareError) => {
                console.error('Error comparing passwords:', compareError);
                return res.status(500).json({ error: "Internal server error" });
            });
        });
    });
    







// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
    
//     const sql = "SELECT * FROM login WHERE email = ?";
//     console.log(sql, password);
    
//     db.query(sql, [email], (err, data) => {
//         if (err) {
//             console.error('Error executing MySQL query:', err);
//             return res.status(500).json({ error: "Internal server error" });
//         }

//         if (data.length === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }
        
//         const user = data[0];
//         const storedPassword = user.password;
        
//         // Check if password and storedPassword are strings
//         if (typeof password !== 'string' || typeof storedPassword !== 'string') {
//             return res.status(400).json({ error: "Invalid password or stored password" });
//         }

//         // Compare passwords
//         bcrypt.compare(password,storedPassword).then(function(isValid){
//                         console.log(isValid)
//                         if (!isValid) {
//                             return res.status(401).json({ error: "Incorrect password" });
//                         }
                        
//                         res.status(200).json({
//                             success: true,
//                             message: "Login successful",
//                             user: {
//                                 id: user.id,
//                                 name: user.name,
//                                 email: user.email,
//                                 phone: user.phone
//                             }
//                         });
//                 });
//             })
//             .catch(compareError => {
//                 console.error('Error comparing passwords:', compareError);
//                 return res.status(500).json({ error: "Internal server error" });
//             });
//     });


app.post('/signup1',(req,res)=>
{
    console.log(req.body);
    res.status(200).json({

ok:true,
message:'successful'
    })
})

const PORT = 2000;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
