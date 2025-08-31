import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { //schad cn
  return twMerge(clsx(inputs));
}

// This file contains utility functions for handling technology logos and interview covers
const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons"; //its generated randomly from devicon CDN

// This function normalizes the technology name to match the icon naming convention used in the mappings
const normalizeTechName = (tech: string) => { 
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, ""); // Normalize tech name by removing ".js" and spaces
  return mappings[key as keyof typeof mappings]; // Use the mappings to get the correct icon name
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray && techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
