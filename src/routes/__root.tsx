import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import StoreDevtools from "../lib/demo-store-devtools";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { config } from "@/config";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: config.app.title,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script>
          {`
                        window.addEventListener('DOMContentLoaded', () => {
                            if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
                                document.body.classList.add('dark');
                            }

                            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                                const newColorScheme = event.matches ? "dark" : "light";
                                if (newColorScheme === "dark") {
                                    document.body.classList.add('dark');
                                } else {
                                    document.body.classList.remove('dark');
                                }
                            });
                        })
                    `}
        </script>

        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              StoreDevtools,
              TanStackQueryDevtools,
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}
