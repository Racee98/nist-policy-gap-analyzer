import { useState, useRef } from "react";

const ACCENT = "#00FFB2";
const BG = "#0A0E1A";
const CARD = "#111827";
const BORDER = "#1E2D45";

const SYSTEM_PROMPT = `You are a senior NIST 800-53 Rev. 5 cybersecurity policy analyst. 
A user will paste a security policy document. Your job is to analyze it and return a JSON gap analysis report.

Return ONLY valid JSON — no markdown, no backticks, no explanation outside the JSON.

Return this exact structure:
{
  "policyTitle": "detected or inferred policy title",
  "overallRiskRating": "HIGH | MEDIUM | LOW",
  "complianceScore": <number 0-100>,
  "executiveSummary": "2-3 sentence plain-English summary for a CISO",
  "gaps": [
    {
      "controlId": "e.g. AC-2",
      "controlName": "e.g. Account Management",
      "finding": "What is missing or insufficient in the policy",
      "riskLevel": "HIGH | MEDIUM | LOW",
      "recommendation": "Specific actionable fix"
    }
  ],
  "strengths": ["strength 1", "strength 2"],
  "nextSteps": ["step 1", "step 2", "step 3"]
}

Focus on the most relevant NIST 800-53 control families. Identify 4-8 gaps. Be specific and professional. Use DoD/federal compliance language where appropriate.`;

const SAMPLE_POLICY = `APEX DEFENSE CONTRACTORS LLC
ACCESS CONTROL POLICY
Version 1.0 | Effective Date: January 2024

1. PURPOSE
This policy establishes access control requirements for all Apex systems.

2. SCOPE
Applies to all employees with system access.

3. POLICY STATEMENTS
3.1 - All users must have a username and password.
3.2 - Passwords must be changed every 90 days.
3.3 - Managers approve new user access requests via email.
3.4 - System access is reviewed annually.
3.5 - Terminated employees will have access removed within one week.`;

const riskColor = (level) => {
  if (level === "HIGH") return "#FF4D4D";
  if (level === "MEDIUM") return "#FFB800";
  return "#00FFB2";
};

const riskBg = (level) => {
  if (level === "HIGH") return "rgba(255,77,77,0.1)";
  if (level === "MEDIUM") return "rgba(255,184,0,0.1)";
  return "rgba(0,255,178,0.1)";
};

export default function PolicyGapAnalyzer() {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const textareaRef = useRef();

  const analyze = async () => {
    if (!policy.trim()) return;
    setLoading(true);
    setReport(null);
    setError("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this policy:\n\n${policy}` }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setReport(parsed);
    } catch (err) {
      setError("Analysis failed. Check the policy text and try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => setPolicy(SAMPLE_POLICY);

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      fontFamily: "'Courier New', monospace",
      color: "#E2E8F0",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: ACCENT, boxShadow: `0 0 12px ${ACCENT}`
          }} />
          <span style={{ color: ACCENT, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>
            NIST 800-53 Rev. 5 · AI-Powered
          </span>
        </div>
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 700,
          margin: "0 0 6px",
          color: "#F8FAFC",
          letterSpacing: -0.5,
        }}>
          Policy Gap Analyzer
        </h1>
        <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 32px" }}>
          Paste any security policy · Get an instant NIST 800-53 gap analysis
        </p>

        {/* Input Card */}
        <div style={{
          background: CARD, border: `1px solid ${BORDER}`,
          borderRadius: 12, padding: 24, marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "#64748B", letterSpacing: 1, textTransform: "uppercase" }}>
              Policy Document Input
            </span>
            <button onClick={loadSample} style={{
              background: "transparent", border: `1px solid ${BORDER}`,
              color: ACCENT, fontSize: 11, padding: "4px 12px",
              borderRadius: 6, cursor: "pointer", letterSpacing: 1,
            }}>
              LOAD SAMPLE
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={policy}
            onChange={e => setPolicy(e.target.value)}
            placeholder="Paste your security policy here..."
            style={{
              width: "100%", minHeight: 180, background: "#0D1321",
              border: `1px solid ${BORDER}`, borderRadius: 8,
              color: "#CBD5E1", fontSize: 13, padding: 14,
              resize: "vertical", outline: "none", boxSizing: "border-box",
              fontFamily: "inherit", lineHeight: 1.6,
            }}
          />
          <button
            onClick={analyze}
            disabled={loading || !policy.trim()}
            style={{
              marginTop: 14, width: "100%", padding: "14px",
              background: loading || !policy.trim() ? "#1E2D45" : ACCENT,
              color: loading || !policy.trim() ? "#4A5568" : "#0A0E1A",
              border: "none", borderRadius: 8, fontSize: 13,
              fontWeight: 700, cursor: loading || !policy.trim() ? "not-allowed" : "pointer",
              letterSpacing: 2, textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            {loading ? "◌  ANALYZING..." : "▶  RUN GAP ANALYSIS"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,77,77,0.1)", border: "1px solid #FF4D4D",
            borderRadius: 8, padding: 14, marginBottom: 20, color: "#FF4D4D", fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Report */}
        {report && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Score Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "Compliance Score", value: `${report.complianceScore}%`, color: report.complianceScore >= 70 ? ACCENT : report.complianceScore >= 40 ? "#FFB800" : "#FF4D4D" },
                { label: "Overall Risk", value: report.overallRiskRating, color: riskColor(report.overallRiskRating) },
                { label: "Gaps Found", value: report.gaps?.length || 0, color: "#E2E8F0" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  background: CARD, border: `1px solid ${BORDER}`,
                  borderRadius: 10, padding: "18px 16px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Executive Summary */}
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20,
            }}>
              <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
                Executive Summary
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#CBD5E1" }}>
                {report.executiveSummary}
              </p>
            </div>

            {/* Gaps */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
                Control Gaps Identified
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {report.gaps?.map((gap, i) => (
                  <div key={i} style={{
                    background: riskBg(gap.riskLevel),
                    border: `1px solid ${riskColor(gap.riskLevel)}33`,
                    borderLeft: `3px solid ${riskColor(gap.riskLevel)}`,
                    borderRadius: 8, padding: 14,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <span style={{ color: riskColor(gap.riskLevel), fontWeight: 700, fontSize: 13 }}>
                          {gap.controlId}
                        </span>
                        <span style={{ color: "#94A3B8", fontSize: 13, marginLeft: 8 }}>
                          {gap.controlName}
                        </span>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 1,
                        color: riskColor(gap.riskLevel), padding: "2px 8px",
                        border: `1px solid ${riskColor(gap.riskLevel)}55`,
                        borderRadius: 4,
                      }}>
                        {gap.riskLevel}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 6px", fontSize: 13, color: "#CBD5E1" }}>{gap.finding}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#64748B" }}>
                      <span style={{ color: ACCENT }}>→ </span>{gap.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths + Next Steps */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                  Policy Strengths
                </div>
                {report.strengths?.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#CBD5E1" }}>
                    <span style={{ color: ACCENT }}>✓</span> {s}
                  </div>
                ))}
              </div>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }}>
                <div style={{ fontSize: 11, color: "#FFB800", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
                  Recommended Next Steps
                </div>
                {report.nextSteps?.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#CBD5E1" }}>
                    <span style={{ color: "#FFB800", minWidth: 16 }}>{i + 1}.</span> {s}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
