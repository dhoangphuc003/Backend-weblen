const Product = require("../models/ProductModel")
const bcrypt = require("bcrypt")


const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description,
            discount
        } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Tên sản phẩm đã tồn tại!'
                })
            }

            const createProductnew = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                discount
            })
            if (createProductnew) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProductnew
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        const {
            name,
            image,
            type,
            price,
            countInStock,
            rating,
            description
        } = updateProduct
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'Sản phẩm không tồn tại!'
                })
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, {
                new: true
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })

            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'Sản phẩm không tồn tại!'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success!',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })

            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'Sản phẩm không tồn tại!'
                })
            }
            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Xóa thành công!',
            })
        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({
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
const getAllProduct = async (limit, page, sort, filter, type) => {
    try {
        const totalProductQuery = Product.countDocuments();

        let query = Product.find();

        // Apply type filter if provided
        if (type && type.length > 0) {
            query = query.where('type').equals(type);
        }

        // Apply filter if provided
        if (filter && filter.length > 0) {
            const [label, value] = filter;
            query = query.where(label).regex(value);
        }

        // Apply sort if provided
        if (sort && sort.length > 0) {
            const [order, field] = sort;
            query = query.sort({ [field]: order });
        }

        // Apply pagination
        if (limit) {
            query = query.limit(limit).skip(page * limit);
        }

        // Apply default sort
        query = query.sort({ createdAt: -1, updatedAt: 1 });

        // Execute the query
        const allProduct = await query.exec();

        // Calculate total products count based on type filter
        const totalProduct = await totalProductQuery;

        return {
            status: 'OK',
            message: 'Success!!',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit),
        };
    } catch (e) {
        throw e;
    }
};

const getAllType = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success!!',
                data: allType,
               
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}