const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const diary = require('./entry-schema.js');
const bcrypt = require('bcryptjs');
const Usermodel = require('./User-schema.js');
const jwt = require('jsonwebtoken')

//Connecting to server(change username,password and db name after .net/ after copying from mongoose website)
mongoose.connect("mongodb+srv://archana:mean@cluster0.bplavpq.mongodb.net/diarydb").then(() => {
    console.log("Mongoose Connected")
}).catch(() => {
    console.log("Mongoose not connected")
})

//Dummy data (when mongoose not used)
// diaryEntries = [
//     { "id": 1, "date": "1st Jan 2024", "entry": "Diary on 1hhh Jan" },
//     { "id": 2, "date": "31st Jan 2026", "entry": "Diary on 31st  Jan" },
//     { "id": 3, "date": "11th Jan 2024", "entry": "Diary on 11th Jan" },
// ]
diaryEntries = [];

//Used for Posting Data
app.use(bodyparser.json());
//Resolving CORS error --next() is used to move to next command
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"),
        res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization"),
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    next();
})


//GET URL
app.get('/getEntries', (req, res, next) => {
    diary.find().then((data) => {
        res.json({ 'diary_Entries': data })
        // res.send(diaryEntries)
    }).catch((err)=>res.status(500).json({
        "error":err
    }))
})
/**Getting Id for Post entry (when not using Mongodb)
// app.get('/getid', (req, res, next) => {
//     var entryid = 0;
//     for (let i = 0; i < diaryEntries.length; i++) {
//         if (diaryEntries[i].id > entryid) {
//             entryid = diaryEntries[i].id;
//         }
//     }
//     res.status(200).json({ 'entryid': entryid })
// })

**/


//POST URL
app.post('/postEntry', (req, res, next) => {
        try {
            const token = req.headers.authorization;
            jwt.verify(token, "secret_string");
            next();
        }
        catch (err) {
            res.status(401).json({
                "Msg": "Error with Token Authentication"
            })
        }
    
    } ,(req, res, next) => {
    const entry = new diary({ date: req.body.date, entry: req.body.entry });
    //console.log(entry)
    entry.save().then(() => {
        // diaryEntries.push({ id: req.body.id, date: req.body.date, entry: req.body.entry })
        res.status(200).json({ 'message': "Entry Posted" })
    })
})


//Delete URL
app.delete('/deleteEntry/:id', (req, res, next) => {
    diary.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({ 'msg': "Entry Deleted" })
    })
    // const index = diaryEntries.findIndex((item) => item.id == req.params.id)
    // diaryEntries.splice(index, 1);
})

//PUT URL 
app.put('/editEntry/:id', (req, res, next) => {
    // const index = diaryEntries.findIndex((item) => item.id == req.params.id)
    // diaryEntries[index] = { id: req.body.id, date: req.body.date, entry: req.body.entry }
    const updatedEntry = { _id: req.params.id, date: req.body.date, entry: req.body.entry }
    diary.updateOne({ _id: req.params.id }, updatedEntry).then(() => {
        res.status(200).json({ 'msg': 'Entry Updated' })

    })
})

//Sign-up
app.post('/sign-up', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new Usermodel({
            username: req.body.username,
            password: hash
        })
        user.save().then((result) => {
            res.status(201).json({
                msg: "User Created",
                result: result
            })
        }).catch((err) => res.status(500).json({
            err: err?.errors

        }))
    })
})
//Sign In
app.post('/login', (req, res, next) => {
    let userfound;
    Usermodel.findOne({ username: req.body.username }).then((user) => {
        if (!user) {
          return  res.status(401).json({
                "msg": "Username does not exist"
            })
        }
        userfound = user;
        return bcrypt.compare(req.body.password, user.password).then((response) => {
            if (!response) {
                res.status(401).json({
                    "msg": "Password not matched"
                })
            }
            const jwttoken = jwt.sign({ username: userfound.username, userId: userfound._id }, "secret_string", { expiresIn: "1h" })
            return res.status(200).json({
                "token": jwttoken,
                "expiresIn":3600,
                "user":userfound.username
            })

        }).catch((err) => {
            return res.status(500).json({
                "err": err.statusText
            })
        })
    })

})

module.exports = app;