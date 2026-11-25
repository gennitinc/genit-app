"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Language, languages } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSelect({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const { language, setLanguage, t } = useLanguage();
  const selected = languages.find(({ code }) => code === language)!;

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger
        className={cn(iconOnly ? "w-auto gap-1.5 px-2" : "w-[9.5rem]", className)}
        aria-label={t("Language")}
      >
        <SelectValue>
          {iconOnly ? (
            <span aria-hidden='true' className='text-base leading-none'>
              {selected.flag}
            </span>
          ) : (
            <span className='flex items-center gap-2'>
              <span aria-hidden='true'>{selected.flag}</span>
              <span>{selected.label}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align={iconOnly ? "end" : "start"}>
        {languages.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            <span className='flex items-center gap-2'>
              <span aria-hidden='true'>{item.flag}</span>
              <span>{item.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
