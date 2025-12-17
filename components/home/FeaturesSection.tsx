// components/home/FeaturesSection.tsx
import { siteConfig } from "@/config/site";

export default function FeaturesSection() {
  return (
    <section id="features" className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight text-slate-50">
          {siteConfig.features.title}
        </h2>
        <p className="text-xs text-slate-400">
          {siteConfig.features.description}
        </p>
      </div>

      <div className="grid items-stretch gap-4 md:grid-cols-3">
        {siteConfig.features.items.map((feature) => (
          <div
            key={feature.id}
            className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-left transition-all duration-150 hover:-translate-y-1 hover:border-slate-600 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/40"
          >
            <p className="text-sm font-semibold text-slate-100">
              {feature.title}
            </p>
            <p className="mt-2 text-[11px] text-slate-400">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
