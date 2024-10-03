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

const updateUsernameSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username should be of minimum 3 characters')
    .max(255, 'Username should be of maximum 255 characters'),
});

const updatePasswordSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password should be of minimum 6 characters')
    .max(255, 'Password should be of maximum 255 characters'),
});

const requestPasswordResetSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
});

const questionSchema = z.object({
  question: z.string({
    required_error: 'Question is required',
  }),
  options: z
    .array(
      z.string({
        required_error: 'Option is required',
      })
    )
    .min(2, 'At least two options are required'),
  correctAnswer: z.string({
    required_error: 'Correct answer is required',
  }),
});

const quizSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
  questions: z
    .array(questionSchema)
    .nonempty('At least one question is required'),
  timeLimit: z.number({
    required_error: 'Time limit is required',
  }),
});

const questionUpdateSchema = z.object({
  question: z.string().optional(),
  _id: z.string().optional(),
  options: z
    .array(z.string().optional())
    .min(2, 'At least two options are required')
    .optional(),
  correctAnswer: z.string().optional(),
});

const quizUpdateSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required if provided',
    })
    .optional(),

  questions: z
    .array(questionUpdateSchema)
    .nonempty('At least one question is required if questions are provided')
    .optional(),

  timeLimit: z
    .number({
      required_error: 'Time limit is required if provided',
    })
    .optional(),
});


module.exports = {
  registrationSchema,
  loginSchema,
  updateUsernameSchema,
  updatePasswordSchema,
  requestPasswordResetSchema,
  quizSchema,
  quizUpdateSchema,
};
