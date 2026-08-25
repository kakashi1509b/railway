'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { KpiRibbon } from '@/components/dashboard/kpi-ribbon';
import { TrainGraph } from '@/components/dashboard/train-graph';
import { BlockPlanning } from '@/components/dashboard/block-planning';
import { ApprovalWorkflow } from '@/components/dashboard/approval-workflow';
import { EmergencyModal } from '@/components/dashboard/emergency-modal';
import { AuditLedger } from '@/components/dashboard/audit-ledger';
import { PERSONAS, type Persona } from '@/lib/data';

export default function Home() {
  const [persona, setPersona] = useState<Persona>(PERSONAS[0]);
  const [activeNav, setActiveNav] = useState('overview');
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [ledgerOpen, setLedgerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar active={activeNav} onNavigate={setActiveNav} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          persona={persona}
          onPersonaChange={setPersona}
          onOpenLedger={() => setLedgerOpen(true)}
          onOpenEmergency={() => setEmergencyOpen(true)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto max-w-[1600px] space-y-6 p-4 lg:p-6">
            {/* Page title */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Operations Overview
                </h1>
                <span className="rounded-md bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {persona.division}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time AI-optimized block planning with CP-SAT solver and Sentinel
                cryptographic safety verification
              </p>
            </motion.div>

            {/* KPI Ribbon */}
            <KpiRibbon />

            {/* Train Graph */}
            <TrainGraph />

            {/* Block Planning + Approval Workflow */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <BlockPlanning />
              <ApprovalWorkflow persona={persona} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border py-4 text-[10px] text-muted-foreground">
              <span className="font-mono">
                RAIL-BLOC v2.4.1 · CP-SAT OR-Tools v9.10 · Sentinel v3.2
              </span>
              <span>Simulated operational data · Indian Railways R&amp;D</span>
            </div>
          </div>
        </main>
      </div>

      <EmergencyModal open={emergencyOpen} onOpenChange={setEmergencyOpen} />
      <AuditLedger open={ledgerOpen} onOpenChange={setLedgerOpen} />
    </div>
  );
}
