import { useLocale } from "@/contexts/LocaleContext";
import { translations } from "@/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PreferencesDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { locale, setLocale } = useLocale();
  const t = translations[locale];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t.preferences}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-lg p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">{t.preferences}</h2>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-muted-foreground">{t.language}</p>
          <div className="flex gap-4">
            {(["en", "uk"] as const).map((loc) => (
              <label
                key={loc}
                className={cn(
                  "flex items-center gap-2 cursor-pointer text-sm",
                  locale === loc && "font-medium"
                )}
              >
                <input
                  type="radio"
                  name="locale"
                  checked={locale === loc}
                  onChange={() => setLocale(loc)}
                  className="rounded-full"
                />
                {loc === "en" ? t.languageEn : t.languageUk}
              </label>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={onClose}>
          {t.close}
        </Button>
      </div>
    </div>
  );
}
