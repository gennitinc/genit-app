import { z } from "zod";

// Accepts: empty, full URL, partial URL, or username (with or without @)
const socialLink = (platform: "linkedin" | "x" | "github" | "instagram") =>
  z
    .string()
    .trim()
    .refine(
      (val) => {
        if (!val) return true; // allow empty
        if (/^https?:\/\//.test(val)) return true; // full URL
        // Platform-specific partial URL
        if (
          platform === "linkedin" &&
          /^linkedin\.com\/in\/[a-zA-Z0-9-]{3,100}$/.test(val)
        )
          return true;
        if (
          platform === "x" &&
          /^(x\.com|twitter\.com)\/[A-Za-z0-9_]{1,15}$/.test(val)
        )
          return true;
        if (
          platform === "github" &&
          /^github\.com\/[A-Za-z0-9-]{1,39}$/.test(val)
        )
          return true;
        if (
          platform === "instagram" &&
          /^instagram\.com\/[A-Za-z0-9_.]{1,30}$/.test(val)
        )
          return true;
        // Username (with or without @)
        if (platform === "linkedin" && /^[a-zA-Z0-9-]{3,100}$/.test(val))
          return true;
        if (platform === "x" && /^@?[A-Za-z0-9_]{1,15}$/.test(val)) return true;
        if (platform === "github" && /^[A-Za-z0-9-]{1,39}$/.test(val))
          return true;
        if (platform === "instagram" && /^@?[A-Za-z0-9_.]{1,30}$/.test(val))
          return true;
        return false;
      },
      { message: "Enter a valid link or username" }
    );

export const ProfileSchema = z.object({
  username: z.string().min(1, "Name is required").max(50, "Name too long"),
  metadata: z
    .object({
      coverPhotoUrl: z
        .union([z.string().nullable(), z.instanceof(File)])
        .optional(),
      userdp: z.union([z.string().nullable(), z.instanceof(File)]).optional(),
      coverImagePreview: z.string().optional(),
      userdpPreview: z.string().optional(),
      isCreator: z.boolean().optional(),
      about: z
        .string()
        .max(500, "About must be 500 characters or less")
        .nullable()
        .optional(),
      socials: z
        .object({
          linkedin: socialLink("linkedin").nullable().optional(),
          x: socialLink("x").nullable().optional(),
          github: socialLink("github").nullable().optional(),
          instagram: socialLink("instagram").nullable().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;
