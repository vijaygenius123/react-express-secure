require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const {hashPassword, createToken} = require("./utils");

const User = require('./models/user.model')
const jwtDecode = require("jwt-decode");
const mongoose = require("mongoose");

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.get('/api/healthcheck', (req, res) => {
    return res.status(200).json({"message": "Working"})
})

app.post('/api/authenticate', async (req, res) => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({
            email
        }).lean()

        if (!user) {
            return res.status(403).json({
                'message': 'Wrong email or password.'
            })
        }

        const passwordValid = await verifyPassword(
            password,
            user.password
        );

        if (passwordValid) {
            const {password, bio, ...rest} = user;
            const userInfo = Object.assign({}, {...rest});
            const token = createToken(userInfo);
            const decodedToken = jwtDecode(token);
            const expiresAt = decodedToken.exp;

            res.json({
                message: 'Authentication successful!',
                token,
                userInfo,
                expiresAt
            });
        } else {
            res.status(403).json({
                message: 'Wrong email or password.'
            });
        }
    } catch (err) {
        return res
            .status(400)
            .json({message: 'Something went wrong.'});
    }
})

app.post('/api/signup', async (req, res) => {

    try {
        const {email, firstName, lastName} = req.body;
        const hashedPassword = await hashPassword(req.body.password)

        const userData = {
            email: email.toLowerCase(), firstName, lastName, password: hashedPassword, role: 'admin'
        }

        const existingEmail = await User.findOne({
            email: userData.email
        }).lean()
        if (existingEmail) {
            return res.status(400).json({message: 'Email already exists'})
        }

        const newUser = new User(userData)
        const savedUser = await newUser.save()
        if (savedUser) {
            const token = createToken(savedUser)
            const decodedToken = jwtDecode(token)
            const expiresAt = decodedToken.exp
            const {firstName, lastName, email, role} = savedUser;
            const userInfo = {
                firstName, lastName, email, role
            }

            return res.json({
                message: 'User created', token, userInfo, expiresAt
            })

        } else {
            return res.status(400).json({message: 'There was a problem creating your account'})
        }


    } catch (err) {
        return res.status(400).json({message: "There was a problem processing the request"})
    }

})

async function startServer() {

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    } catch (err) {
        console.log("Error connecting to DB", err)
    }
    app.listen(process.env.PORT)
    console.log(`Server started on http://localhost:${process.env.PORT} `)
}

startServer()
