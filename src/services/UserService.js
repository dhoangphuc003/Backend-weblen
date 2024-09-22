const User = require("../models/UserModel")
const bcrypt = require("bcrypt")
const {
    genneralAccessToken,
    genneralRefreshToken
} = require("./JwtServiece")


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            email,
            password,
            phone
        } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email đã tồn tại!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)

            const createUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const loginUser = (UserLogin) => {

    return new Promise(async (resolve, reject) => {
        const {
            email,
            password
        } = UserLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản không tồn tại!'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Tài khoản hoặc mật khẩu sai'
                })
            }
            
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            email,
            password,
            isAdmin,
            phone
        } = updateUser
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'Tài khoản không tồn tại!'
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, {
                new: true
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'Tài khoản không tồn tại!'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Xóa thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({
                _id: ids
            })
            resolve({
                status: 'OK',
                message: 'Xóa thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllUser = (limit = 5, page = 0) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'Success!!',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getDetailUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })

            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'Tài khoản không tồn tại!'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success!',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    deleteManyUser
}