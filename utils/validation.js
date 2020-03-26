const schemaLogin = {
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required(),
    password: Joi.string().min(5).required()
};

const schemaUser = {
    acceptedTermsAndConditions: Joi.boolean().required(),
    details: Joi.object({
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
    }),
    symptoms: Joi.object({
        temperature: Joi.boolean().required(),
        cough: Joi.boolean().required(),
        chestPain: Joi.boolean().required(),
        soreThroat: Joi.boolean().required(),
        fever: Joi.boolean().required(),
        heavyBreathing: Joi.boolean().required(),
        headache: Joi.boolean().required()
    }),
    chronic: Joi.object({
        diabetes: Joi.boolean(),
        asthma: Joi.boolean(),
        copd: Joi.boolean(),
        highBloodPressure: Joi.boolean(),
        tumor: Joi.boolean(),
        other: Joi.boolean(),
        disease: Joi.string().allow('')
    })
};

const schemaForgot = {
    email: Joi.string()
        .email({ minDomainAtoms: 2 })
        .required()
};

module.exports = {
    schemaUser, schemaLogin, schemaForgot
};
