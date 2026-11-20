import { Award, CheckCircle2, Printer, X } from "lucide-react";
import type { CourseLevel } from "../types/academy";

interface CertificateModalProps {
  level: CourseLevel;
  studentName: string;
  scorePercent?: number;
  onClose: () => void;
}

export function CertificateModal({ level, studentName, scorePercent = 100, onClose }: CertificateModalProps) {
  const todayLabel = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-heading"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 border border-sky-200 shadow-2xl overflow-hidden">
        <div className="bg-sky-100 px-6 py-4 flex items-center justify-between border-b border-sky-200">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-sky-700" />
            <span className="font-display font-bold tracking-tight text-slate-900 text-sm">
              CHEF ACADEMY — CERTIFICACIÓN OFICIAL
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-950 hover:bg-sky-200/60 transition-colors"
            aria-label="Cerrar certificado"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-10 text-center bg-gradient-to-b from-white to-sky-50/70">
          <div className="mx-auto w-14 h-14 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center mb-4">
            <Award className="w-7 h-7 text-sky-700" />
          </div>

          <p className="text-xs font-semibold text-sky-700 tracking-wide">Otorgado con distinción académica a</p>
          <h2 id="certificate-heading" className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-2">
            {studentName || "Estudiante de Chef Academy"}
          </h2>

          <p className="text-sm text-slate-600 mt-4 max-w-lg mx-auto leading-relaxed">
            Por haber completado satisfactoriamente los retos prácticos, protocolos de seguridad e higiene alimentaria y la evaluación final de:
          </p>

          <div className="mt-5 py-4 px-5 rounded-xl bg-sky-50 text-slate-950 border border-sky-200">
            <p className="text-xs text-sky-700 font-semibold">{level.title}</p>
            <p className="font-display text-lg sm:text-xl font-bold mt-1">{level.certificateTitle}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 tabular-nums">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Calificación: {scorePercent}%
            </span>
            <span aria-hidden="true">·</span>
            <span>Fecha de emisión: {todayLabel}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors min-h-[44px]"
            >
              <Printer className="w-4 h-4" />
              Imprimir o guardar PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-slate-800 text-sm font-semibold transition-colors min-h-[44px]"
            >
              Volver a mi perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
