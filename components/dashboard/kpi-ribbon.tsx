'use client';

import { motion } from 'framer-motion';
import {
  Gauge,
  Layers,
  Clock,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  KeyRound,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { KPIS, type KpiMetric } from '@/lib/data';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'asset-availability': Gauge,
  'bundling-efficiency': Layers,
  punctuality: Clock,
  'sentinel-gate': ShieldCheck,
};

const TONE_STYLES: Record<
  KpiMetric['tone'],
  { ring: string; bar: string; icon: string; glow: string }
> = {
  primary: {
    ring: 'text-primary',
    bar: 'stroke-primary',
    icon: 'bg-primary/15 text-primary',
    glow: 'shadow-primary/10',
  },
  success: {
    ring: 'text-success',
    bar: 'stroke-success',
    icon: 'bg-success/15 text-success',
    glow: 'shadow-success/10',
  },
  warning: {
    ring: 'text-warning',
    bar: 'stroke-warning',
    icon: 'bg-warning/15 text-warning',
    glow: 'shadow-warning/10',
  },
  accent: {
    ring: 'text-accent',
    bar: 'stroke-accent',
    icon: 'bg-accent/15 text-accent',
    glow: 'shadow-accent/10',
  },
};

export function KpiRibbon() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {KPIS.map((kpi, i) => {
        const Icon = ICONS[kpi.id] ?? Gauge;
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
          >
            <KpiCard kpi={kpi} Icon={Icon} />
          </motion.div>
        );
      })}
    </div>
  );
}

function KpiCard({
  kpi,
  Icon,
}: {
  kpi: KpiMetric;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const tone = TONE_STYLES[kpi.tone];
  const isCircular = kpi.id === 'asset-availability' || kpi.id === 'bundling-efficiency';
  const isSentinel = kpi.id === 'sentinel-gate';
  const pct = Math.min(100, (kpi.value / kpi.target) * 100);

  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl',
        tone.glow
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-bold tabular-nums text-foreground">
              {kpi.value}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {kpi.unit}
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            tone.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        {isCircular ? (
          <div className="flex items-center gap-3">
            <ProgressRing pct={pct} tone={tone} />
            <DeltaBadge delta={kpi.delta} label={kpi.deltaLabel} />
          </div>
        ) : isSentinel ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1.5">
              <KeyRound className="h-3.5 w-3.5 text-success" />
              <span className="font-mono text-xs font-semibold text-success">
                PASS · 0xA3F2
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">
              {kpi.deltaLabel}
            </span>
          </div>
        ) : (
          <div className="flex w-full items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
                className={cn('h-full rounded-full', tone.bar.replace('stroke-', 'bg-'))}
              />
            </div>
            <DeltaBadge delta={kpi.delta} label={kpi.deltaLabel} />
          </div>
        )}
      </div>
    </Card>
  );
}

function ProgressRing({
  pct,
  tone,
}: {
  pct: number;
  tone: { ring: string; bar: string };
}) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="3"
          className="stroke-muted"
        />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          className={tone.bar}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <span className={cn('absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold', tone.ring)}>
        {Math.round(pct)}%
      </span>
    </div>
  );
}

function DeltaBadge({ delta, label }: { delta: number; label: string }) {
  const positive = delta > 0;
  const neutral = delta === 0;
  const Icon = neutral ? Minus : positive ? TrendingUp : TrendingDown;

  return (
    <div className="flex flex-col leading-tight">
      <span
        className={cn(
          'flex items-center gap-1 text-xs font-semibold',
          neutral && 'text-muted-foreground',
          positive && 'text-success',
          !neutral && !positive && 'text-destructive'
        )}
      >
        <Icon className="h-3 w-3" />
        {neutral ? '0' : `${positive ? '+' : ''}${delta}`}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
