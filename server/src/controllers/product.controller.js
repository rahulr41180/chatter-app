
const Product1 = require("../models/product.model");

// Filtering and Sorting Resuable Functionality

class apiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }



    filtering(){
        
        console.log('this.queryString:', this.queryString)
        if(this.queryString.category === "") {
            return this;
        }
        let queryObj = {...this.queryString};
        console.log('queryObj:', queryObj)
        const excludedFields = ["page","sort","limit"];
        excludedFields.forEach((element) => delete queryObj[element]); // Delete from queryString or queryOjb
        console.log('excludedFields:', excludedFields)
        console.log('queryObj:', queryObj)
        let queryStr = JSON.stringify(queryObj);
        console.log('queryStr:', queryStr)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        console.log('queryStr:', queryStr)
        this.query.find(JSON.parse(queryStr));
        // console.log('this:', this)
        return this;
    };

    sorting(){
        if(this.queryString.sort) {
            console.log('this.queryString.sort:', this.queryString.sort)

            const sortBy = this.queryString.sort.split(",").join(" ");
            console.log('sortBy:', sortBy)

            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    };
    pagination(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 5;
        const skip = (page-1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    };
}

const getAllProduct = async (req,res,next) => {
    try {
        const features = new apiFeatures(Product1.find(), req.query).filtering().sorting().pagination();

        const products = await features.query; 

        // const products = await Product1.find().lean().exec();

        return res.status(200).json({
            products : products,
        })
    }
    catch(error) {

        return res.status(500).json({
            message : error.message
        })

    }
}


const addProduct = async (req,res,next) => {
    try {
        const product = await Product1.create(req.body);

        return res.status(201).json({
            product : product
        })
    }
    catch(error) {

        return res.status(500).json({
            message : error.message
        })

    }
}



module.exports = {
    getAllProduct,
    addProduct
}