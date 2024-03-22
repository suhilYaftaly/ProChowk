import { z } from 'zod';

export interface ImageInput {
  url: string;
  name: string;
  size: number;
  type: string;
}
export interface IImage extends ImageInput {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITokens {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}

export const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g),
});

export type User = z.infer<typeof UserSchema>;
