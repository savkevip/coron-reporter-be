const { noReplyEmail, templateIds } = require("../utils/templates");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
// const sgMail = require("@sendgrid/mail");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.put("/update", auth, async (req, res, next) => {
    try {
        const { details, symptoms, chronic } = req.body;
        const token = req.headers.authorization;
        const _id = jwt.verify(token, process.env.SECRET_KEY)._id;
        if (!_id) return res.status(401).send("Bad token.");

        const updatedUser = await User.findOneAndUpdate(
            { _id },
            { symptoms },
            { new: true }
        );

        res.send(updatedUser);
    } catch (e) {
        next(e);
    }
});

router.get("/details", auth, async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const _id = jwt.verify(token, process.env.SECRET_KEY)._id;
        if (!_id) return res.status(401).send("Bad token.");

        const user = await User.findOne({ _id });
        if (!user) return res.status(400).send("This user not exist.");

        res.send(user);
    } catch (e) {
        next(e);
    }
});

router.delete("/delete", auth, async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const _id = jwt.verify(token, process.env.SECRET_KEY)._id;
        if (!_id) return res.status(401).send("Bad token.");

        const user = await User.findOne({ _id });
        if (!user) return res.status(400).send("This user not exist.");

        // const msg = {
        //     to: user.email,
        //     from: noReplyEmail,
        //     dynamic_template_data: {
        //         subject: "Deleted profile"
        //     },
        //     templateId: templateIds.permanentDelete
        // };
        //
        // await sgMail.send(msg);
        await User.deleteOne({ _id });

        res.send(true);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
