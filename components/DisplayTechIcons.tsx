"use client";
import React, { useEffect, useState } from "react";
import { cn, getTechLogos } from "@/lib/utils";
import Image from "next/image";

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<{ tech: string; url: string }[]>([]);

  useEffect(() => {
    const loadIcons = async () => {
      const icons = await getTechLogos(techStack);
      setTechIcons(icons);
    };
    loadIcons();
  }, [techStack]);

  if (!techIcons.length) return null;

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2",
            index >= 1 && "-ml-2"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={`${tech} icon`}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
