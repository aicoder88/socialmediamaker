export const PLATFORM_CHARACTER_LIMITS = {
  facebook: 500,
  linkedin: 1300,
  twitter: 280,
  instagram: 2200,
  blog: 5000,
} as const;

export type PlatformType = keyof typeof PLATFORM_CHARACTER_LIMITS;

export const PLATFORM_CONFIG = {
  facebook: {
    name: "Facebook",
    gradient: "from-blue-600 to-blue-700",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400",
    color: "bg-blue-600",
  },
  linkedin: {
    name: "LinkedIn",
    gradient: "from-blue-700 to-blue-800",
    bgColor: "bg-blue-700/10",
    borderColor: "border-blue-600/30",
    textColor: "text-blue-300",
    color: "bg-blue-700",
  },
  twitter: {
    name: "Twitter",
    gradient: "from-sky-500 to-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-400/30",
    textColor: "text-sky-300",
    color: "bg-sky-500",
  },
  instagram: {
    name: "Instagram",
    gradient: "from-pink-600 to-purple-600",
    bgColor: "bg-pink-600/10",
    borderColor: "border-pink-500/30",
    textColor: "text-pink-300",
    color: "bg-pink-600",
  },
  blog: {
    name: "Blog",
    gradient: "from-emerald-600 to-green-600",
    bgColor: "bg-emerald-600/10",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-300",
    color: "bg-emerald-600",
  },
} as const;
