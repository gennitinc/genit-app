export const formatSocialLink = (platform: string, value: string) => {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  switch (platform) {
    case "linkedin":
      if (value.startsWith("linkedin.com")) return `https://${value}`;
      return `https://linkedin.com/in/${value.replace(/^@/, "")}`;
    case "x":
      if (value.startsWith("x.com") || value.startsWith("twitter.com"))
        return `https://${value}`;
      return `https://x.com/${value.replace(/^@/, "")}`;
    case "github":
      if (value.startsWith("github.com")) return `https://${value}`;
      return `https://github.com/${value.replace(/^@/, "")}`;
    case "instagram":
      if (value.startsWith("instagram.com")) return `https://${value}`;
      return `https://instagram.com/${value.replace(/^@/, "")}`;
    default:
      return value;
  }
};
