const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    acceptedTermsAndConditions: {
        type: Boolean,
        required: true
    },
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
    details: {
        gender: {
            type: String,
            enum: ["male", "female"]
        },
        pregnancy: {
            type: Boolean
        },
        month: {
            type: String
        },
        age: {
            type: String
        },
        areas: {
            type: Boolean
        },
        contact: {
            type: Boolean
        },
        smoke: {
            type: Boolean
        },
        surgery: {
            type: Boolean
        },
        sense: {
            type: Boolean
        },
        diarrhea: {
            type: Boolean
        },
        heartDiseases: {
            type: Boolean
        },
        cancer: {
            type: Boolean
        },
        height: {
            type: String
        },
        weight: {
            type: String
        },
        zipCode: {
            type: String
        }
    },
    symptoms: {
        temperature: {
            type: Boolean
        },
        cough: {
            type: Boolean
        },
        chestPain: {
            type: Boolean
        },
        soreThroat: {
            type: Boolean
        },
        fever: {
            type: Boolean
        },
        heavyBreathing: {
            type: Boolean
        },
        headache: {
            type: Boolean
        }
    },
    chronic: {
        diabetes: {
            type: Boolean
        },
        asthma: {
            type: Boolean
        },
        copd: {
            type: Boolean
        },
        highBloodPressure: {
            type: Boolean
        },
        tumor: {
            type: Boolean
        },
        other: {
            type: Boolean
        },
        disease: {
            type: String
        }
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
