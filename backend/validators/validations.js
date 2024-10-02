const z = require('zod');

const registrationSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username should be of minimum 3 characters')
    .max(255, 'Username should be of maximum 255 characters'),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password should be of minimum 6 characters')
    .max(255, 'Password should be of maximum 255 characters'),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z.string({
    required_error: 'Password is required',
  }),
});

module.exports = { registrationSchema, loginSchema };
