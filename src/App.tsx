import { useState } from "react";
import {
  Award,
  ChefHat,
  Home,
  Leaf,
  Sparkles,
  Trophy,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { COURSE_LEVELS } from "./data/curriculum";
import { ProgressProvider, useProgress } from "./context/ProgressContext";
import type { LevelNumber, TabId } from "./types/academy";
import { HomeView } from "./components/HomeView";
import { ZeroWasteView } from "./components/ZeroWasteView";
import { RecipeBookView } from "./components/RecipeBookView";
import { ChallengesView } from "./components/ChallengesView";
import { ChefTutorView } from "./components/ChefTutorView";
import { ProfileView } from "./components/ProfileView";
import { CertificateModal } from "./components/CertificateModal";
import { WelcomeOnboardingModal } from "./components/WelcomeOnboardingModal";

const NAV_ITEMS: Array<{ id: TabId; label: string; icon: typeof Home }> = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "sin-desperdicio", label: "Sin desperdicio", icon: Leaf },
  { id: "recetario", label: "Recetario", icon: UtensilsCrossed },
  { id: "desafios", label: "Desafíos", icon: Trophy },
  { id: "chef-ia", label: "Chef IA", icon: Sparkles },
];

function AcademyShell() {
  const { state, activeToast, dismissToast } = useProgress();
  const [activeTab, setActiveTab] = useState<TabId>("inicio");
  const [pendingExamLevel, setPendingExamLevel] = useState<LevelNumber | null>(null);
  const [certificateLevel, setCertificateLevel] = useState<LevelNumber | null>(null);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | null>(null);

  const certificateCourse = COURSE_LEVELS.find((l) => l.levelNumber === certificateLevel) ?? null;

  const navigateTo = (tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskTutor = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    navigateTo("chef-ia");
  };

  return (
    <div className="min-h-screen bg-[#F4F9FF] text-slate-900 flex flex-col">
      {/* Top Bar: Clean 3-Zone Contract on Desktop, Compact App Bar on Mobile */}
      <header className="border-b border-sky-200/80 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo("inicio")}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 min-h-[44px]"
          >
            <span className="w-9 h-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
              <ChefHat className="w-5 h-5 text-sky-600" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base sm:text-lg font-extrabold tracking-tight text-slate-950 leading-none">
                CHEF ACADEMY
              </span>
              <span className="text-[11px] font-semibold text-sky-700 leading-tight mt-0.5 hidden sm:block">
                Cocina Sin Desperdicio &amp; Video IA
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`text-sm font-semibold whitespace-nowrap shrink-0 py-2 border-b-2 transition-colors ${
                    active
                      ? "text-sky-700 border-sky-500"
                      : "text-slate-600 border-transparent hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Profile Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => navigateTo("perfil")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 min-h-[44px] border ${
                activeTab === "perfil"
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-sky-50 text-slate-900 border-sky-200 hover:bg-sky-100"
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === "perfil" ? "text-white" : "text-sky-600"}`} />
              <span className="max-w-[110px] truncate">{state.studentName || "Mi Perfil"}</span>
              <span aria-hidden="true">·</span>
              <span className={`tabular-nums ${activeTab === "perfil" ? "text-sky-100" : "text-sky-700"}`}>
                {state.xp} XP
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-9 pb-28 lg:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === "inicio" && <HomeView onNavigate={navigateTo} />}

            {activeTab === "sin-desperdicio" && <ZeroWasteView />}

            {activeTab === "recetario" && <RecipeBookView onAskTutor={handleAskTutor} />}

            {activeTab === "desafios" && (
              <ChallengesView
                initialExamLevel={pendingExamLevel}
                onConsumeExamLevel={() => setPendingExamLevel(null)}
                onOpenCertificate={(lvl) => setCertificateLevel(lvl)}
              />
            )}

            {activeTab === "chef-ia" && (
              <ChefTutorView
                initialPrompt={tutorInitialPrompt}
                onConsumeInitialPrompt={() => setTutorInitialPrompt(null)}
              />
            )}

            {activeTab === "perfil" && (
              <ProfileView onOpenCertificate={(lvl) => setCertificateLevel(lvl)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Quiet Desktop Footer */}
      <footer className="hidden lg:block border-t border-sky-200/80 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <span>CHEF ACADEMY · Cocina Segura, Sin Desperdicio y Video IA (12+)</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo("sin-desperdicio")}
              className="hover:text-sky-700 transition-colors"
            >
              Sin desperdicio
            </button>
            <button
              type="button"
              onClick={() => navigateTo("recetario")}
              className="hover:text-sky-700 transition-colors"
            >
              Recetario
            </button>
            <button
              type="button"
              onClick={() => navigateTo("chef-ia")}
              className="hover:text-sky-700 transition-colors"
            >
              Profesor IA
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar */}
      <nav
        aria-label="Menú inferior de navegación"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sky-200 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-16 max-w-2xl mx-auto px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 rounded-xl transition-colors ${
                  active ? "text-sky-600 bg-sky-50" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.25 : 1.75} />
                <span className="text-[11px] font-semibold tracking-tight mt-1 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Reward / Progress Toast */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-2xl bg-white text-slate-950 border border-sky-300 shadow-xl p-4 flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-slate-950">{activeToast.title}</p>
                <p className="text-xs text-slate-600 mt-0.5">{activeToast.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Cerrar notificación"
              className="p-1 text-slate-400 hover:text-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official Certificate Modal */}
      {certificateCourse && (
        <CertificateModal
          level={certificateCourse}
          studentName={state.studentName}
          scorePercent={state.examScores[certificateCourse.levelNumber] ?? 100}
          onClose={() => setCertificateLevel(null)}
        />
      )}

      {/* Initial Student Name & Profile Onboarding */}
      {!state.hasCompletedOnboarding && <WelcomeOnboardingModal />}
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AcademyShell />
    </ProgressProvider>
  );
}
