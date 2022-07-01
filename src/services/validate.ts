import Joi, { ObjectSchema } from 'joi'

const registerSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
})

const loginSchema = Joi.object({
  email: Joi.string().min(6).email().required(),
  password: Joi.string().min(6).required(),
})

function validator(schema: ObjectSchema<any>) {
  return async (payload: any) =>
    await schema.validateAsync(payload, { abortEarly: false }).catch((error) => {
      throw error
    })
}

export const validateRegister = validator(registerSchema)
export const validateLogin = validator(loginSchema)
