import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

export function Stats() {
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  if (clients.length === 0) return null;

  const logos = [...clients, ...clients];

  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-200 overflow-hidden">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 to-transparent z-10" />

        <div className="flex animate-logo-scroll">
          {logos.map((client, index) => (
            <div
              key={`${client.id}-${index}`}
              data-testid={`logo-slider-${client.id}-${index}`}
              className="flex-shrink-0 mx-8 md:mx-12 flex items-center justify-center"
              style={{ minWidth: "140px" }}
            >
              <img
                src={client.imageUrl}
                alt={client.name}
                className="h-12 md:h-16 w-auto object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
