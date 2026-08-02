import React, { useState } from "react";
import { CheckCircle2, X, Loader2, ArrowRight, Check } from "lucide-react";
// Place le fichier du logo dans src/assets/ (ex: src/assets/yirihack-logo.png)
import yiriHackLogo from "./assets/yirihack-logo.png";

// ⚠️ À CONFIGURER : ton endpoint Formspree (Dashboard → ton formulaire → URL).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeeybpwy";

/**
 * Formulaire de candidature — YiriHack, 1ère Édition (Yiri Tech Africa)
 * -----------------------------------------------------------------------
 * Design deux colonnes, plat, sans dégradé.
 * Charte officielle (yiritechafrica.com) :
 *  - Bleu marine primaire : #173955   - Encre navy (panneau, titres) : #0B1C2B
 *  - Bleu clair : #7FB4D6             - Bordures : #E0ECF3
 *  - Fond champs : #F4F8FB            - Texte secondaire : #7A8A99
 *  - Fond : #FFFFFF (blanc)
 * Polices : Squada One (titres) + Lato (corps).
 */

const initialForm = {
  prenom: "",
  nom: "",
  ville: "",
  email: "",
  pitch: "",
  engagement: false,
};
const initialTouched = {
  prenom: false,
  nom: false,
  ville: false,
  email: false,
  pitch: false,
  engagement: false,
};

function validate(form) {
  const errors = {};

  if (!form.prenom.trim()) errors.prenom = "Le prénom est requis.";
  else if (form.prenom.trim().length < 2) errors.prenom = "2 caractères minimum.";

  if (!form.nom.trim()) errors.nom = "Le nom est requis.";
  else if (form.nom.trim().length < 2) errors.nom = "2 caractères minimum.";

  if (!form.ville.trim()) errors.ville = "La ville de résidence est requise.";

  if (!form.email.trim()) errors.email = "L'adresse e-mail est requise.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Format d'e-mail invalide.";

  if (!form.pitch.trim()) errors.pitch = "Le lien de la vidéo est requis.";
  else if (!/^https?:\/\/.+\..+/.test(form.pitch.trim()))
    errors.pitch = "Merci de fournir un lien valide (https://...).";

  if (!form.engagement) errors.engagement = "Merci de confirmer votre disponibilité.";

  return errors;
}

// Champ texte simple : label au-dessus, input plein cadre (sans icône)
function Field({ id, label, type = "text", placeholder, value, onChange, onBlur, error, touched, full = false }) {
  const showError = touched && error;
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#7a8a99]">
        {label} <span className="text-[#173955]">*</span>
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-[#f4f8fb] px-4 py-3 text-[15px] text-[#0b1c2b] placeholder:text-[#7a8a99]/70
          outline-none transition-colors duration-150 focus:bg-white focus:ring-2 focus:ring-[#173955]/15
          ${
            showError
              ? "border-red-300 focus:border-red-400"
              : "border-[#e0ecf3] hover:border-[#7fb4d6] focus:border-[#173955]"
          }`}
      />
      {showError && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}

// En-tête de section numérotée
function SectionTitle({ n, children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="font-display grid h-7 w-7 place-items-center rounded-full bg-[#173955] text-sm text-white">
        {n}
      </span>
      <h3 className="text-[13px] font-bold uppercase tracking-[0.15em] text-[#0b1c2b]">{children}</h3>
    </div>
  );
}

export default function YiriHackCandidatureV2() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState(initialTouched);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ prenom: true, nom: true, ville: true, email: true, pitch: true, engagement: true });
    if (hasErrors) return;

    setSubmitError("");
    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: JSON.stringify({
          Prénom: form.prenom,
          Nom: form.nom,
          "Ville de résidence": form.ville,
          Email: form.email,
          "Lien pitch vidéo": form.pitch,
          Engagement: form.engagement ? "Disponible le 16 août 2026 à Rabat" : "Non confirmé",
        }),
      });

      if (response.ok) setSuccess(true);
      else setSubmitError("L'envoi a échoué. Vérifie ta connexion et réessaie dans un instant.");
    } catch (err) {
      setSubmitError("Impossible de contacter le serveur. Vérifie ta connexion internet.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(initialForm);
    setTouched(initialTouched);
    setSuccess(false);
    setSubmitError("");
  }

  const engagementError = touched.engagement && errors.engagement;

  return (
    <div className="min-h-screen w-full px-4 py-10 selection:bg-[#173955] selection:text-white sm:py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Squada+One&family=Lato:wght@400;500;600;700;900&display=swap');
        .font-display { font-family: 'Squada One', 'Lato', sans-serif; letter-spacing: 0.5px; }
        .font-body { font-family: 'Lato', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="font-body mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#e0ecf3] shadow-[0_20px_60px_-24px_rgba(11,28,43,0.35)]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1fr]">
          {/* ============ COLONNE GAUCHE — Panneau infos (navy + vidéo de fond) ============ */}
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#0b1c2b] p-8 text-white sm:p-10">
            {/* Vidéo en fond plein, floutée (repli : navy) — fichier : public/video.mp4 */}
            <video
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-[4px]"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
            {/* Voile léger pour garder le texte lisible tout en laissant ressortir la vidéo */}
            <div className="pointer-events-none absolute inset-0 bg-[#0b1c2b]/55" />

            {/* Haut : logo + édition */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-white px-2.5 py-1.5">
                  <img src={yiriHackLogo} alt="YiriHack" className="h-6 w-auto object-contain" />
                </div>
                <div className="text-right text-[10px] font-bold uppercase leading-tight tracking-wider text-white/60">
                  Yiri Tech Africa
                  <br />
                  Édition 1 — 2026
                </div>
              </div>

              <span className="mt-8 inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7fb4d6]">
                Appel à candidatures
              </span>

              <h1 className="mt-5">
                <span className="sr-only">YiriHack — Édition 1</span>
                <span className="block h-24 w-full max-w-[17rem] overflow-hidden rounded-xl bg-white sm:h-28">
                  <img
                    src="/logo-white.jpg"
                    alt="YiriHack Édition 1"
                    className="h-full w-full object-cover object-center"
                  />
                </span>
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
                Quatre candidats, un jury, un défi : concevoir <span className="text-white">EduIA</span>,
                l'IA au service de l'éducation.
              </p>

              {/* Stats 4 · 3 · 2 · 1 */}
              <div className="mt-8 grid grid-cols-4 gap-2 border-y border-white/10 py-5 text-center">
                {[
                  ["4", "Candidats"],
                  ["3", "Jurés"],
                  ["2", "Jours"],
                  ["1", "Champion"],
                ].map(([num, lbl]) => (
                  <div key={lbl}>
                    <div className="font-display text-3xl text-[#7fb4d6]">{num}</div>
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/45">{lbl}</div>
                  </div>
                ))}
              </div>

              {/* Déroulement */}
            

              {/* Tournage */}
              <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Tournage</p>
                <p className="font-display mt-1 text-lg text-white">Dimanche 16 août 2026</p>
                <p className="text-xs text-white/50">Rabat, Maroc</p>
              </div>
            </div>

            <p className="relative z-10 mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
              Innover — Oser — Se dépasser
            </p>
          </aside>

          {/* ============ COLONNE DROITE — Formulaire (blanc) ============ */}
          <div className="bg-white p-8 sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#173955]">
              Formulaire de candidature
            </p>
            <h2 className="font-display mt-1 text-4xl leading-none text-[#0b1c2b] sm:text-[42px]">
              Déposez votre dossier
            </h2>
            <p className="mt-2 text-sm text-[#7a8a99]">
              Cinq informations, un pitch vidéo de deux minutes. Rien de plus.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8">
              {/* ---- Section 1 : Le candidat ---- */}
              <SectionTitle n="1">Le candidat</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="prenom" label="Prénom" placeholder="Aminata" value={form.prenom} onChange={handleChange} onBlur={handleBlur} error={errors.prenom} touched={touched.prenom} />
                <Field id="nom" label="Nom" placeholder="Diallo" value={form.nom} onChange={handleChange} onBlur={handleBlur} error={errors.nom} touched={touched.nom} />
                <Field id="ville" label="Ville de résidence" placeholder="Rabat" value={form.ville} onChange={handleChange} onBlur={handleBlur} error={errors.ville} touched={touched.ville} />
                <Field id="email" label="Adresse e-mail" type="email" placeholder="vous@exemple.com" value={form.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} touched={touched.email} />
              </div>

              {/* ---- Section 2 : Le pitch vidéo ---- */}
              <div className="mt-9">
                <SectionTitle n="2">Le pitch vidéo</SectionTitle>
                <div className="mb-4 rounded-lg border border-[#e0ecf3] bg-[#f4f8fb] px-4 py-3 text-sm text-[#173955]">
                  2 minutes maximum. Présentez-vous et défendez votre vision d'EduIA.
                </div>
                <Field
                  id="pitch"
                  label="Lien de la vidéo"
                  type="url"
                  placeholder="https://youtu.be/..."
                  value={form.pitch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.pitch}
                  touched={touched.pitch}
                  full
                />
                <p className="mt-2 text-xs leading-relaxed text-[#7a8a99]">
                  YouTube, Drive ou LinkedIn — vérifiez que le lien est accessible publiquement
                  ou à toute personne disposant du lien.
                </p>
              </div>

              {/* ---- Section 3 : L'engagement ---- */}
              <div className="mt-9">
                <SectionTitle n="3">L'engagement</SectionTitle>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                    engagementError ? "border-red-300 bg-red-50" : "border-[#e0ecf3] bg-[#f4f8fb] hover:border-[#7fb4d6]"
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded border transition-colors ${
                      form.engagement ? "border-[#173955] bg-[#173955]" : "border-[#7a8a99]/50 bg-white"
                    }`}
                  >
                    {form.engagement && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    name="engagement"
                    checked={form.engagement}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, engagement: e.target.checked }));
                      setTouched((t) => ({ ...t, engagement: true }));
                    }}
                    className="sr-only"
                  />
                  <span className="text-sm leading-relaxed text-[#0b1c2b]">
                    Je confirme être disponible et présent(e) à Rabat le dimanche 16 août 2026 pour le
                    tournage de YIRIHACK 2026, si ma candidature est retenue.
                  </span>
                </label>
                {engagementError && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.engagement}</p>
                )}
              </div>

              {/* ---- Bouton ---- */}
              <button
                type="submit"
                disabled={submitting || !form.engagement}
                className={`group mt-9 flex w-full items-center justify-center gap-3 rounded-lg px-6 py-4 text-[15px] font-bold uppercase tracking-wider text-white
                  transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#173955]/30
                  ${
                    form.engagement
                      ? "bg-[#173955] hover:bg-[#0b1c2b] active:scale-[0.99]"
                      : "cursor-not-allowed bg-[#a9b7c4]"
                  } ${submitting ? "opacity-80" : ""}`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer ma candidature</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {submitError && (
                <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                  {submitError}
                </div>
              )}

              <p className="mt-5 text-center text-xs text-[#7a8a99]">
                Champs marqués d'un astérisque obligatoires. Données utilisées uniquement pour la sélection.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ---------- Modal de succès ---------- */}
      {success && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c2b]/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#e0ecf3] bg-white p-8 text-center shadow-xl sm:p-10"
            style={{ animation: "fadeIn 0.25s ease-out" }}
          >
            <button
              onClick={resetForm}
              aria-label="Fermer"
              className="absolute right-5 top-5 rounded-full bg-[#f4f8fb] p-2 text-[#7a8a99] transition-colors hover:bg-[#e0ecf3] hover:text-[#0b1c2b]"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f8fb]"
              style={{ animation: "popIn 0.35s ease-out 0.1s both" }}
            >
              <CheckCircle2 className="h-9 w-9 text-[#173955]" strokeWidth={2.5} />
            </div>

            <h2 id="success-title" className="font-display text-2xl text-[#0b1c2b]">
              Candidature envoyée !
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#7a8a99]">
              Merci <span className="font-semibold text-[#0b1c2b]">{form.prenom}</span>, votre dossier
              a bien été reçu. L'équipe YiriHack reviendra vers vous très prochainement.
            </p>

            <button
              onClick={resetForm}
              className="mt-8 w-full rounded-lg bg-[#173955] px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-150 hover:bg-[#0b1c2b] active:scale-[0.99]"
            >
              Envoyer une autre candidature
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
