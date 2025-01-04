import User from "../models/user-model.js";

export const userRegisterSchema = {
    username: {
        exists: {
            errorMessage: 'usernmame field required'
        },
        notEmpty: {
            errorMessage: 'username should not be empty'
        },
        trim: true
    },
    email: {
        exists: {
            errorMessage: 'Email field required'
        },
        notEmpty: {
            errorMessage: 'Email should not be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in proper format'
        },
        custom: {
            options: async (value) => {
                try {
                    const user = await User.findOne({ email: value })
                    if (user) {
                        throw new Error('Email already taken')
                    }
                } catch (err) {
                    throw new Error(err.message)
                }
                return true
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        exists: {
            errorMessage: 'Password field required'
        },
        notEmpty: {
            errorMessage: 'Password should not be empty'
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbol: 1,
                minNumber: 1
            },
            errorMessage: 'password must be contain 8 character 1 lowercase, 1 uppercase, 1 number, 1 symbol'
        },
        trim: true
    }
}

export const userLoginSchema = {
    email: {
        exists: {
            errorMessage: 'Email field required'
        },
        notEmpty: {
            errorMessage: 'Email should not be empty'
        },
        isEmail: {
            errorMessage: 'Email should be in proper format'
        },
        trim: true,
        normalizeEmail:true,
    },
    password: {
        exists: {
            errorMessage: 'Password field required'
        },
        notEmpty: {
            errorMessage: 'Password should not be empty'
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowerCase: 1,
                minUpperCase: 1,
                minSymbol: 1,
                minNumber: 1
            },
            errorMessage: 'password must be contain 8 character 1 lowercase, 1 uppercase, 1 number, 1 symbol'
        },
        trim: true
    }
}