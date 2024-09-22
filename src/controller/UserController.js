const UserService = require('../services/UserService')
const JwtServiece = require('../services/JwtServiece')
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            confirmPassword,
            phone
        } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([ -. ]\w+)*\.\w+([ -. ]\w+)*$/;
        const isCheckMail = reg.test(email)
        if (!password || !confirmPassword || !email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Không được bỏ trống',
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mail nhập không đúng!',
            })
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu không khớp!',
            })
        }

        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([ -. ]\w+)*\.\w+([ -. ]\w+)*$/;
        const isCheckMail = reg.test(email)
        if (!password || !email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Không được bỏ trống',
            })
        } else if (!isCheckMail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mail nhập không đúng!',
            })
        }
        const response = await UserService.loginUser(req.body)
        const {
            refresh_token,
            ...newReponse
        } = response
        console.log('Generated refresh_token:', response);
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        return res.status(200).json({...newReponse, refresh_token})
    } catch (e) {
        console.error('Error in loginUser:', e); 
        return res.status(404).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        const {
            limit,
            page
        } = req.query
        const response = await UserService.getAllUser(limit, Number(page))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
// const refreshToken = async (req, res) => {
//     try {
//         const token = req.cookies.refresh_token
//         if (!token) {
//             return res.status(200).json({
//                 status: 'ERR',
//                 message: 'The token is required'
//             })
//         }
//         const response = await JwtServiece.refreshTokenJwtService(token)
//         return res.status(200).json(response)
//     } catch (e) {
//         return res.status(404).json({
//             message: e
//         })
//     }
// }
const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtServiece.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất thành công'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    logoutUser,
    deleteMany
}