import z from "zod";

export const registerSchema = z.object({
    name:z.string().min(2,{message:"name is minnimum 2 char"}),
    email:z.string().email({message:"invalid email format"}),
    password:z.string().min(6,{message:"password is min 6 char"})
})

export const verifyuser = z.object({
  email: z.string().email({ message: "not valid email format" }),
});

export const loginSchema = z.object({
    email:z.string().email({message:"not valid email format"}),
    password:z.string().min(6,{message:"min 6 char is nedded in password"})
})

export const forgotPasswordSchema = z.object({
    email:z.string().email({message:"not valid email format"}),
    otp:z.string().min(6,{message:"otp is required"}),
    password:z.string().min(6,{message:"min 6 char is nedded in password"}),
    confirmPassword:z.string().min(6,{message:"min 6 char nedded in password"}),
})

export const checkAvailabilitySchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time slot is required"),
});

export const createBookingSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  contact: z.string().min(10, "Contact is required"),
  date: z.string(),
  timeSlot: z.string(),
  plan: z.enum(["BASIC", "PREMIUM"]),
  guests: z.number().optional(),
  functionType: z.string(),
  additionalInfo: z.string().max(200).optional() // ✅ ADD THIS
});

export const bugReportSchema = z.object({
  title: z.string().min(5).max(50, "Title must be under 100 characters"),
  description: z.string().min(10).max(1000, "Description must be under 1000 characters"),
  userEmail: z.string().email("Invalid email"),
  userName: z.string().min(1, "Name is required"),
});
