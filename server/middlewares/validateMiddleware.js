import { validationResult } from 'express-validator';

// Middleware to check for validation errors
const validate = (endpoint) => (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ 
            success: false,
            message: `Validation for ${endpoint} Failed!!!`,
            errors: errors.array() 
        });
    }
    next();
};

export default validate;