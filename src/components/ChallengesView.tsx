import { useEffect, useState } from "react";
import {
  Award,
  CheckCircle2,
  ClipboardCheck,
  Flame,
  Lock,
  ShieldAlert,
  Trophy,
  XCircle,
} from "lucide-react";
import { COURSE_LEVELS } from "../data/curriculum";
import { CULINARY_MISSIONS, DAILY_CHALLENGES } from "../data/recipes";
import { useProgress } from "../context/ProgressContext";
import type { LevelNumber } from "../types/academy";

interface ChallengesViewProps {
  initialExamLevel?: LevelNumber | null;
  onConsumeExamLevel?: () => void;
  onOpenCertificate: (level: LevelNumber) => void;
}

export function ChallengesView({
  initialExamLevel,
  onConsumeExamLevel,
  onOpenCertificate,
}: ChallengesViewProps) {
  const {
    state,
    isLevelUnlocked,
    isLevelCertified,
    completeChallenge,
    completeMission,
    recordExamResult,
  } = useProgress();

  const [activeExamLevel, setActiveExamLevel] = useState<LevelNumber | null>(initialExamLevel ?? null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const [challengeChecks, setChallengeChecks] = useState<Record<string, Record<number, boolean>>>({});
  const [missionChecks, setMissionChecks] = useState<Record<string, Record<number, boolean>>>({});

  useEffect(() => {
    if (initialExamLevel) {
      setActiveExamLevel(initialExamLevel);
      setAnswers({});
      setSubmitted(false);
      onConsumeExamLevel?.();
    }
  }, [initialExamLevel, onConsumeExamLevel]);

  const currentExam = COURSE_LEVELS.find((l) => l.levelNumber === activeExamLevel) ?? null;

  const examScore = currentExam
    ? currentExam.examQuestions.reduce(
        (acc, q) => (answers[q.id] === q.correctIndex ? acc + 1 : acc),
        0
      )
    : 0;

  const handleSubmitExam = () => {
    if (!currentExam) return;
    setSubmitted(true);
    recordExamResult(
      currentExam.levelNumber,
      examScore,
      currentExam.examQuestions.length,
      currentExam.examPassScore,
      currentExam.examXpReward
    );
  };

  return (
    <div className="space-y-9">
      <div>
        <p className="text-xs font-semibold text-sky-700">Evaluaciones, retos y certificaciones</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
          Exámenes y Desafíos Culinarios
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Pon a prueba tus conocimientos de cocina segura, completa misiones prácticas en casa y aprueba las evaluaciones de cada nivel para ganar medallas y certificados.
        </p>
      </div>

      {/* Active Interactive Exam Runner */}
      {currentExam && (
        <section className="rounded-3xl bg-white text-slate-950 border border-sky-300 p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-100 pb-4">
            <div>
              <p className="text-xs font-semibold text-sky-700">
                Evaluación Oficial · Aprueba con {currentExam.examPassScore}/{currentExam.examQuestions.length} · +{currentExam.examXpReward} XP
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-950 mt-1">
                Examen de {currentExam.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveExamLevel(null);
                setSubmitted(false);
                setAnswers({});
              }}
              className="px-3.5 py-2 rounded-xl border border-sky-200 text-xs font-semibold text-slate-700 hover:bg-sky-50 min-h-[40px]"
            >
              Cerrar examen
            </button>
          </div>

          <div className="space-y-6">
            {currentExam.examQuestions.map((q, idx) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.correctIndex;

              return (
                <div key={q.id} className="space-y-2.5">
                  <p className="text-sm sm:text-base font-semibold text-slate-900">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isPicked = selected === optIdx;
                      const showRight = submitted && optIdx === q.correctIndex;
                      const showWrong = submitted && isPicked && !isCorrect;

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={submitted}
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`text-left text-sm px-4 py-3 rounded-xl border transition-colors min-h-[44px] flex items-center justify-between gap-3 ${
                            showRight
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold"
                              : showWrong
                              ? "bg-rose-50 border-rose-400 text-rose-900"
                              : isPicked
                              ? "bg-sky-600 text-white border-sky-600"
                              : "bg-sky-50/60 border-sky-200 text-slate-800 hover:bg-sky-100/70"
                          }`}
                        >
                          <span>{opt}</span>
                          {showRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {showWrong && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p
                      className={`text-xs px-3.5 py-2.5 rounded-xl ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-950"
                          : "bg-sky-100 text-sky-950"
                      }`}
                    >
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
            {!submitted ? (
              <>
                <span className="text-xs text-slate-500 tabular-nums">
                  Respondidas: {Object.keys(answers).length} de {currentExam.examQuestions.length}
                </span>
                <button
                  type="button"
                  disabled={Object.keys(answers).length < currentExam.examQuestions.length}
                  onClick={handleSubmitExam}
                  className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-500 text-white text-sm font-semibold transition-colors min-h-[44px]"
                >
                  Calificar evaluación
                </button>
              </>
            ) : (
              <>
                <div className="text-sm font-bold tabular-nums">
                  Puntuación obtenida: {examScore} / {currentExam.examQuestions.length} (
                  {Math.round((examScore / currentExam.examQuestions.length) * 100)}%)
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswers({});
                      setSubmitted(false);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-sky-200 hover:bg-sky-50 text-xs font-semibold min-h-[44px]"
                  >
                    Intentar de nuevo
                  </button>
                  {isLevelCertified(currentExam.levelNumber) && (
                    <button
                      type="button"
                      onClick={() => onOpenCertificate(currentExam.levelNumber)}
                      className="px-4 py-2.5 rounded-xl bg-sky-200 hover:bg-sky-300 text-sky-950 text-xs font-bold inline-flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Award className="w-4 h-4" />
                      Ver certificado
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Level Final Exams Grid */}
      <section className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-sky-600" />
          Evaluaciones por Nivel
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COURSE_LEVELS.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.levelNumber);
            const passed = state.passedExamLevels.includes(lvl.levelNumber);
            const bestScore = state.examScores[lvl.levelNumber];

            return (
              <div
                key={lvl.levelNumber}
                className="rounded-2xl bg-white border border-sky-200 p-5 flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-sky-700">Nivel {lvl.levelNumber}</span>
                    {passed ? (
                      <span className="text-emerald-700 tabular-nums">Aprobado ({bestScore}%)</span>
                    ) : !unlocked ? (
                      <span className="text-slate-400 inline-flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        {lvl.requiredXp} XP
                      </span>
                    ) : (
                      <span className="text-sky-700 tabular-nums">+{lvl.examXpReward} XP</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-950 mt-2">{lvl.title}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {lvl.examQuestions.length} preguntas de opción múltiple con retroalimentación inmediata.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!unlocked}
                  onClick={() => {
                    setActiveExamLevel(lvl.levelNumber);
                    setAnswers({});
                    setSubmitted(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors min-h-[44px] ${
                    !unlocked
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : passed
                      ? "bg-sky-100 hover:bg-sky-200 text-sky-950"
                      : "bg-sky-600 hover:bg-sky-700 text-white"
                  }`}
                >
                  {!unlocked ? "Bloqueado" : passed ? "Repetir evaluación" : "Comenzar examen"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Challenges & Practical Missions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
            <Flame className="w-5 h-5 text-sky-600" />
            Desafíos Diarios
          </h2>
          {DAILY_CHALLENGES.map((chal) => {
            const done = state.completedChallengeIds.includes(chal.id);
            const checks = challengeChecks[chal.id] ?? {};
            const allChecked = chal.checklist.every((_, i) => checks[i]);

            return (
              <div
                key={chal.id}
                className="rounded-2xl bg-sky-50/80 border border-sky-200 p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-sky-700 font-semibold">{chal.levelLabel}</p>
                    <h3 className="font-display text-lg font-bold text-slate-950 mt-0.5">{chal.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-sky-700 tabular-nums shrink-0">
                    +{chal.xpReward} XP
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{chal.description}</p>
                <div className="space-y-2">
                  {chal.checklist.map((item, idx) => {
                    const active = done || !!checks[idx];
                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={done}
                        onClick={() =>
                          setChallengeChecks((prev) => ({
                            ...prev,
                            [chal.id]: { ...prev[chal.id], [idx]: !prev[chal.id]?.[idx] },
                          }))
                        }
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs min-h-[40px] ${
                          active
                            ? "bg-sky-200/70 border-sky-400 text-slate-950 font-medium"
                            : "bg-white border-sky-200 text-slate-700"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${active ? "text-sky-700" : "text-slate-400"}`}
                        />
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-amber-800 inline-flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    {chal.safetyReminder}
                  </span>
                  <button
                    type="button"
                    disabled={done || !allChecked}
                    onClick={() => completeChallenge(chal.id, chal.xpReward)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 min-h-[40px] ${
                      done
                        ? "bg-emerald-100 text-emerald-900"
                        : allChecked
                        ? "bg-sky-600 hover:bg-sky-700 text-white"
                        : "bg-sky-200/60 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {done ? "Completado" : "Reclamar XP"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-sky-600" />
            Retos Culinarios Prácticos
          </h2>
          {CULINARY_MISSIONS.map((mission) => {
            const done = state.completedMissionIds.includes(mission.id);
            const unlocked = isLevelUnlocked(mission.levelNumber);
            const checks = missionChecks[mission.id] ?? {};
            const allChecked = mission.stepsToVerify.every((_, i) => checks[i]);

            return (
              <div
                key={mission.id}
                className="rounded-2xl bg-white text-slate-950 border border-sky-200 p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-sky-700">Nivel {mission.levelNumber}</p>
                    <h3 className="font-display text-lg font-bold text-slate-950">{mission.title}</h3>
                  </div>
                  <span className="text-xs font-bold text-sky-700 tabular-nums shrink-0">
                    +{mission.xpReward} XP
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{mission.description}</p>

                <div className="space-y-1.5">
                  {mission.stepsToVerify.map((step, idx) => {
                    const checked = done || !!checks[idx];
                    return (
                      <button
                        key={step}
                        type="button"
                        disabled={done || !unlocked}
                        onClick={() =>
                          setMissionChecks((prev) => ({
                            ...prev,
                            [mission.id]: { ...prev[mission.id], [idx]: !prev[mission.id]?.[idx] },
                          }))
                        }
                        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs min-h-[40px] ${
                          checked
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                            : "bg-sky-50/50 border-sky-200 text-slate-800"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${checked ? "text-emerald-600" : "text-slate-400"}`}
                        />
                        <span>{step}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-amber-800">{mission.safetyReminder}</span>
                  <button
                    type="button"
                    disabled={!unlocked || done || !allChecked}
                    onClick={() => completeMission(mission.id, mission.xpReward)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 min-h-[40px] ${
                      done
                        ? "bg-emerald-600 text-white"
                        : !unlocked
                        ? "bg-slate-100 text-slate-400"
                        : allChecked
                        ? "bg-sky-600 hover:bg-sky-700 text-white"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {done ? "Misión lograda" : !unlocked ? `Nivel ${mission.levelNumber}` : "Completar reto"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
