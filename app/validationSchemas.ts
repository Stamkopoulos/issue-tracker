import { z } from "zod";

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  description: z.string().min(1, "Description is required."),
});

export const updateIssueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255).optional(),
  description: z.string().min(1, "Description is required.").optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
});
