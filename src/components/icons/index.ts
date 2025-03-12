"use client";

import { LucideIcon } from "lucide-react";
import { ComponentType, SVGProps } from "react";

// loaders
export * from "./loading-circle";
export * from "./loading-dots";
export * from "./loading-spinner";

// brand logos
export * from "./tiktok";
export * from "./twitter";
export * from "./youtube";

export type Icon = LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
