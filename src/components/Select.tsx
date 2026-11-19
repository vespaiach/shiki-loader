"use client";

import { SHIKI_THEMES } from "@/shiki-loader/themes";

const DEFAULT_THEME_OPTIONS = SHIKI_THEMES.map((theme) => ({
  label: theme.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  value: theme,
}));

export default function Select({
  id,
  label,
  value,
  onChange,
  options = DEFAULT_THEME_OPTIONS,
  emptyLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: { label: string; value: string }[];
  /** Adds an empty first option with this text. */
  emptyLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs text-mod-ink/80">
        {label}
      </label>
      <select
        id={id}
        className="min-h-11 w-full rounded-none border border-mod-rule bg-mod-bg px-2.5 text-sm text-mod-ink hover:border-mod-ink/45 focus-visible:border-mod-accent"
        value={value}
        onChange={onChange}>
        {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
