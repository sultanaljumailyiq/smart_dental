import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Tag, Percent, Gift, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromoCardProps {
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  gradient: string;
  icon: "tag" | "percent" | "gift" | "zap";
  className?: string;
}

const iconMap = {
  tag: Tag,
  percent: Percent,
  gift: Gift,
  zap: Zap,
};

export default function PromoCard({
  title,
  subtitle,
  buttonText,
  link,
  gradient,
  icon,
  className,
}: PromoCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <div
      className={cn(
        "relative rounded-lg md:rounded-xl overflow-hidden h-14 md:h-18 lg:h-20",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-r", gradient)} />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 h-full flex items-center justify-between p-2.5 md:p-4 lg:p-5">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
            <IconComponent className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-xs md:text-sm lg:text-base leading-tight">
              {title}
            </h3>
            <p className="text-white/90 text-xs md:text-sm hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <Link
          to={link}
          className="bg-white text-gray-800 px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-md md:rounded-lg font-medium text-xs md:text-sm hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-1 md:gap-2"
        >
          {buttonText}
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
        </Link>
      </div>
    </div>
  );
}
