import { z } from 'zod';
export const registerSchema=z.object({name:z.string().min(2).max(100),mobile:z.string().min(6).max(20),password:z.string().min(6).max(100),email:z.string().email().optional().or(z.literal(''))});
export const loginSchema=z.object({mobile:z.string().min(1),password:z.string().min(1)});
