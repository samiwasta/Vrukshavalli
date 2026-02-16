import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/util";

interface SearchBarProps {
  action?: string;
  name?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  action = "/search",
  name = "q",
  placeholder = "Search plants...",
  className,
}: SearchBarProps) {
  return (
    <form
      action={action}
      method="GET"
      className={cn(
        "flex max-w-md flex-1 items-center gap-2 rounded-full border px-4 py-2 border-primary-600",
        className
      )}
    >
      <IconSearch size={20} className="shrink-0 text-primary-600" />
      <input
        type="search"
        name={name}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none"
      />
    </form>
  );
}
