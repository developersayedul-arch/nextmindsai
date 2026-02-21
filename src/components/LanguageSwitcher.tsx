import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { CURRENCIES, Currency } from "@/i18n/types";

const LanguageSwitcher = () => {
  const { language, setLanguage, currency, setCurrency } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => setLanguage("bn")}
          className={`rounded-lg ${language === "bn" ? "bg-primary/10 text-primary font-medium" : ""}`}
        >
          🇧🇩 বাংলা
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`rounded-lg ${language === "en" ? "bg-primary/10 text-primary font-medium" : ""}`}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {(Object.keys(CURRENCIES) as Currency[]).map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => setCurrency(cur)}
            className={`rounded-lg ${currency === cur ? "bg-primary/10 text-primary font-medium" : ""}`}
          >
            {CURRENCIES[cur].label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
