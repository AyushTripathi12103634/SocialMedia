import { body, check } from 'express-validator';

// Validation rules for registration
export const registerValidation = [
    body('username')
        .isString()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters long.')
        .escape()
        .notEmpty()
        .withMessage('Username is required.'),
    body('password')
        .isString()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters long.')
        .matches(/(?=.*[a-z])/, 'i')
        .withMessage('Password must contain at least one lowercase letter.')
        .matches(/(?=.*[A-Z])/, 'i')
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/(?=.*\d)/)
        .withMessage('Password must contain at least one digit.')
        .matches(/(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/\\])/)
        .withMessage('Password must contain at least one special character.')
        .escape()
        .notEmpty()
        .withMessage('Password is required.'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format.')
        .escape()
        .notEmpty()
        .withMessage('Email is required.'),
    body('name')
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Name is required.'),
];

// Validation rules for login
export const loginValidation = [
    body('username')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Username is required'),
    body('email')
        .optional()
        .isString()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format.')
        .notEmpty()
        .withMessage('Email is required'),
        check().custom((value, { req }) => {
        const { username, email } = req.body;
        if (!username && !email) {
            throw new Error('At least one of email or username is required.');
        }
        return true;
    }),
    body('password')
        .isString()
        .notEmpty()
        .withMessage('Password is required.')
];
