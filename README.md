# NIST 800-53 Policy Gap Analyzer
## Live Tool
https://racee98.github.io/nist-policy-gap-analyzer/

A self-contained compliance tool that compares internal security policies against NIST SP 800-53 Rev 5 controls. No installation, no internet connection, no API keys required — open the file in a browser and it works.

---

## What it does

Paste any internal security policy document and the analyzer cross-references it against 36 NIST SP 800-53 Rev 5 controls across 10 control families. It classifies each control as **Implemented**, **Partial**, or **Not Addressed** and explains why in plain language.

Every finding includes:
- The specific sentence from your policy that maps to the control
- An analyst comment explaining the classification
- A concrete recommendation for closing the gap

When the analysis is complete, three report files are available to download:

| File | Format | Purpose |
|---|---|---|
| `NIST_800_53_Policy_Gap_Report.md` | Markdown | Human-readable report for managers and auditors |
| `Gap_Report_Data.json` | JSON | Structured export for GRC tools or automation |
| `Remediation_Checklist.csv` | CSV | Trackable action items for control owners |

---

## Who this is for

- GRC analysts running initial policy assessments before a formal audit
- Compliance officers tracking policy coverage across NIST control families
- IT auditors who need structured gap evidence quickly
- Junior security analysts learning how internal policies map to NIST controls

---

## How to use it

**Option 1 — Open in a browser**

Download `gap_analyzer.html` and double-click it. No server or setup needed. Works entirely offline.

**Option 2 — Use inside Claude**

1. Copy the full contents of `gap_analyzer.html`
2. Paste into Claude and say: *"Render this as an artifact"*
3. The interactive tool loads immediately

**Option 3 — Store in a Claude Project**

1. Go to claude.ai → Projects → New Project
2. Upload `gap_analyzer.html` to Project Knowledge
3. Set a project system prompt: *"When the user says 'load the analyzer', render the artifact from project knowledge"*
4. Type `load the analyzer` any time to spin it up — no searching through old conversations

See `docs/SOP_PolicyGapAnalyzer.docx` for the full standard operating procedure including data handling rules.

---

## NIST 800-53 Rev 5 coverage

| Family | Controls included |
|---|---|
| AC — Access Control | AC-1, AC-2, AC-3, AC-5, AC-6, AC-7, AC-11, AC-17 |
| AU — Audit & Accountability | AU-1, AU-2, AU-3, AU-6, AU-9 |
| CM — Configuration Management | CM-2, CM-6, CM-7 |
| CP — Contingency Planning | CP-2, CP-4, CP-9 |
| IA — Identification & Authentication | IA-2, IA-4, IA-5, IA-8 |
| IR — Incident Response | IR-1, IR-4, IR-5, IR-6 |
| MP — Media Protection | MP-2, MP-6 |
| RA — Risk Assessment | RA-3, RA-5 |
| SC — System & Communications Protection | SC-5, SC-8, SC-12, SC-28 |
| SI — System & Information Integrity | SI-2, SI-3, SI-4 |

---

## How the analysis works

Each NIST control is pre-loaded with a set of keywords drawn from the control statement and common compliant policy language. When you run an analysis, the tool scores your policy text against each control's keyword set and classifies it:

- **35% or more keyword match** → Implemented
- **10–34% match** → Partial
- **Under 10% match** → Not Addressed

The highest-scoring sentence from your policy is pulled out as the evidence snippet for that control. All processing happens in the browser — no text is transmitted anywhere.

---

## Limitations

- **Keyword matching is not the same as control effectiveness.** A policy can contain the right words without implementing the control correctly. Treat findings as a starting point for human review, not a final determination.
- **Coverage is not exhaustive.** 36 controls are included. Full NIST 800-53 Rev 5 has over 1,000 controls and enhancements. Supplement with a formal audit for complete assessments.
- **Always review exported results before submitting to an auditor.** The CSV checklist includes a Completed column specifically so analysts can correct and sign off on each finding.

---

## Adding more controls

To add a control, open `gap_analyzer.html` in a text editor and add an entry to the `NIST` array:

```javascript
{
  id: "AC-18",
  fam: "AC",
  title: "Wireless access",
  keys: ["wireless", "wifi", "802.11", "wireless access", "wlan"],
  ex: "Wireless access requires authentication and encryption.",
  reco: "Define approved wireless protocols and encryption standards."
}
```

---

## Files in this repo

```
nist-policy-gap-analyzer/
├── gap_analyzer.html               # The full self-contained tool
├── README.md                       # This file
└── docs/
    └── SOP_PolicyGapAnalyzer.docx  # Standard operating procedure
```

---

## References

- [NIST SP 800-53 Rev 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — Security and Privacy Controls for Information Systems
- [NIST SP 800-53B](https://csrc.nist.gov/publications/detail/sp/800-53b/final) — Control Baselines
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## License

MIT — free to use, adapt, and share.
