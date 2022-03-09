require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const {hashPassword, createToken} = require("./utils");

const User = require('./models/user.model')
const jwtDecode = require("jwt-decode");

const app = express();
app.user(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


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
        const savedUser = newUser.save()

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
            return res.status(400).json({message: 'There was a problem creating your acount'})
        }


    } catch (err) {
        return res.status(400).json({message: "There was a problem processing the request"})
    }

})


app.listen(8080)
