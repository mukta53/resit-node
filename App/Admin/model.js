const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
    },
    token: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: 'Admin'
    }
},{timestamps: true});

AdminSchema.pre('save', function ( next ) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

AdminSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model('Admin', AdminSchema);