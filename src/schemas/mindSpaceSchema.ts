import z from "zod";

export const thoughtSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  desc: z.string().min(1, "Description is required"),
  occurredAt: z.string("Occured Date is required"),
  createdAt: z.string("Date is required").optional(),
  lastModified: z.string("Date is required").optional(),
  readsAt: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type ThoughtSchema = z.infer<typeof thoughtSchema>;
