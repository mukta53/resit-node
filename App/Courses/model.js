const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    topic: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number
    },
    location:{
        type: String,
        trim: true
    }
},{timestamps: true});

CourseSchema.index({
    topic: "text"
});

module.exports = mongoose.model('Courses', CourseSchema);