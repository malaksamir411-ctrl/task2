const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Test the server
app.get('/', (req, res) => {
    console.log('GET HOME RECEIVED');
    res.send('Student Backend API is running!');
});


// Add a new user
app.post('/user', (req, res) => {
    const { NAME, email, password, phone, user_type } = req.body;

    const sql = `
        INSERT INTO user (NAME, email, password, phone, user_type)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [NAME, email, password, phone, user_type],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Failed to add user',
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'User added successfully',
                user_id: result.insertId
            });
        }
    );
});


app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM user';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve users',
                error: err.message
            });
        }

        res.status(200).json(result);
    });
});


app.get('/user/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'SELECT * FROM user WHERE user_id  = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve user',
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(result[0]);
    });
});


app.post('/profile', (req, res) => {
    const {
        User_ID,
        University,
        Major,
        Bio,
        Graduation_Year
    } = req.body;

    const sql = `
        INSERT INTO profile
        (User_ID, University, Major, Bio, Graduation_Year)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [User_ID, University, Major, Bio, Graduation_Year],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Failed to add profile',
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Profile added successfully',
                profile_id: result.insertId
            });
        }
    );
});


app.get('/profile', (req, res) => {
    const sql = `
        SELECT
            profile.*,
            user.NAME,
            user.email
        FROM profile
        INNER JOIN user
            ON profile.User_ID = user.user_id
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: 'Failed to retrieve profiles',
                error: err.message
            });
        }

        res.status(200).json(result);
    });
});



app.get('/profile/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT
            profile.*,
            user.NAME,
            user.email
        FROM profile
        INNER JOIN user
            ON profile.User_ID = user.user_id
        WHERE profile.Profile_ID = ?
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({
                message: 'Failed to retrieve profile',
                error: err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        res.status(200).json(result[0]);
    });
});



app.post('/company', (req, res) => {
    const {
        User_ID,
        Company_Name,
        Industry,
        Location,
        Website
    } = req.body;

    const sql = `
        INSERT INTO company
        (User_ID, Company_Name, Industry, Location, Website)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [User_ID, Company_Name, Industry, Location, Website],
        (err, result) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({
                    message: 'Failed to add company',
                    error: err.message
                });
            }

            res.status(201).json({
                message: 'Company added successfully',
                company_id: result.insertId
            });
        }
    );
});




app.get('/companies', (req, res) => {
    const sql = 'SELECT * FROM company';

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Failed to retrieve companies',
                error: err.message
            });
        }

        res.status(200).json(result);
    });
});



console.log('MY SERVER VERSION 1');
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});