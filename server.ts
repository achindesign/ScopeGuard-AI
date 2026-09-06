import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { SAMPLE_ANALYSIS_CUSTOMER_PROFILE, SAMPLE_ANALYSIS_PAYMENT_GATEWAY } from "./src/data/samples.ts";
import { ChangeAnalysis, UserProfile, AdditionalConsideration, ChecklistTask } from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Local persistent database file storage
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseState {
  users: UserProfile[];
  analyses: ChangeAnalysis[];
}

function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading database file, resetting to initial state:", err);
  }

  const defaultState: DatabaseState = {
    users: [
      {
        id: "usr-guest-001",
        email: "alex.morgan@acme.com",
        full_name: "Alex Morgan",
        role: "Senior Business Analyst",
        organization: "Acme Enterprises",
        created_at: new Date().toISOString()
      },
      {
        id: "usr-demo-002",
        email: "sarah.chen@fintech.com",
        full_name: "Sarah Chen",
        role: "Lead Solution Architect",
        organization: "FinTech Global",
        created_at: new Date().toISOString()
      }
    ],
    analyses: [
      SAMPLE_ANALYSIS_CUSTOMER_PROFILE,
      SAMPLE_ANALYSIS_PAYMENT_GATEWAY
    ]
  };

  saveDatabase(defaultState);
  return defaultState;
}

function saveDatabase(state: DatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

// Initialize database
let db = loadDatabase();

// Initialize GoogleGenAI SDK
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Using intelligent fallback generator if requested.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// AI System Prompt for ScopeGuard AI
const AI_SYSTEM_PROMPT = `You are ScopeGuard AI, an expert Business Analysis, Change Impact Assessment and Software Delivery Intelligence assistant.

Your responsibility is to analyze a proposed business or software change against the provided current-state context.

You must think systematically across:
* Functional requirements
* Business rules
* User experience / UI
* Data models & databases
* APIs & contracts
* System integrations & message flows
* Security & compliance (e.g. PII, auth, access control, GDPR/HIPAA/PCI)
* Business processes & customer operations
* Reporting & analytics
* Test cases & validation scenarios
* Regression testing & affected existing capabilities
* Documentation & specifications
* Stakeholders & required engagement
* Operational support & monitoring
* Project delivery & timeline implications

Do not assume a change is small simply because the requested modification appears simple.
Identify direct impacts, indirect impacts, dependencies, risks, assumptions, edge cases and unanswered questions.
Be specific, technical, practical, and highly realistic.
Do not invent fictional third-party technologies unless supported by the provided context or typical architecture for that domain. When information is missing, identify it as an open question or assumption.
Prioritize findings based on realistic implementation risk.
Return only valid JSON matching the requested schema.`;

// API Routes

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sample Analyses for Demo Mode
app.get("/api/sample-analyses", (req, res) => {
  res.json({
    samples: [
      SAMPLE_ANALYSIS_CUSTOMER_PROFILE,
      SAMPLE_ANALYSIS_PAYMENT_GATEWAY
    ]
  });
});

// Get User Profile / Current Session
app.get("/api/auth/me", (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  if (userId) {
    const user = db.users.find(u => u.id === userId);
    if (user) {
      return res.json({ user });
    }
  }
  const defaultUser = db.users[0] || null;
  res.json({ user: defaultUser });
});

// Login / Switch User
app.post("/api/auth/login", (req, res) => {
  const { email, full_name, role, organization } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const cleanEmail = email.trim();
  let user = db.users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  
  if (!user) {
    const derivedName = full_name?.trim() || cleanEmail.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Professional User";
    user = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      full_name: derivedName,
      role: role?.trim() || "Senior Business Analyst",
      organization: organization?.trim() || "Enterprise Team",
      created_at: new Date().toISOString()
    };
    db.users.push(user);
    saveDatabase(db);
  } else {
    let changed = false;
    if (full_name && full_name.trim() && user.full_name !== full_name.trim()) {
      user.full_name = full_name.trim();
      changed = true;
    }
    if (role && role.trim() && user.role !== role.trim()) {
      user.role = role.trim();
      changed = true;
    }
    if (organization && organization.trim() && user.organization !== organization.trim()) {
      user.organization = organization.trim();
      changed = true;
    }
    if (changed) {
      saveDatabase(db);
    }
  }

  res.json({ user });
});

// Signup
app.post("/api/auth/signup", (req, res) => {
  const { email, full_name, role, organization } = req.body;
  if (!email || !full_name) {
    return res.status(400).json({ error: "Email and Full Name are required" });
  }

  const cleanEmail = email.trim();
  const cleanName = full_name.trim();
  const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail.toLowerCase());
  
  if (existing) {
    existing.full_name = cleanName;
    if (role?.trim()) existing.role = role.trim();
    if (organization?.trim()) existing.organization = organization.trim();
    saveDatabase(db);
    return res.json({ user: existing });
  }

  const newUser: UserProfile = {
    id: "usr-" + Math.random().toString(36).substring(2, 9),
    email: cleanEmail,
    full_name: cleanName,
    role: role?.trim() || "Senior Business Analyst",
    organization: organization?.trim() || "Enterprise Team",
    created_at: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);
  res.status(201).json({ user: newUser });
});

// Update Profile
app.put("/api/auth/profile", (req, res) => {
  const userId = req.headers["x-user-id"] as string || "usr-guest-001";
  const { full_name, role, organization } = req.body;

  const userIdx = db.users.findIndex(u => u.id === userId);
  if (userIdx >= 0) {
    db.users[userIdx] = {
      ...db.users[userIdx],
      full_name: (full_name && full_name.trim()) || db.users[userIdx].full_name,
      role: (role && role.trim()) || db.users[userIdx].role,
      organization: (organization && organization.trim()) || db.users[userIdx].organization
    };
    saveDatabase(db);
    return res.json({ user: db.users[userIdx] });
  }

  res.status(404).json({ error: "User not found" });
});

// List Analyses (Filtered by User or all if guest)
app.get("/api/analyses", (req, res) => {
  const userId = req.headers["x-user-id"] as string;
  let analyses = db.analyses;
  
  if (userId && userId !== "guest-all") {
    analyses = db.analyses.filter(a => a.user_id === userId || a.is_sample);
  }

  // Sort latest first
  analyses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json({ analyses });
});

// Get Single Analysis
app.get("/api/analyses/:id", (req, res) => {
  const { id } = req.params;
  const analysis = db.analyses.find(a => a.id === id);
  if (!analysis) {
    return res.status(404).json({ error: "Change Analysis not found" });
  }
  res.json({ analysis });
});

// Delete Analysis
app.delete("/api/analyses/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = db.analyses.length;
  db.analyses = db.analyses.filter(a => a.id !== id);

  if (db.analyses.length === initialLength) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  saveDatabase(db);
  res.json({ message: "Analysis deleted successfully" });
});

// Update Checklist Item
app.put("/api/analyses/:id/checklist", (req, res) => {
  const { id } = req.params;
  const { taskId, completed, phase } = req.body;

  const analysis = db.analyses.find(a => a.id === id);
  if (!analysis) {
    return res.status(404).json({ error: "Analysis not found" });
  }

  if (phase && analysis.checklist[phase as keyof typeof analysis.checklist]) {
    const list = analysis.checklist[phase as keyof typeof analysis.checklist];
    const item = list.find(t => t.id === taskId);
    if (item) {
      item.completed = completed;
      analysis.updated_at = new Date().toISOString();
      saveDatabase(db);
      return res.json({ analysis });
    }
  } else {
    // Search across all phases
    for (const p of ['before_implementation', 'during_development', 'before_release'] as const) {
      const item = analysis.checklist[p].find(t => t.id === taskId);
      if (item) {
        item.completed = completed;
        analysis.updated_at = new Date().toISOString();
        saveDatabase(db);
        return res.json({ analysis });
      }
    }
  }

  res.status(404).json({ error: "Task item not found" });
});

// Run AI Change Impact Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      project_name,
      current_state,
      proposed_change,
      business_context,
      existing_dependencies
    } = req.body;

    if (!project_name || !current_state || !proposed_change) {
      return res.status(400).json({
        error: "Missing required fields: project_name, current_state, and proposed_change are required."
      });
    }

    const userId = req.headers["x-user-id"] as string || "usr-guest-001";
    const ai = getGeminiClient();

    let analysisResult: Partial<ChangeAnalysis> | null = null;

    if (ai) {
      const prompt = `Analyze the following business and software change request thoroughly.
Project / Analysis Name: ${project_name}

Current State / Existing Requirement:
"""
${current_state}
"""

Proposed Change:
"""
${proposed_change}
"""

Business Context / Architecture Details:
"""
${business_context || "Standard multi-tier enterprise web application architecture with database, API layer, and authenticated user portal."}
"""

Known Existing Dependencies:
${existing_dependencies && existing_dependencies.length > 0 ? existing_dependencies.map((d: string) => `- ${d}`).join("\n") : "None specified explicitly."}

Perform a rigorous, holistic Change Impact Assessment.
Ensure you cover all 14 impact area categories:
1. Functional Requirements
2. Business Rules
3. User Experience / UI
4. Database / Data Model
5. APIs
6. System Integrations
7. Security & Compliance
8. Business Processes
9. Reporting & Analytics
10. Test Cases
11. Regression Testing
12. Documentation
13. Project Timeline / Delivery
14. Operational Support

Calculate an Overall Impact Score between 0 and 100 based on realistic technical complexity, blast radius, data sensitivity, and compliance risk.
Classify impact as Minimal (0-20), Low (21-40), Moderate (41-60), High (61-80), or Critical (81-100).
Generate concrete dependencies, risks with mitigations, stakeholders with engagement levels, regression testing areas with priorities, documentation updates, critical open questions to discover before implementation, and an actionable 3-phase checklist (before_implementation, during_development, before_release).`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction: AI_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overall_impact_score: { type: Type.INTEGER, description: "Score from 0 to 100" },
                impact_classification: { type: Type.STRING, description: "Minimal, Low, Moderate, High, or Critical" },
                executive_summary: {
                  type: Type.OBJECT,
                  properties: {
                    change_overview: { type: Type.STRING },
                    overall_impact: { type: Type.STRING },
                    key_areas_affected: { type: Type.ARRAY, items: { type: Type.STRING } },
                    top_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    recommended_next_step: { type: Type.STRING }
                  },
                  required: ["change_overview", "overall_impact", "key_areas_affected", "top_risks", "recommended_next_step"]
                },
                impact_areas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      impact_level: { type: Type.STRING, description: "None, Low, Medium, High, or Critical" },
                      risk_level: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                      description: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      recommended_action: { type: Type.STRING }
                    },
                    required: ["category", "impact_level", "description", "reason", "recommended_action"]
                  }
                },
                dependencies: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      dependency_name: { type: Type.STRING },
                      dependency_type: { type: Type.STRING },
                      impact_level: { type: Type.STRING },
                      description: { type: Type.STRING },
                      investigation_required: { type: Type.STRING }
                    },
                    required: ["dependency_name", "dependency_type", "impact_level", "description", "investigation_required"]
                  }
                },
                risks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      category: { type: Type.STRING, description: "Functional, Technical, Data, Security, Integration, Compliance, Operational, or Schedule" },
                      probability: { type: Type.STRING, description: "Low, Medium, or High" },
                      impact: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                      risk_level: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                      mitigation: { type: Type.STRING }
                    },
                    required: ["title", "description", "category", "probability", "impact", "risk_level", "mitigation"]
                  }
                },
                stakeholders: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stakeholder_name: { type: Type.STRING },
                      impact_reason: { type: Type.STRING },
                      engagement_level: { type: Type.STRING, description: "Inform, Consult, Collaborate, or Approve" }
                    },
                    required: ["stakeholder_name", "impact_reason", "engagement_level"]
                  }
                },
                regression_areas: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      test_area: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      priority: { type: Type.STRING, description: "Low, Medium, High, or Critical" }
                    },
                    required: ["test_area", "reason", "priority"]
                  }
                },
                documentation_impacts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      document_type: { type: Type.STRING },
                      impact_description: { type: Type.STRING },
                      priority: { type: Type.STRING, description: "Low, Medium, High, or Critical" }
                    },
                    required: ["document_type", "impact_description", "priority"]
                  }
                },
                open_questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      category: { type: Type.STRING, description: "Business, Functional, Technical, Data, Security, Compliance, or Testing" },
                      priority: { type: Type.STRING, description: "Low, Medium, High, or Critical" }
                    },
                    required: ["question", "category", "priority"]
                  }
                },
                checklist: {
                  type: Type.OBJECT,
                  properties: {
                    before_implementation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    during_development: { type: Type.ARRAY, items: { type: Type.STRING } },
                    before_release: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ["before_implementation", "during_development", "before_release"]
                }
              },
              required: [
                "overall_impact_score",
                "impact_classification",
                "executive_summary",
                "impact_areas",
                "dependencies",
                "risks",
                "stakeholders",
                "regression_areas",
                "documentation_impacts",
                "open_questions",
                "checklist"
              ]
            }
          }
        });

        if (response.text) {
          analysisResult = JSON.parse(response.text);
        }
      } catch (geminiError) {
        console.error("Gemini API call error:", geminiError);
      }
    }

    // Fallback heuristic analyzer if Gemini client is unavailable or failed
    if (!analysisResult) {
      analysisResult = generateSmartFallbackAnalysis({
        project_name,
        current_state,
        proposed_change,
        business_context,
        existing_dependencies
      });
    }

    // Standardize IDs and Checklist format
    const analysisId = "analysis-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6);

    const formattedImpactAreas = (analysisResult.impact_areas || []).map((ia: any, index: number) => ({
      id: `ia-${index + 1}`,
      category: ia.category || "General",
      impact_level: ia.impact_level || "Medium",
      risk_level: ia.risk_level || ia.impact_level || "Medium",
      description: ia.description || "",
      reason: ia.reason || "",
      recommended_action: ia.recommended_action || ""
    }));

    const formattedDependencies = (analysisResult.dependencies || []).map((dep: any, index: number) => ({
      id: `dep-${index + 1}`,
      dependency_name: dep.dependency_name || "System Component",
      dependency_type: dep.dependency_type || "Internal Service",
      impact_level: dep.impact_level || "Medium",
      description: dep.description || "",
      investigation_required: dep.investigation_required || ""
    }));

    const formattedRisks = (analysisResult.risks || []).map((r: any, index: number) => ({
      id: `risk-${index + 1}`,
      title: r.title || "Identified Implementation Risk",
      description: r.description || "",
      category: r.category || "Technical",
      probability: r.probability || "Medium",
      impact: r.impact || "High",
      risk_level: r.risk_level || "Medium",
      mitigation: r.mitigation || ""
    }));

    const formattedStakeholders = (analysisResult.stakeholders || []).map((s: any, index: number) => ({
      id: `stk-${index + 1}`,
      stakeholder_name: s.stakeholder_name || "Stakeholder",
      impact_reason: s.impact_reason || "",
      engagement_level: s.engagement_level || "Consult"
    }));

    const formattedRegression = (analysisResult.regression_areas || []).map((reg: any, index: number) => ({
      id: `reg-${index + 1}`,
      test_area: reg.test_area || "System Module",
      reason: reg.reason || "",
      priority: reg.priority || "High"
    }));

    const formattedDocs = (analysisResult.documentation_impacts || []).map((doc: any, index: number) => ({
      id: `doc-${index + 1}`,
      document_type: doc.document_type || "Functional Specification",
      impact_description: doc.impact_description || "",
      priority: doc.priority || "Medium"
    }));

    const formattedQuestions = (analysisResult.open_questions || []).map((q: any, index: number) => ({
      id: `q-${index + 1}`,
      question: q.question || "",
      category: q.category || "Functional",
      priority: q.priority || "High"
    }));

    // Convert raw checklist array strings to ChecklistTask objects
    const rawChecklist = analysisResult.checklist || {
      before_implementation: [],
      during_development: [],
      before_release: []
    };

    const formatChecklistSection = (tasks: (string | ChecklistTask)[], phase: 'before_implementation' | 'during_development' | 'before_release') => {
      return tasks.map((t, idx) => {
        if (typeof t === 'string') {
          return {
            id: `chk-${phase.substring(0, 3)}-${idx + 1}`,
            phase,
            task: t,
            completed: false
          };
        }
        return {
          ...t,
          id: t.id || `chk-${phase.substring(0, 3)}-${idx + 1}`,
          phase,
          completed: Boolean(t.completed)
        };
      });
    };

    const finalAnalysis: ChangeAnalysis = {
      id: analysisId,
      user_id: userId,
      project_name,
      current_state,
      proposed_change,
      business_context,
      existing_dependencies: existing_dependencies || [],
      overall_impact_score: analysisResult.overall_impact_score || 65,
      impact_classification: (analysisResult.impact_classification as any) || "High",
      executive_summary: analysisResult.executive_summary || {
        change_overview: `Impact assessment for proposed change to ${project_name}.`,
        overall_impact: `The proposed change introduces technical and architectural considerations with a score of ${analysisResult.overall_impact_score || 65}/100.`,
        key_areas_affected: ["Functional Requirements", "System Integrations", "Regression Testing"],
        top_risks: ["Integration latency and data synchronization edge cases"],
        recommended_next_step: "Conduct a technical discovery workshop with lead architect and product owner."
      },
      impact_areas: formattedImpactAreas,
      dependencies: formattedDependencies,
      risks: formattedRisks,
      stakeholders: formattedStakeholders,
      regression_areas: formattedRegression,
      documentation_impacts: formattedDocs,
      open_questions: formattedQuestions,
      checklist: {
        before_implementation: formatChecklistSection(rawChecklist.before_implementation, 'before_implementation'),
        during_development: formatChecklistSection(rawChecklist.during_development, 'during_development'),
        before_release: formatChecklistSection(rawChecklist.before_release, 'before_release')
      },
      additional_considerations: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save to Database
    db.analyses.unshift(finalAnalysis);
    saveDatabase(db);

    res.status(201).json({ analysis: finalAnalysis });
  } catch (err: any) {
    console.error("Error during change impact analysis:", err);
    res.status(500).json({ error: "Failed to generate change impact analysis: " + (err?.message || "Internal server error") });
  }
});

// AI "What Did We Miss?" Feature
app.post("/api/what-did-we-miss", async (req, res) => {
  try {
    const { analysis_id, custom_prompt } = req.body;
    if (!analysis_id) {
      return res.status(400).json({ error: "analysis_id is required." });
    }

    const analysis = db.analyses.find(a => a.id === analysis_id);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found." });
    }

    const ai = getGeminiClient();
    let additionalConsiderations: AdditionalConsideration[] = [];

    if (ai) {
      const prompt = `Review the following proposed change and the previously generated impact analysis.
Identify important impact areas, blind spots, subtle secondary risks, third-party dependencies, edge cases, data concurrency anomalies, or compliance and stakeholder considerations that may have been OVERLOOKED or underestimated in the initial assessment.

Project Name: ${analysis.project_name}
Current State: ${analysis.current_state}
Proposed Change: ${analysis.proposed_change}
Business Context: ${analysis.business_context || "Enterprise application"}

Summary of Current Findings:
- Impact Score: ${analysis.overall_impact_score}/100 (${analysis.impact_classification})
- Key Affected Areas: ${analysis.executive_summary.key_areas_affected.join(", ")}
- Known Risks: ${analysis.risks.map(r => r.title).join(", ")}

${custom_prompt ? `User Specific Focus: "${custom_prompt}"` : ""}

Provide 3 to 5 high-value, deep-dive considerations that a Senior Business Analyst or Principal Architect would raise to prevent post-release incidents.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction: AI_SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
                  description: { type: Type.STRING },
                  recommended_action: { type: Type.STRING }
                },
                required: ["category", "severity", "description", "recommended_action"]
              }
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          additionalConsiderations = parsed.map((item: any, idx: number) => ({
            id: `ac-new-${Date.now()}-${idx + 1}`,
            category: item.category || "Edge Case & Resilience",
            severity: item.severity || "High",
            description: item.description || "",
            recommended_action: item.recommended_action || ""
          }));
        }
      } catch (err) {
        console.error("Gemini error in what-did-we-miss:", err);
      }
    }

    // Fallback if AI call failed
    if (additionalConsiderations.length === 0) {
      additionalConsiderations = [
        {
          id: `ac-fallback-${Date.now()}-1`,
          category: "Concurrency & Race Conditions",
          severity: "High",
          description: "Multiple asynchronous change requests or simultaneous session operations could cause partial database state writes without transactional locks.",
          recommended_action: "Implement database optimistic locking (version column) or distributed Redis mutex locks for sensitive entity updates."
        },
        {
          id: `ac-fallback-${Date.now()}-2`,
          category: "Data Privacy & Purge Policies",
          severity: "High",
          description: "GDPR 'Right to be Forgotten' and regulatory audit retention requirements must account for newly captured telemetry and audit logs.",
          recommended_action: "Verify that user deletion or pseudonymization workflows cascade cleanly to newly introduced database tables and external sync payloads."
        },
        {
          id: `ac-fallback-${Date.now()}-3`,
          category: "Telemetry & Observability Gaps",
          severity: "Medium",
          description: "Lack of specific synthetic monitoring or distributed tracing could delay detection of downstream carrier or service degradation.",
          recommended_action: "Add OpenTelemetry spans and structured logging around all third-party API invocations with custom SLA alert thresholds."
        }
      ];
    }

    // Merge into analysis
    const existing = analysis.additional_considerations || [];
    analysis.additional_considerations = [...existing, ...additionalConsiderations];
    analysis.updated_at = new Date().toISOString();

    saveDatabase(db);

    res.json({
      analysis,
      new_considerations: additionalConsiderations
    });
  } catch (err: any) {
    console.error("Error in what-did-we-miss endpoint:", err);
    res.status(500).json({ error: "Failed to generate additional considerations: " + (err?.message || "Internal server error") });
  }
});

// Intelligent fallback generator when Gemini API key is not present or offline
function generateSmartFallbackAnalysis(input: {
  project_name: string;
  current_state: string;
  proposed_change: string;
  business_context?: string;
  existing_dependencies?: string[];
}): Partial<ChangeAnalysis> {
  const isSecurityHeavy = /password|auth|login|token|otp|phone|email|payment|card|secret|pii|credit|bank|encrypt/i.test(input.proposed_change + input.current_state);
  const isIntegrationHeavy = /api|sync|webhook|service|crm|database|downstream|gateway|vendor|kafka|message/i.test(input.proposed_change + input.business_context);
  
  const impactScore = isSecurityHeavy && isIntegrationHeavy ? 78 : (isSecurityHeavy ? 70 : (isIntegrationHeavy ? 62 : 54));
  const classification = impactScore >= 80 ? "Critical" : (impactScore >= 60 ? "High" : "Moderate");

  return {
    overall_impact_score: impactScore,
    impact_classification: classification,
    executive_summary: {
      change_overview: `Evaluation of '${input.project_name}' modifying: "${input.proposed_change.slice(0, 140)}...".`,
      overall_impact: `The proposed change represents a ${classification} Impact (${impactScore}/100) due to modifications in core functional workflows, data persistence requirements, and potential downstream integration coupling.`,
      key_areas_affected: [
        "Core Functional Requirements & Validation",
        "Database Schema & Data Normalization",
        "API Contracts & Client-Server Communication",
        "Downstream System Integrations & Event Webhooks",
        "Automated & Manual Regression Testing Coverage"
      ],
      top_risks: [
        "Unforeseen data synchronization desync between primary store and downstream consumers",
        "Insufficient validation or edge-case handling for boundary conditions",
        "Potential regression in adjacent user journeys sharing underlying services"
      ],
      recommended_next_step: "Conduct a structured review with engineering leads and QA to validate schema migration steps, API backward compatibility, and test coverage before sprint commitment."
    },
    impact_areas: [
      {
        id: "ia-1",
        category: "Functional Requirements",
        impact_level: "High",
        risk_level: "High",
        description: "New user interactions, input validations, state transitions, and error boundary workflows.",
        reason: "The proposed change modifies expected user capability and requires explicit acceptance criteria definition.",
        recommended_action: "Draft comprehensive User Stories with Gherkin (Given/When/Then) acceptance criteria covering success, failure, and timeout scenarios."
      },
      {
        id: "ia-2",
        category: "Business Rules",
        impact_level: "High",
        risk_level: "Medium",
        description: "Enforcement of business constraints, permission checks, and state change authorizations.",
        reason: "Modifications alter operational policy regarding allowed user actions and trigger rules.",
        recommended_action: "Document decision matrix for all conditional branches and exception rules in the FRD."
      },
      {
        id: "ia-3",
        category: "User Experience / UI",
        impact_level: "Medium",
        risk_level: "Low",
        description: "Interface components, feedback alerts, loading states, and responsive view adjustments.",
        reason: "Users require intuitive, accessible visual elements and instant feedback during processing.",
        recommended_action: "Create high-fidelity wireframes and validate screen reader accessibility (WCAG AA)."
      },
      {
        id: "ia-4",
        category: "Database / Data Model",
        impact_level: isSecurityHeavy ? "High" : "Medium",
        risk_level: "High",
        description: "Entity attributes, database migration scripts, index updates, and foreign key integrity.",
        reason: "Persisting new attributes requires column additions, backward-compatible migrations, and nullability decisions.",
        recommended_action: "Develop zero-downtime database migration scripts and benchmark query index performance."
      },
      {
        id: "ia-5",
        category: "APIs",
        impact_level: "High",
        risk_level: "Medium",
        description: "REST/GraphQL endpoint request/response payloads and error status codes.",
        reason: "API contracts must maintain backward compatibility while supporting new attributes.",
        recommended_action: "Update OpenAPI specification and verify versioning strategies for legacy consumers."
      },
      {
        id: "ia-6",
        category: "System Integrations",
        impact_level: isIntegrationHeavy ? "High" : "Medium",
        risk_level: "High",
        description: "External vendor APIs, message brokers, webhooks, and ETL pipelines.",
        reason: "Data changes must propagate reliably across interconnected platforms without message loss.",
        recommended_action: "Implement idempotent consumers, dead-letter queues (DLQ), and retry backoff policies."
      },
      {
        id: "ia-7",
        category: "Security & Compliance",
        impact_level: isSecurityHeavy ? "Critical" : "Medium",
        risk_level: isSecurityHeavy ? "Critical" : "Medium",
        description: "Access authorization, PII data handling, encryption at rest/in transit, and audit logging.",
        reason: "Changes to sensitive data touchpoints must satisfy security standards and regulatory mandates.",
        recommended_action: "Perform InfoSec threat modeling and ensure encryption of sensitive fields in transit and rest."
      },
      {
        id: "ia-8",
        category: "Business Processes",
        impact_level: "Medium",
        risk_level: "Low",
        description: "Operational support runbooks, customer success escalation, and manual overrides.",
        reason: "Support teams must understand how to diagnose issues when users encounter errors.",
        recommended_action: "Publish updated internal SOPs and escalation playbooks for support tier-1/tier-2."
      },
      {
        id: "ia-9",
        category: "Reporting & Analytics",
        impact_level: "Low",
        risk_level: "Low",
        description: "Analytics event tracking, KPI dashboards, and business intelligence pipelines.",
        reason: "Product analytics need telemetry on feature adoption, completion rates, and error frequencies.",
        recommended_action: "Instrument analytics event triggers for tracking key conversion and error checkpoints."
      },
      {
        id: "ia-10",
        category: "Test Cases",
        impact_level: "High",
        risk_level: "High",
        description: "Unit, integration, and automated end-to-end test suites.",
        reason: "Verification of positive, negative, and edge case input permutations is essential.",
        recommended_action: "Write automated test cases achieving minimum 85% branch coverage on changed modules."
      },
      {
        id: "ia-11",
        category: "Regression Testing",
        impact_level: "High",
        risk_level: "High",
        description: "Existing end-user journeys that share dependencies, database tables, or services.",
        reason: "Shared utility code and database writes risk introducing unintended side effects.",
        recommended_action: "Execute complete smoke and regression test cycles on core user journeys prior to deployment."
      },
      {
        id: "ia-12",
        category: "Documentation",
        impact_level: "Medium",
        risk_level: "Low",
        description: "Requirements documents, API documentation, architecture diagrams, and release notes.",
        reason: "Engineering, QA, and business stakeholders require accurate documentation of current architecture.",
        recommended_action: "Update BRD/FRD, technical architecture diagrams, and user-facing release notes."
      },
      {
        id: "ia-13",
        category: "Project Timeline / Delivery",
        impact_level: "Medium",
        risk_level: "Medium",
        description: "Sprint scheduling, cross-team dependencies, and third-party vendor review lead times.",
        reason: "Coordination across multiple teams may introduce delivery bottlenecks.",
        recommended_action: "Map critical path dependencies and schedule cross-team alignment checkpoints."
      },
      {
        id: "ia-14",
        category: "Operational Support",
        impact_level: "Medium",
        risk_level: "Medium",
        description: "Application health monitoring, error rate alerting, and log aggregations.",
        reason: "Production operational readiness requires real-time observability.",
        recommended_action: "Set up telemetry dashboards and configure PagerDuty alerts for anomaly spikes."
      }
    ],
    dependencies: (input.existing_dependencies && input.existing_dependencies.length > 0
      ? input.existing_dependencies
      : ["Application Database", "Authentication Service", "Notification Engine", "Core API Gateway"]
    ).map((name, i) => ({
      id: `dep-${i + 1}`,
      dependency_name: name,
      dependency_type: i % 2 === 0 ? "Internal System" : "External Service",
      impact_level: "High",
      description: `Core system component directly involved in processing change workflow for '${input.project_name}'.`,
      investigation_required: `Confirm API contract compatibility, throughput limits, and failure fallback behaviors.`
    })),
    risks: [
      {
        id: "risk-1",
        title: "Downstream Data Inconsistency",
        description: "Asynchronous processing failures or network hiccups could cause data divergence across systems.",
        category: "Integration",
        probability: "Medium",
        impact: "High",
        risk_level: "High",
        mitigation: "Implement idempotency keys, dead-letter queues, and periodic automated reconciliation jobs."
      },
      {
        id: "risk-2",
        title: "Unhandled Edge-Case Input Validation",
        description: "Malformed or unanticipated input formats could trigger unhandled server exceptions or partial updates.",
        category: "Functional",
        probability: "Medium",
        impact: "Medium",
        risk_level: "Medium",
        mitigation: "Enforce strict schema validation at both the client-side UI and server API gateway boundaries."
      },
      {
        id: "risk-3",
        title: "Regression in Adjacent Workflows",
        description: "Modifications to shared database entities or utility functions could disrupt existing user flows.",
        category: "Technical",
        probability: "Low",
        impact: "High",
        risk_level: "Medium",
        mitigation: "Run full automated regression test suites and perform staging canary deployments."
      }
    ],
    stakeholders: [
      {
        id: "stk-1",
        stakeholder_name: "Product Manager / Product Owner",
        impact_reason: "Approves functional scope, prioritizes edge cases, and verifies acceptance criteria.",
        engagement_level: "Approve"
      },
      {
        id: "stk-2",
        stakeholder_name: "Lead Solution Architect",
        impact_reason: "Validates technical feasibility, non-functional requirements, and system integration patterns.",
        engagement_level: "Collaborate"
      },
      {
        id: "stk-3",
        stakeholder_name: "QA & Automation Team",
        impact_reason: "Defines test plans, automates test cases, and signs off on regression test passes.",
        engagement_level: "Collaborate"
      },
      {
        id: "stk-4",
        stakeholder_name: "Security & Compliance Team",
        impact_reason: "Ensures data privacy, authentication integrity, and regulatory compliance standards.",
        engagement_level: "Consult"
      },
      {
        id: "stk-5",
        stakeholder_name: "Customer Operations & Support",
        impact_reason: "Prepares support documentation, handles user inquiries, and reports early production feedback.",
        engagement_level: "Inform"
      }
    ],
    regression_areas: [
      {
        id: "reg-1",
        test_area: "Primary User Authentication & Session Management",
        reason: "Validates that changes do not compromise user credentials or token validation pipelines.",
        priority: "Critical"
      },
      {
        id: "reg-2",
        test_area: "Existing Core Workflow Navigation & Form Submissions",
        reason: "Ensures that unchanged fields and existing submission pathways continue functioning seamlessly.",
        priority: "High"
      },
      {
        id: "reg-3",
        test_area: "Downstream API Webhook Notifications",
        reason: "Confirms that external subscribers continue receiving valid payloads without schema breakage.",
        priority: "High"
      }
    ],
    documentation_impacts: [
      {
        id: "doc-1",
        document_type: "Functional Requirements Document (FRD)",
        impact_description: "Update core specifications to include detailed acceptance criteria and validation matrices.",
        priority: "Critical"
      },
      {
        id: "doc-2",
        document_type: "API Documentation & OpenAPI Contracts",
        impact_description: "Document schema changes, request/response models, and error response codes.",
        priority: "High"
      },
      {
        id: "doc-3",
        document_type: "QA Test Plans & Traceability Matrix",
        impact_description: "Map requirements to automated test cases and regression execution checklists.",
        priority: "High"
      }
    ],
    open_questions: [
      {
        id: "q-1",
        question: "What is the expected system behavior if downstream synchronization fails or experiences high latency?",
        category: "Technical",
        priority: "Critical"
      },
      {
        id: "q-2",
        question: "Are there specific business rules governing maximum retry attempts or rate limits for this operation?",
        category: "Business",
        priority: "High"
      },
      {
        id: "q-3",
        question: "Does this change require explicit user confirmation or multi-factor step-up authentication?",
        category: "Security",
        priority: "High"
      },
      {
        id: "q-4",
        question: "What audit logging retention duration is mandated by compliance policies for this action?",
        category: "Compliance",
        priority: "Medium"
      }
    ],
    checklist: {
      before_implementation: [
        { id: "chk-b1", phase: "before_implementation", task: "Review and baseline functional acceptance criteria with Product Owner", completed: false },
        { id: "chk-b2", phase: "before_implementation", task: "Confirm API contract changes and data mapping with downstream systems", completed: false },
        { id: "chk-b3", phase: "before_implementation", task: "Identify security, privacy, and regulatory constraints with InfoSec", completed: false }
      ],
      during_development: [
        { id: "chk-d1", phase: "during_development", task: "Implement database schema changes and verify backward compatibility", completed: false },
        { id: "chk-d2", phase: "during_development", task: "Develop API endpoints with strict input validation and error handling", completed: false },
        { id: "chk-d3", phase: "during_development", task: "Write unit tests covering edge cases and boundary conditions", completed: false }
      ],
      before_release: [
        { id: "chk-r1", phase: "before_release", task: "Execute comprehensive regression test suite across core user journeys", completed: false },
        { id: "chk-r2", phase: "before_release", task: "Validate staging end-to-end integration and telemetry monitoring alerts", completed: false },
        { id: "chk-r3", phase: "before_release", task: "Publish updated user documentation and notify customer support teams", completed: false }
      ]
    }
  };
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ScopeGuard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
