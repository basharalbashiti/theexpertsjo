import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

function Counter({ from, to }: { from: number; to: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = (to - from) / steps;
      
      let current = from;
      const timer = setInterval(() => {
        current += increment;
        if (current >= to) {
          setCount(to);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);
      
      return () => clearInterval(timer);
    }
  }, [inView, from, to]);

  return <span ref={ref}>{count}</span>;
}

export function Stats() {
  const { t } = useLanguage();

  const stats = [
    { label: t("stat_offices"), value: 4 },
    { label: t("stat_warehouses"), value: 6 },
    { label: t("stat_countries"), value: 7 },
    { label: t("stat_skus"), value: 5000 },
  ];

  return (
    <section className="py-20 bg-neutral-50 border-y border-neutral-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                <Counter from={0} to={stat.value} />
                {stat.label === t("stat_skus") ? "+" : ""}
              </h3>
              <p className="text-neutral-500 uppercase tracking-widest text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
