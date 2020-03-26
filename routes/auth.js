// const { noReplyEmail, templateIds } = require("../utils/templates");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Cryptr = require("cryptr");
// const sgMail = require("@sendgrid/mail");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cryptr = new Cryptr(process.env.CRYOTO_SECRET_KEY);

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = validate({ email, password }, schemaLogin);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ details: { email } });
        if (!user) return res.status(400).send("Invalid email.");

        const decryptedPassword = cryptr.decrypt(user.password);
        if (decryptedPassword !== password)
            return res.status(400).send("Invalid password.");

        const token = user.generateAuthToken();
        res.send({ token, role: user.role });
    } catch (e) {
        next(e);
    }
});

router.post("/register", async (req, res, next) => {
   try {
       const { email, password, acceptedTermsAndConditions } = req.body;

       const { error } = validate({ email, password }, schemaUser);
       if (error) return res.status(400).send(error.details[0].message);

       const user = await User.findOne({ details: { email } });
       if (user) return res.status(400).send("Email already in usage.");

       if (!acceptedTermsAndConditions)
           return res.status(400).send("Please accept terms and conditions.");

       const encryptedPassword = cryptr.encrypt(password);
       const details = {
           ...req.body.details,
           password: encryptedPassword
       };
       const data = {
           ...req.body,
           details
       };

       const newUser = await User.create(data);
       const token = newUser.generateAuthToken();

       // const msg = {
       //     to: email,
       //     from: noReplyEmail,
       //     dynamic_template_data: {
       //         subject: "Dobrododošli",
       //         buttonUrl: `https://www.google.com`,
       //     },
       //     templateId: templateIds.welcome
       // };

       // await sgMail.send(msg);

       res.send({ token, role: newUser.role });
   } catch (e) {
       next(e)
   }
});

router.post("/forgot-password", async (req, res, next) => {
    try {
        const { email } = req.body;
        const { error } = validate({ email }, schemaForgot);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ details: { email } });
        if (!user) return res.status(400).send("You are not still register.");

        // 6 digit random password
        const newPassword = Math.floor(100000 + Math.random() * 900000);

        // const msg = {
        //     to: email,
        //     from: noReplyEmail,
        //     dynamic_template_data: {
        //         subject: "Forgot password",
        //         password: newPassword
        //     },
        //     templateId: templateIds.forgotPassword
        // };

        const encryptedPassword = cryptr.encrypt(newPassword);

        await User.findOneAndUpdate(
            { email },
            { details: { password: encryptedPassword } },
            { new: true }
        );

        // await sgMail.send(msg);
        res.send(true);
    } catch (e) {
        next(e);
    }
});

router.post("/change-password", auth, async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const _id = jwt.verify(token, process.env.SECRET_KEY)._id;
        if (!_id) return res.status(401).send("Bad token.");

        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).send("New password is required.");

        const password = cryptr.encrypt(newPassword);
        const data = { _id, details: { password } };

        await User.findOneAndUpdate({ _id }, { ...data }, { new: true });

        res.send(true);
    } catch (e) {
        next(e);
    }
});

const schemaLogin = {
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
    password: Joi.string().min(5).required()
};

const schemaUser = {
    acceptedTermsAndConditions: Joi.boolean().requred(),
    details: {
        gender: Joi.string().required(),
        pregnancy: Joi.boolean().required(),
        month: Joi.string().allow(''),
        age: Joi.string().required(),
        areas: Joi.boolean().required(),
        contact: Joi.boolean().required(),
        smoke: Joi.boolean().required(),
        surgery: Joi.boolean().required(),
        sense: Joi.boolean().required(),
        diarrhea: Joi.boolean().required(),
        heartDiseases: Joi.boolean().required(),
        cancer: Joi.boolean().required(),
        height: Joi.string().required(),
        weight: Joi.string().required(),
        zipCode: Joi.string().required(),
        email: Joi.string()
            .email({ minDomainAtoms: 2 })
            .required(),
        password: Joi.string().min(5).required()
    },
    symptoms: {
        temperature: Joi.boolean().required(),
        cough: Joi.boolean().required(),
        chestPain: Joi.boolean().required(),
        soreThroat: Joi.boolean().required(),
        fever: Joi.boolean().required(),
        heavyBreathing: Joi.boolean().required(),
        headache: Joi.boolean().required()
    },
    chronic: {
        diabetes: Joi.boolean().required(),
        asthma: Joi.boolean().required(),
        copd: Joi.boolean().required(),
        highBloodPressure: Joi.boolean().required(),
        tumor: Joi.boolean().required(),
        other: Joi.boolean().required(),
        disease: Joi.string().allow('')
    }
};

const schemaForgot = {
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
};

module.exports = router;
