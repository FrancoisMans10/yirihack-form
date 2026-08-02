import React, { useState } from "react";
import {
  User,
  MapPin,
  Mail,
  Video,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
// Place le fichier du logo dans src/assets/ (ex: src/assets/yirihack-logo.png)
// puis ajuste le chemin d'import ci-dessous si besoin.
import yiriHackLogo from "./assets/yirihack-logo.png";

// ⚠️ À CONFIGURER : ton endpoint Formspree (Dashboard → ton formulaire → URL).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xeeybpwy";

/**
 * Formulaire de candidature — YiriHack, 1ère Édition (Yiri Tech Africa)
 * -----------------------------------------------------------------------
 * Palette imposée par la charte (issue du logo) :
 *  - Bleu Cyan / Royal (mot "HACK", focus, boutons) : #005A9C
 *  - Noir pur (mot "YIRI", titres)                   : #000000
 *  - Vert feuillage (accent, succès)                 : #2E7D32
 *  - Fond de page                                     : #F8FAFC
 *  - Fond de carte                                    : #FFFFFF
 *
 * Polices : Montserrat (titres) + Inter (champs), via Google Fonts.
 */

const initialForm = { prenom: "", nom: "", ville: "", email: "", pitch: "" };
const initialTouched = {
  prenom: false,
  nom: false,
  ville: false,
  email: false,
  pitch: false,
};

function validate(form) {
  const errors = {};

  if (!form.prenom.trim()) errors.prenom = "Le prénom est requis.";
  else if (form.prenom.trim().length < 2) errors.prenom = "2 caractères minimum.";

  if (!form.nom.trim()) errors.nom = "Le nom est requis.";
  else if (form.nom.trim().length < 2) errors.nom = "2 caractères minimum.";

  if (!form.ville.trim()) errors.ville = "La ville et le pays sont requis.";

  if (!form.email.trim()) errors.email = "L'adresse e-mail est requise.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Format d'e-mail invalide.";

  if (!form.pitch.trim()) errors.pitch = "Le lien de la vidéo est requis.";
  else if (!/^https?:\/\/.+\..+/.test(form.pitch.trim()))
    errors.pitch = "Merci de fournir un lien valide (https://...).";

  return errors;
}

// Champ de formulaire réutilisable : icône, focus animé, message d'erreur
function FormField({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  helper,
  full = false,
}) {
  const showError = touched && error;

  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/70"
      >
        {label} <span className="text-[#005A9C]">*</span>
      </label>

      <div className="group relative">
        <Icon
          className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-200 ${
            showError ? "text-red-400" : "text-black/35 group-focus-within:text-[#005A9C]"
          }`}
          strokeWidth={2}
        />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full rounded-2xl border bg-[#F8FAFC] py-3.5 pl-12 pr-4 text-[15px] text-gray-900 placeholder:text-gray-400
            outline-none transition-all duration-300 ease-out
            focus:bg-white focus:shadow-[0_4px_16px_-4px_rgba(0,90,156,0.15)] focus:ring-4 focus:ring-[#005A9C]/10
            ${
              showError
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 hover:border-gray-300 focus:border-[#005A9C]"
            }`}
        />
      </div>

      {helper && !showError && (
        <p className="mt-2 text-xs leading-relaxed text-gray-500">{helper}</p>
      )}
      {showError && <p className="mt-2 text-xs font-semibold text-red-500">{error}</p>}
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
    setTouched({ prenom: true, nom: true, ville: true, email: true, pitch: true });
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
          "Ville & Pays": form.ville,
          Email: form.email,
          "Lien pitch vidéo": form.pitch,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setSubmitError("L'envoi a échoué. Vérifie ta connexion et réessaie dans un instant.");
      }
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

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] px-4 py-12 selection:bg-[#005A9C] selection:text-white sm:py-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
        /* Texture de fond très légère, discrète, pour éviter un aplat trop plat */
        .bg-dot-grid {
          background-image: radial-gradient(circle, rgba(0,90,156,0.06) 1px, transparent 1px);
          background-size: 22px 22px;
        }
      `}</style>

      <div className="font-body relative mx-auto w-full max-w-2xl">
        {/* Texture discrète en fond de page */}
        <div className="bg-dot-grid pointer-events-none absolute -inset-x-10 -top-10 h-56 opacity-70" />

        {/* ---------- Carte principale ---------- */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-15px_rgba(0,90,156,0.12)] ring-1 ring-black/[0.03] transition-shadow duration-300 hover:shadow-[0_25px_60px_-15px_rgba(0,90,156,0.16)]">
          {/* Liseré tricolore en haut de la carte */}
          <div className="h-1.5 w-full bg-gradient-to-r from-black via-[#005A9C] to-[#2E7D32]" />

          {/* ---------- En-tête ---------- */}
          <div className="relative border-b border-gray-100 bg-white px-6 pb-9 pt-10 sm:px-12 sm:pt-12">
            <div className="flex flex-col items-center text-center">
              {/* Logo dans une capsule douce avec halo tricolore au survol */}
              <div className="group relative mb-6">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#005A9C]/25 via-black/5 to-[#2E7D32]/25 opacity-60 blur-md transition duration-300 group-hover:opacity-100" />
                <div className="relative flex h-20 w-40 items-center justify-center rounded-2xl border border-gray-100 bg-white px-3 py-2 shadow-sm">
                  <img
                    src={yiriHackLogo}
                    alt="Logo YiriHack, 1ère Édition"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#005A9C]/8 px-4 py-1.5 text-xs font-bold tracking-wide text-[#005A9C]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>1ère Édition · Yiri Tech Africa</span>
              </div>

              <h1 className="font-display text-[28px] font-extrabold leading-tight text-black sm:text-4xl">
                Candidature <span className="text-black">YIRI</span>
                <span className="text-[#005A9C]">HACK</span>
              </h1>

              {/* Petit accent décoratif sous le titre, aux 3 couleurs de la charte */}
              <div className="mt-4 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                <span className="h-1.5 w-6 rounded-full bg-[#005A9C]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]" />
              </div>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500 sm:text-[15px]">
                Rejoignez la révolution technologique africaine. Renseignez vos
                informations pour inscrire votre projet.
              </p>
            </div>
          </div>

          {/* ---------- Formulaire ---------- */}
          <form onSubmit={handleSubmit} noValidate className="px-6 py-8 sm:px-12 sm:py-10">
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
              <FormField
                id="prenom"
                label="Prénom"
                icon={User}
                placeholder="Ex : Amadou"
                value={form.prenom}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.prenom}
                touched={touched.prenom}
              />

              <FormField
                id="nom"
                label="Nom"
                icon={User}
                placeholder="Ex : Diallo"
                value={form.nom}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nom}
                touched={touched.nom}
              />

              <FormField
                id="ville"
                label="Ville & Pays de résidence"
                icon={MapPin}
                placeholder="Ex : Rabat, Maroc / Casablanca, Maroc"
                value={form.ville}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.ville}
                touched={touched.ville}
                full
              />

              <FormField
                id="email"
                label="Adresse e-mail"
                icon={Mail}
                type="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                full
              />

              <FormField
                id="pitch"
                label="Pitch vidéo"
                icon={Video}
                type="url"
                placeholder="Lien YouTube, Drive, LinkedIn ou Dropbox"
                value={form.pitch}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.pitch}
                touched={touched.pitch}
                helper="Déposez ici le lien vers votre vidéo de présentation (max 90 secondes). Assurez-vous que les permissions du lien sont publiques."
                full
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-10 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#005A9C] px-6 py-4 text-[15px] font-bold text-white
                shadow-[0_10px_25px_-5px_rgba(0,90,156,0.35)] transition-all duration-300 ease-out
                hover:bg-black hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)] active:scale-[0.99]
                focus:outline-none focus:ring-4 focus:ring-[#005A9C]/25
                disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#005A9C] disabled:active:scale-100"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <span>Envoyer ma candidature</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </>
              )}
            </button>

            {submitError && (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                {submitError}
              </div>
            )}

            <p className="mt-5 text-center text-xs text-gray-400">
              En soumettant ce formulaire, vous acceptez d'être contacté(e) par
              l'équipe Yiri Tech Africa au sujet de YiriHack.
            </p>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-gray-400">
          © {new Date().getFullYear()} Yiri Tech Africa — YiriHack, 1ère Édition
        </p>
      </div>

      {/* ---------- Modal de succès ---------- */}
      {success && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10"
            style={{ animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
          >
            <button
              onClick={resetForm}
              aria-label="Fermer"
              className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-black"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2E7D32]/10"
              style={{ animation: "popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}
            >
              <CheckCircle2 className="h-9 w-9 text-[#2E7D32]" strokeWidth={2.5} />
            </div>

            <h2 id="success-title" className="font-display text-xl font-extrabold text-black">
              Candidature envoyée !
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Merci <span className="font-semibold text-black">{form.prenom}</span>, votre
              candidature a bien été reçue. L'équipe YiriHack reviendra vers vous très
              prochainement.
            </p>

            <button
              onClick={resetForm}
              className="mt-8 w-full rounded-2xl bg-[#005A9C] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#005A9C]/25 transition-all duration-300 hover:bg-black active:scale-[0.99]"
            >
              Envoyer une autre candidature
            </button>
          </div>
        </div>
      )}
    </div>
  );
}