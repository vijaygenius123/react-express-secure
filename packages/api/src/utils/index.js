const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const createToken = user => {
    if (!user.role) {
        throw new Error('No user role')
    }
    return jwt.sign({
            sub: user._id,
            email: user.email,
            role: user.role,
            iss: 'api.myapp',
            aud: 'api.myapp'
        },
        process.env.JWT_SECRET,
        {algorithm: 'HS256', expiresIn: '1h'})
}


const hashPassword = password => {
    return new Promise(((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) =>{
            if (err) {
                reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            })
        })
    }))
}


module.exports = {
    createToken,
    hashPassword
};
