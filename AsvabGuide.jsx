import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowRight, Calculator, CheckCircle2, ListChecks } from "lucide-react";
import GuidePage, { GSection } from "@/components/GuidePage";
import { SUBTEST_GUIDES, AFQT_CATEGORIES, BRANCHES, CHEATSHEETS } from "@/lib/asvab/guides";
import { getBankSize } from "@/lib/asvab/questionBank";

// One comprehensive, single-page ASVAB guide. Everything a candidate needs —
// every subtest, the AFQT, line scores and branch minimums, a study plan, test
// day and a deep FAQ — inlined on one URL to maximise search coverage. The data
// lives in src/lib/asvab/guides.js (cross-verified); this page renders all of it.

const FAQ = [
  {
    q: "What is the ASVAB?",
    a: "The ASVAB (Armed Services Vocational Aptitude Battery) is the standardized test used by all branches of the U.S. military to determine enlistment eligibility and which military jobs you qualify for. It is made up of separate subtests covering verbal, math, science, technical and spatial skills.",
  },
  {
    q: "What is the AFQT and how is it different from the ASVAB?",
    a: "The AFQT (Armed Forces Qualification Test) is not a separate test — it is a percentile score calculated from just four ASVAB subtests: Word Knowledge, Paragraph Comprehension, Arithmetic Reasoning and Mathematics Knowledge. Your AFQT score decides whether you can enlist. The other subtests feed the line scores that qualify you for specific jobs.",
  },
  {
    q: "What is a good ASVAB score?",
    a: "AFQT is reported as a percentile from 1 to 99, so a 50 means you scored better than half of the reference group. Most branches want at least a high-30s to low-50s AFQT to enlist, and 50+ opens far more jobs and bonuses. A score of 65+ (Category II) is competitive for almost any role, and 93+ (Category I) is the top tier.",
  },
  {
    q: "How many questions are on the ASVAB and how long does it take?",
    a: "The computer-adaptive CAT-ASVAB has about 135 questions and takes roughly 2.5 to 3 hours. The paper-and-pencil version has 225 questions in about 149 minutes. Because the computer version adapts to your answers, exact per-subtest counts vary.",
  },
  {
    q: "Can I use a calculator on the ASVAB?",
    a: "No. Calculators are not allowed on any version of the ASVAB. Scratch paper is provided at the test center, so practise doing arithmetic and algebra by hand.",
  },
  {
    q: "How is the ASVAB scored?",
    a: "Each subtest is first converted to a standard score (mean 50, standard deviation 10). Your AFQT comes from the formula 2×VE + Arithmetic Reasoning + Mathematics Knowledge, where VE (Verbal Expression) is built from Word Knowledge and Paragraph Comprehension. That raw AFQT is then converted to a 1–99 percentile against a national reference sample.",
  },
  {
    q: "What happens if I fail the ASVAB?",
    a: "You cannot really 'fail' the ASVAB — but if your AFQT is below your branch's minimum you won't qualify to enlist. You can retake it. The standard waiting periods are one calendar month before your first retest, another month before a second retest, and six months before any further attempts.",
  },
  {
    q: "How long are ASVAB scores valid?",
    a: "ASVAB scores are valid for two years from the test date for enlistment purposes.",
  },
  {
    q: "Where do I take the ASVAB?",
    a: "Most enlistment applicants take the ASVAB at a Military Entrance Processing Station (MEPS) or a satellite Military Entrance Test (MET) site. High-school students often take the paper version (the Career Exploration Program) at school, but that version cannot always be used directly for enlistment.",
  },
  {
    q: "Which subtests should I study first?",
    a: "Start with the four AFQT subtests — Word Knowledge, Paragraph Comprehension, Arithmetic Reasoning and Mathematics Knowledge — because they decide whether you can enlist at all. Once those are solid, focus on the technical subtests (Electronics, Auto, Shop, Mechanical, General Science) that set the line scores for the specific jobs you want.",
  },
  {
    q: "Is the Assembling Objects subtest on every ASVAB?",
    a: "Assembling Objects (AO) appears on the CAT-ASVAB and is used mainly by the Navy for certain spatial line scores. Not every branch uses it to qualify jobs, but it can still be administered.",
  },
  {
    q: "Is ASVAB Ready free?",
    a: "Yes. Every practice question, worked explanation and study guide on ASVAB Ready is free. You can start practising Arithmetic Reasoning with no account, and a free sign-up unlocks every other subtest — there is no paywall.",
  },
];

export default function AsvabGuide() {
  const totalQ = SUBTEST_GUIDES.reduce((n, g) => {
    const s = getBankSize(g.id);
    return n + (Number.isFinite(s) ? s : 0); // AO is procedurally generated
  }, 0);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "The Complete ASVAB Study Guide",
      description:
        "A complete, free guide to the ASVAB: every subtest, the AFQT, how scoring and line scores work, branch requirements, a study plan and an FAQ.",
      author: { "@type": "Organization", name: "ASVAB Ready" },
      publisher: { "@type": "Organization", name: "ASVAB Ready" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  const afqt = SUBTEST_GUIDES.filter((g) => g.afqt);
  const rest = SUBTEST_GUIDES.filter((g) => !g.afqt);

  const Subtest = ({ g }) => {
    const n = getBankSize(g.id);
    const qLabel = n ? (Number.isFinite(n) ? `${n} practice questions` : "unlimited generated questions") : null;
    const sheet = CHEATSHEETS[g.id];
    return (
      <div id={`st-${g.id}`} className="mt-8 scroll-mt-24 border-t border-border pt-8 first:border-0 first:pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">{g.name}</h3>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-muted-foreground">{g.abbr}</span>
          {g.afqt && <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">AFQT subtest</span>}
        </div>
        <p className="mt-2">{g.blurb}</p>

        {g.sections.map((s) => (
          <div key={s.h} className="mt-3">
            <h4 className="font-heading text-[15px] font-semibold text-foreground">{s.h}</h4>
            <p className="mt-1">{s.p}</p>
          </div>
        ))}

        {g.keyPoints?.length > 0 && (
          <div className="mt-3 rounded-2xl border border-border bg-muted/30 p-4">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground"><ListChecks className="h-4 w-4 text-brand" /> Key points</div>
            <ul className="space-y-1.5">
              {g.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> <span>{k}</span></li>
              ))}
            </ul>
          </div>
        )}

        {sheet?.length > 0 && (
          <details className="group mt-3 rounded-2xl border border-border bg-card p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground">
              {g.name} quick-reference cheat sheet
              <ChevronRight className="h-4 w-4 text-muted-foreground transition group-open:rotate-90" />
            </summary>
            <div className="mt-3 space-y-3">
              {sheet.map((block) => (
                <div key={block.h}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{block.h}</div>
                  <ul className="mt-1 space-y-1">
                    {block.items.map((it, i) => (
                      <li key={i} className="text-sm leading-relaxed">{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        )}

        <Link to={`/tests/${g.id}`} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
          Practise {g.name} free {qLabel && <span className="font-normal text-muted-foreground">· {qLabel}</span>} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  };

  const toc = [
    { href: "#how-built", label: "How the ASVAB is built" },
    { href: "#afqt", label: "The AFQT explained" },
    { href: "#subtests", label: "Every subtest, in detail" },
    { href: "#scores", label: "Line scores & branch requirements" },
    { href: "#categories", label: "AFQT categories" },
    { href: "#study-plan", label: "A 6-week study plan" },
    { href: "#test-day", label: "Test day & retakes" },
    { href: "#faq", label: "Frequently asked questions" },
  ];

  return (
    <GuidePage
      title="The Complete ASVAB Study Guide (2026) — Every Subtest, AFQT & Scores | ASVAB Ready"
      description="The complete free ASVAB guide on one page: every subtest explained, the AFQT and how it's scored, line scores and branch minimums, a study plan, test-day tips and a full FAQ — with free practice for each subtest."
      canonicalPath="/asvab-guide"
      jsonLd={jsonLd}
      eyebrow="ASVAB Study Guide"
      heading="The complete ASVAB study guide"
      crumbs={[{ label: "Study guide" }]}
    >
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        This is the complete guide to the <strong className="text-foreground">ASVAB</strong> — everything on one page. The Armed
        Services Vocational Aptitude Battery is the test the U.S. military uses to decide who can enlist and which jobs they
        qualify for. Below you'll find exactly how the test is built, how the all-important <strong className="text-foreground">AFQT</strong> score
        is calculated, a full breakdown of <strong className="text-foreground">every subtest</strong> with what's on it and how to
        study, the <strong className="text-foreground">line scores and minimum scores for all six branches</strong>, a study plan,
        test-day logistics and a detailed FAQ. Every subtest links to a free practice set with worked explanations.
      </p>

      {/* Table of contents */}
      <nav aria-label="Contents" className="mt-6 rounded-2xl border border-border bg-muted/30 p-5">
        <div className="text-sm font-semibold text-foreground">On this page</div>
        <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {toc.map((t) => (
            <li key={t.href}>
              <a href={t.href} className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
                <ChevronRight className="h-3.5 w-3.5" /> {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <GSection id="how-built" h="How the ASVAB is built">
        <p>
          There are two versions of the ASVAB. The computer-adaptive <strong className="text-foreground">CAT-ASVAB</strong>, used
          at most Military Entrance Processing Stations (MEPS), has about <strong className="text-foreground">135 questions</strong> and
          takes roughly 2.5–3 hours. It adapts to you: answer correctly and the next question gets harder, so a strong candidate
          sees fewer, tougher questions. You cannot skip a question or go back to change an answer, and there is a time limit for
          each subtest.
        </p>
        <p>
          The <strong className="text-foreground">paper-and-pencil ASVAB</strong> has <strong className="text-foreground">225
          questions</strong> in about 149 minutes and is not adaptive — you can move around within a subtest's own time limit. On
          the paper test, Auto Information and Shop Information are combined into a single Auto &amp; Shop subtest, which is why you'll
          see the ASVAB described as having nine or ten subtests depending on the version.
        </p>
        <p>
          No calculators are allowed on either version; scratch paper is provided. Because the computer version adapts, focus your
          preparation on mastering the content rather than memorising a fixed number of questions.
        </p>
        <p>
          <Link to="/asvab-scores" className="inline-flex items-center gap-1 font-medium text-brand hover:underline"><Calculator className="h-4 w-4" /> See a worked example of how the AFQT and line scores are calculated</Link>.
        </p>
      </GSection>

      <GSection id="afqt" h="The AFQT explained (the score that lets you enlist)">
        <p>
          The <strong className="text-foreground">AFQT (Armed Forces Qualification Test)</strong> is not a separate test — it's a
          score pulled from just four ASVAB subtests:
        </p>
        <ul className="ml-1 space-y-1">
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Word Knowledge (WK)</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Paragraph Comprehension (PC)</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Arithmetic Reasoning (AR)</li>
          <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> Mathematics Knowledge (MK)</li>
        </ul>
        <p>
          Word Knowledge and Paragraph Comprehension are first combined into a <strong className="text-foreground">Verbal
          Expression (VE)</strong> score. The AFQT is then calculated as <strong className="text-foreground">2 × VE + AR + MK</strong>.
          Because VE is doubled, your <em>verbal</em> performance carries as much weight as both math subtests combined — so
          vocabulary and reading are worth serious study time.
        </p>
        <p>
          That raw number is converted to a <strong className="text-foreground">percentile from 1 to 99</strong> against a national
          reference sample. An AFQT of 50 means you scored as well as or better than 50% of that group. Your AFQT decides
          eligibility; the remaining subtests decide which jobs you can hold.
        </p>
      </GSection>

      <GSection id="subtests" h="Every subtest, in detail">
        <p>
          The ASVAB has ten subtests (nine on the paper version). The four <strong className="text-foreground">AFQT subtests</strong> come
          first below because they decide whether you can enlist; the <strong className="text-foreground">technical and spatial
          subtests</strong> follow. Each one lists what's on it, how to study, the key points, an optional cheat sheet, and a link to
          free practice.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUBTEST_GUIDES.map((g) => (
            <a key={g.id} href={`#st-${g.id}`} className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand/40 hover:text-brand">
              {g.name}
            </a>
          ))}
        </div>

        <h3 className="mt-8 font-heading text-base font-bold uppercase tracking-wide text-brand">The four AFQT subtests</h3>
        {afqt.map((g) => <Subtest key={g.id} g={g} />)}

        <h3 className="mt-10 font-heading text-base font-bold uppercase tracking-wide text-brand">The technical &amp; spatial subtests</h3>
        {rest.map((g) => <Subtest key={g.id} g={g} />)}
      </GSection>

      <GSection id="scores" h="Line scores & branch requirements">
        <p>
          Beyond the AFQT, each branch combines the subtests into its own <strong className="text-foreground">line scores</strong> (also
          called composites or aptitude areas) to qualify you for specific jobs. The minimum AFQT to enlist and the composites differ
          by branch. Numbers below reflect 2025–26 reporting and move with recruiting demand — always
          <strong className="text-foreground"> confirm current cut scores with a recruiter</strong>.
        </p>
        {BRANCHES.map((b) => (
          <div key={b.id} className="mt-6 rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">{b.name}</h3>
              <div className="text-sm">
                <span className="font-semibold text-foreground">Min AFQT:</span>{" "}
                <span className="text-muted-foreground">{b.minDiploma} (diploma) · {b.minGED} (GED)</span>
              </div>
            </div>
            {b.minNote && <p className="mt-1 text-sm text-muted-foreground">{b.minNote}</p>}

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line scores</div>
                <ul className="mt-1 space-y-1">
                  {b.composites.map((c) => (
                    <li key={c.name} className="text-sm">
                      <span className="font-medium text-foreground">{c.name}</span>{" "}
                      <span className="text-muted-foreground">= {c.formula}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Example job cut scores</div>
                <ul className="mt-1 space-y-1">
                  {b.jobs.map((j) => (
                    <li key={j.name} className="text-sm">
                      <span className="font-medium text-foreground">{j.name}</span> — <span className="text-muted-foreground">{j.req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {b.note && <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{b.note}</p>}
          </div>
        ))}
        <p className="mt-4">
          Abbreviations: <strong className="text-foreground">VE</strong> Verbal Expression, <strong className="text-foreground">AR</strong> Arithmetic
          Reasoning, <strong className="text-foreground">MK</strong> Mathematics Knowledge, <strong className="text-foreground">GS</strong> General
          Science, <strong className="text-foreground">EI</strong> Electronics Information, <strong className="text-foreground">AS</strong> Auto
          &amp; Shop, <strong className="text-foreground">MC</strong> Mechanical Comprehension.
        </p>
        <p>
          <Link to="/asvab-jobs" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">Match your estimated scores to real jobs with the job matcher <ArrowRight className="h-4 w-4" /></Link>
        </p>
      </GSection>

      <GSection id="categories" h="AFQT categories">
        <p>
          The military groups AFQT percentiles into categories. Categories I–IIIA (50 and above) are the most sought-after;
          Category IV and below face tight quotas or don't qualify.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold text-foreground">Category</th>
                <th className="py-2 pr-4 font-semibold text-foreground">AFQT percentile</th>
              </tr>
            </thead>
            <tbody>
              {AFQT_CATEGORIES.map((c) => (
                <tr key={c.cat} className="border-b border-border/60">
                  <td className="py-2 pr-4 font-medium text-foreground">Category {c.cat}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{c.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GSection>

      <GSection id="study-plan" h="A 6-week ASVAB study plan">
        <p>Six weeks is enough to move your AFQT meaningfully if you study deliberately. A sample plan:</p>
        <ul className="ml-1 space-y-2">
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 1 —</span> <span>Take a full practice run to get a baseline AFQT and see your weakest subtests. Don't study yet; just diagnose.</span></li>
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 2 —</span> <span>Attack your weakest AFQT math subtest (Arithmetic Reasoning or Mathematics Knowledge). Drill formulas until they're automatic, and read every worked explanation.</span></li>
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 3 —</span> <span>Build vocabulary and reading. Word Knowledge and Paragraph Comprehension form VE, which is doubled — learn roots, prefixes and suffixes, and practise finding the main idea fast.</span></li>
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 4 —</span> <span>Re-test the four AFQT subtests to confirm progress, then start the technical subtests that matter for the jobs you want (Electronics, Auto, Shop, Mechanical, General Science).</span></li>
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 5 —</span> <span>Full-length timed practice to build stamina and pacing. Review every miss and note recurring mistakes.</span></li>
          <li className="flex gap-2"><span className="font-semibold text-foreground">Week 6 —</span> <span>Light review of your cheat sheets and weak spots, one final full practice test mid-week, then rest the day before. Don't cram new material.</span></li>
        </ul>
        <Link to="/" className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
          Start free practice <ArrowRight className="h-4 w-4" />
        </Link>
      </GSection>

      <GSection id="test-day" h="Test day, retakes & score validity">
        <p>
          Most enlistment applicants test at a <strong className="text-foreground">MEPS</strong> or a satellite MET site. Bring a
          valid photo ID, arrive early, and expect a quiet, proctored room. You can't bring a calculator, phone or your own scratch
          paper — everything you need is provided.
        </p>
        <p>
          On the CAT-ASVAB you answer one question at a time and <strong className="text-foreground">can't skip or go back</strong>, so
          don't leave anything blank — a considered guess is always better than a blank. Manage the per-subtest clock: if you're
          stuck, eliminate what you can and move on.
        </p>
        <p>
          <strong className="text-foreground">Retakes:</strong> you must wait <strong className="text-foreground">one calendar
          month</strong> before your first retest, another month before a second retest, and <strong className="text-foreground">six
          months</strong> before any further attempts. <strong className="text-foreground">Scores are valid for two years</strong> from
          the test date for enlistment.
        </p>
      </GSection>

      <GSection id="library" h="Our free practice-question library">
        <p>Every question is original, independently verified, and comes with a worked explanation — free, no paywall. In the bank now:</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUBTEST_GUIDES.map((g) => {
            const n = getBankSize(g.id);
            if (!n) return null;
            const label = Number.isFinite(n) ? `${n} questions` : "unlimited · generated";
            return (
              <Link key={g.id} to={`/tests/${g.id}`} className="rounded-xl border border-border bg-card px-3 py-2 transition hover:border-brand/40">
                <div className="text-sm font-semibold">{g.name}</div>
                <div className="text-xs text-muted-foreground">{label} · {g.abbr}</div>
              </Link>
            );
          })}
        </div>
        {totalQ > 0 && <p className="mt-3 text-sm font-medium text-foreground">{totalQ} verified practice questions — and growing.</p>}
      </GSection>

      <GSection id="faq" h="Frequently asked questions">
        <div className="divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-foreground">
                {f.q}
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
        <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark">
          Start practising free <ArrowRight className="h-4 w-4" />
        </Link>
      </GSection>
    </GuidePage>
  );
}
