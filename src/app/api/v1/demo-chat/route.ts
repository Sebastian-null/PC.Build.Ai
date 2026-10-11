import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  sessionId: z.uuid().optional(),
  locale: z.enum(["uk", "en"]),
});
type Locale = "uk" | "en";

function analyzeRequirements(text: string, locale: Locale) {
  const lower = text.toLowerCase();
  const match = text.match(/(?:\$|usd\s*|uah\s*|₴\s*)?(\d[\d\s,.]{2,})/i);
  const raw = match?.[1]?.replace(/[\s,]/g, "");
  const budget = raw ? Number(raw) : undefined;
  const currency = /грн|uah|₴|україн|украин/i.test(text)
    ? "UAH"
    : /\$|usd|usa|сша|united states/i.test(text)
      ? "USD"
      : undefined;
  const hasUse =
    /gaming|game|play|fps|workstation|editing|render|stream|server|гра|игр|монтаж|рендер|стрим|сервер|робот|работ/i.test(
      lower,
    );
  const hasStorage = /ssd|nvme|hdd|накопич|накопит|жорстк|жестк|\d+\s?(tb|тб|gb|гб)/i.test(lower);
  const hasCase =
    /case|корпус|compact|компакт|white|білий|белый|mini[- ]?itx|m-atx|matx|atx|tower/i.test(lower);
  const missing = [
    !budget && "budget",
    !currency && "region",
    !hasUse && "use",
    !hasStorage && "storage",
    !hasCase && "case",
  ].filter(Boolean) as string[];
  const labels: Record<string, string> =
    locale === "uk"
      ? {
          budget: "точний бюджет",
          region: "країна покупки — Україна чи США",
          use: "основні ігри або робочі програми",
          storage: "накопичувач: SSD/NVMe чи HDD та потрібний обсяг",
          case: "корпус: розмір, колір і формат (ATX / mATX / Mini-ITX)",
        }
      : {
          budget: "your exact budget",
          region: "purchase country — USA or Ukraine",
          use: "main games or professional applications",
          storage: "storage: SSD/NVMe or HDD and required capacity",
          case: "case size, color, and form factor (ATX / mATX / Mini-ITX)",
        };
  return {
    budget,
    currency,
    missing,
    question:
      locale === "uk"
        ? `Перш ніж збирати повну конфігурацію, уточніть, будь ласка:\n\n${missing.map((key) => `• ${labels[key]}`).join("\n")}\n\nМожна відповісти одним повідомленням — я збережу попередні вимоги.`
        : `Before I build the complete configuration, please clarify:\n\n${missing.map((key) => `• ${labels[key]}`).join("\n")}\n\nYou can answer in one message; I will keep your earlier requirements.`,
  };
}

function demoComponents(locale: Locale, currency: string) {
  const ua = currency === "UAH";
  const stores = ua
    ? [
        { store: "Telemart", url: "https://telemart.ua/ua/search/?search=", factor: 1 },
        { store: "Rozetka", url: "https://rozetka.com.ua/ua/search/?text=", factor: 1.035 },
        { store: "Brain", url: "https://brain.com.ua/ukr/search/?Search=", factor: 1.02 },
      ]
    : [
        { store: "Newegg", url: "https://www.newegg.com/p/pl?d=", factor: 1 },
        { store: "Amazon", url: "https://www.amazon.com/s?k=", factor: 1.025 },
        { store: "Best Buy", url: "https://www.bestbuy.com/site/searchpage.jsp?st=", factor: 1.04 },
      ];
  const products = [
    {
      role: "CPU",
      model: "AMD Ryzen 5 7600",
      image: "/components/cpu.svg",
      base: ua ? 9200 : 199,
      specs: ["6C / 12T", "AM5", "65 W"],
    },
    {
      role: "Motherboard",
      model: "B650 Wi-Fi motherboard",
      image: "/components/motherboard.svg",
      base: ua ? 6500 : 159,
      specs: ["AM5", "DDR5", "Wi-Fi 6"],
    },
    {
      role: "Cooler",
      model: "120 mm tower CPU cooler",
      image: "/components/cooler.svg",
      base: ua ? 1800 : 45,
      specs: ["AM5", "Quiet fan", "155 mm"],
    },
    {
      role: "GPU",
      model: "NVIDIA GeForce RTX 4070 SUPER",
      image: "/components/gpu.svg",
      base: ua ? 28500 : 599,
      specs: ["12 GB GDDR6X", "PCIe 4.0", "220 W"],
    },
    {
      role: "RAM",
      model: "32 GB DDR5-6000 CL30",
      image: "/components/ram.svg",
      base: ua ? 5200 : 109,
      specs: ["2 × 16 GB", "DDR5-6000", "CL30"],
    },
    {
      role: "Storage",
      model: "1 TB PCIe 4.0 NVMe SSD",
      image: "/components/storage.svg",
      base: ua ? 3200 : 79,
      specs: ["1 TB", "M.2 2280", "PCIe 4.0"],
    },
    {
      role: "Case",
      model: "Compact airflow mATX case",
      image: "/components/case.svg",
      base: ua ? 4000 : 99,
      specs: ["mATX", "High airflow", "White option"],
    },
    {
      role: "PSU",
      model: "750 W 80+ Gold",
      image: "/components/psu.svg",
      base: ua ? 4700 : 99,
      specs: ["750 W", "80+ Gold", "ATX 3.0"],
    },
  ];
  return products.map((product) => ({
    ...product,
    condition: locale === "uk" ? "Нове" : "New",
    offers: stores.map((store, index) => ({
      store: store.store,
      price: Math.round(product.base * store.factor),
      currency,
      url: `${store.url}${encodeURIComponent(product.model)}`,
      availability:
        index === 0
          ? locale === "uk"
            ? "Demo-пропозиція"
            : "Demo offer"
          : locale === "uk"
            ? "Перевірити в магазині"
            : "Check retailer",
      observedAt: new Date().toISOString(),
      isDemo: true,
    })),
  }));
}

function completedAnswer(budget: number, currency: string, locale: Locale) {
  return locale === "uk"
    ? `Вимоги зібрано. Підготував повну стартову конфігурацію в межах бюджету ${budget.toLocaleString("uk-UA")} ${currency}.\n\n• CPU: AMD Ryzen 5 7600\n• Motherboard: B650 Wi-Fi\n• Cooler: тихий баштовий кулер 120 мм\n• GPU: GeForce RTX 4070 SUPER\n• RAM: 32 ГБ DDR5-6000 CL30\n• Storage: NVMe SSD PCIe 4.0 на 1 ТБ\n• Case: компактний продувний mATX-корпус\n• PSU: 750 Вт 80+ Gold ATX 3.0\n\nУ розділі «Мої збірки» доступні зображення, характеристики та варіанти магазинів. Demo-ціни не є підтвердженим живим залишком.`
    : `Requirements captured. I prepared a complete starting configuration for a ${currency} ${budget.toLocaleString("en-US")} budget.\n\n• CPU: AMD Ryzen 5 7600\n• Motherboard: B650 Wi-Fi\n• Cooler: quiet 120 mm tower cooler\n• GPU: GeForce RTX 4070 SUPER\n• RAM: 32 GB DDR5-6000 CL30\n• Storage: 1 TB PCIe 4.0 NVMe SSD\n• Case: compact airflow mATX case\n• PSU: 750 W 80+ Gold ATX 3.0\n\nOpen “My builds” for images, specifications, and store choices. Demo prices are not verified live inventory.`;
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  const userClient = await createSupabaseServerClient();
  const {
    data: { user },
  } = await userClient.auth.getUser();
  if (!user?.email_confirmed_at)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "server_not_configured" }, { status: 503 });
  const admin = createClient(url, key, { auth: { persistSession: false } });
  let sessionId = parsed.data.sessionId;
  if (sessionId) {
    const { data } = await admin
      .from("chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!sessionId) {
    const { data, error } = await admin
      .from("chat_sessions")
      .insert({
        owner_id: user.id,
        title: parsed.data.message.slice(0, 54),
        locale: parsed.data.locale,
      })
      .select("id")
      .single();
    if (error) return NextResponse.json({ error: "storage_error" }, { status: 500 });
    sessionId = data.id;
  }
  const { data: previous } = await admin
    .from("chat_messages")
    .select("content")
    .eq("session_id", sessionId)
    .eq("role", "user")
    .order("created_at");
  const context = [...(previous ?? []).map((item) => item.content), parsed.data.message].join("\n");
  const requirements = analyzeRequirements(context, parsed.data.locale);
  const answerText = requirements.missing.length
    ? requirements.question
    : completedAnswer(requirements.budget!, requirements.currency!, parsed.data.locale);
  const { error } = await admin.from("chat_messages").insert([
    { session_id: sessionId, author_id: user.id, role: "user", content: parsed.data.message },
    { session_id: sessionId, author_id: null, role: "assistant", content: answerText },
  ]);
  if (error) return NextResponse.json({ error: "storage_error" }, { status: 500 });
  await admin
    .from("chat_sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (!requirements.missing.length) {
    const payload = {
      title: parsed.data.locale === "uk" ? "Повна AI-збірка" : "Complete AI build",
      budget_minor: Math.round(requirements.budget! * 100),
      currency: requirements.currency,
      status: "validated",
      components: demoComponents(parsed.data.locale, requirements.currency!),
    };
    const { data: existing } = await admin
      .from("builds")
      .select("id")
      .eq("source_session_id", sessionId)
      .maybeSingle();
    if (existing) await admin.from("builds").update(payload).eq("id", existing.id);
    else
      await admin
        .from("builds")
        .insert({ owner_id: user.id, source_session_id: sessionId, ...payload });
  }
  return NextResponse.json({
    sessionId,
    message: answerText,
    needsClarification: requirements.missing.length > 0,
  });
}
