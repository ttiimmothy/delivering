import { z } from 'zod';

// Common validation patterns
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be less than 50 characters');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    address: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z
      .string()
      .min(1, 'ZIP code is required')
      .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Settings/Profile update schema
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  company: z.string().optional(),
  inquiryType: z.string().min(1, 'Please select an inquiry type'),
  subject: z.string().min(1, 'Subject is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Payment form schema
export const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Address schema for reusable address forms
export const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: z.string().default('US'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Restaurant form schema (for merchant registration)
export const restaurantSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cuisine: z.string().min(1, 'Cuisine type is required'),
  phone: phoneSchema,
  email: emailSchema,
  address: addressSchema,
  deliveryRadius: z
    .number()
    .min(1, 'Delivery radius must be at least 1 mile')
    .max(50, 'Delivery radius cannot exceed 50 miles'),
  deliveryFee: z
    .number()
    .min(0, 'Delivery fee cannot be negative')
    .max(20, 'Delivery fee cannot exceed $20'),
  minimumOrder: z
    .number()
    .min(0, 'Minimum order cannot be negative')
    .max(100, 'Minimum order cannot exceed $100'),
  estimatedDeliveryTime: z
    .number()
    .min(15, 'Estimated delivery time must be at least 15 minutes')
    .max(120, 'Estimated delivery time cannot exceed 120 minutes'),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

// Menu item form schema
export const menuItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z
    .number()
    .min(0.01, 'Price must be greater than 0')
    .max(1000, 'Price cannot exceed $1000'),
  category: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean().default(true),
  allergens: z.array(z.string()).optional(),
  calories: z.number().optional(),
  preparationTime: z
    .number()
    .min(1, 'Preparation time must be at least 1 minute')
    .max(60, 'Preparation time cannot exceed 60 minutes')
    .optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;
