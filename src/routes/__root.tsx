import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Attorney", "LegalService"],
      "@id": "https://veronicalopez.hilolegal.es/#legalservice",
      name: "Verónica López",
      url: "https://veronicalopez.hilolegal.es/",
      description:
        "Abogada en Altea con experiencia en alta dirección pública, docencia universitaria y ejercicio privado. Derecho administrativo, civil, familia, comunidades, penal y consultoría jurídica especializada.",
      telephone: "+34623976706",
      areaServed: [
        { "@type": "City", name: "Altea" },
        { "@type": "AdministrativeArea", name: "Costa Blanca" },
        { "@type": "AdministrativeArea", name: "Alicante" },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Calitx 9",
        postalCode: "03590",
        addressLocality: "Altea",
        addressRegion: "Alicante",
        addressCountry: "ES",
      },
      serviceType: [
        "Derecho administrativo",
        "Derecho civil y de familia",
        "Inmobiliario y comunidades",
        "Derecho penal",
        "Consultoría jurídica especializada",
        "Estrategia jurídica preventiva",
      ],
    },
    {
      "@type": "Person",
      "@id": "https://veronicalopez.hilolegal.es/#person",
      name: "Verónica López",
      jobTitle: "Abogada",
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Universidad de Alicante",
      },
      worksFor: {
        "@id": "https://veronicalopez.hilolegal.es/#legalservice",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://veronicalopez.hilolegal.es/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Qué tipo de asuntos lleva Verónica López?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Asuntos jurídicos que requieren análisis, estrategia y criterio profesional, especialmente en el ámbito administrativo, civil, institucional y de asesoramiento preventivo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Trabaja con particulares, empresas e instituciones?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. El asesoramiento puede dirigirse a particulares, profesionales, empresas, entidades e instituciones que necesiten orientación jurídica especializada.",
          },
        },
        {
          "@type": "Question",
          name: "¿La primera consulta es gratuita?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, la primera consulta es gratuita y sin compromiso. En ella valoramos tu caso y te explicamos las opciones antes de que decidas si quieres seguir adelante.",
          },
        },
        {
          "@type": "Question",
          name: "¿Atiende en Alicante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Atiende en Alicante y también puede realizar consultas online cuando el asunto lo permita.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué diferencia este despacho?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La combinación de experiencia jurídica, trayectoria institucional y visión académica. Esa perspectiva permite analizar cada asunto con profundidad y diseñar estrategias realistas.",
          },
        },
      ],
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Verónica López Ramón" },
      { name: "description", content: "Abogada" },
      { property: "og:title", content: "Verónica López Ramón" },
      { name: "twitter:title", content: "Verónica López Ramón" },
      { property: "og:description", content: "Abogada" },
      { name: "twitter:description", content: "Abogada" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/db555304-2d64-4ba9-98fd-7c163ce5d4f1" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/db555304-2d64-4ba9-98fd-7c163ce5d4f1" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", href: "/veronica-lopez-abogada-altea.webp", as: "image", fetchPriority: "high" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
