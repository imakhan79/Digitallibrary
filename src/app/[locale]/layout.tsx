import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Playfair_Display, Inter, Noto_Nastaliq_Urdu, Noto_Naskh_Arabic } from "next/font/google";
import { routing, rtlLocales } from "@/i18n/routing";
import "../globals.css";

const display = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });
const sans = Inter({ variable: "--font-sans", subsets: ["latin"] });
const urdu = Noto_Nastaliq_Urdu({ variable: "--font-urdu", subsets: ["arabic"], weight: "400" });
const arabic = Noto_Naskh_Arabic({ variable: "--font-arabic", subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "Digital Library World",
  description: "Preserving Knowledge. Connecting Generations.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const messages = await getMessages();
  const dir = rtlLocales.includes(locale as never) ? "rtl" : "ltr";
  const localeFont = locale === "ur" ? urdu.variable : locale === "ar" ? arabic.variable : "";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${display.variable} ${sans.variable} ${localeFont} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
