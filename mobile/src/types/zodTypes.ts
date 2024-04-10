import { z } from 'zod';
/* User validation schema */
export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g),
});
export type User = z.infer<typeof UserSchema>;

/* Login Cedential schema */
export const LoginSchema = UserSchema.pick({ email: true, password: true });
export type LoginUser = z.infer<typeof LoginSchema>;
