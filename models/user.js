const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    acceptedTermsAndConditions: {
        type: Boolean,
        required: true
    },
    symptoms: {
        type: Object
    }
});

schema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, role: this.role }, process.env.SECRET_KEY);
};

const User = mongoose.model('User', schema);

function validate(data, schema) {
    return Joi.validate(data, schema);
}

exports.User = User;
exports.validate = validate;
