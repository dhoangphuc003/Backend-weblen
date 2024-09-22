const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Token missing or invalid',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}
const authUserMiddleware = (req, res, next) => {
    const authHeader = req.headers.token;
    // console.log('authHeader', authHeader)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Token missing or invalid',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    });
}



module.exports = {
    authMiddleware,authUserMiddleware
}