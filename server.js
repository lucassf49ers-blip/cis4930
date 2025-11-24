import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const geminiKey = process.env.GEMINI_API_KEY;
const geminiModelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;
const geminiModel = genAI
  ? genAI.getGenerativeModel({
      model: geminiModelName,
      generationConfig: {
        temperature: 0.45,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 512,
      },
    })
  : null;

const defaultBreathingGuides = [
  {
    title: "Box Breathing (4x4)",
    steps: [
      "Inhale through the nose for 4 seconds",
      "Hold the breath gently for 4 seconds",
      "Exhale through the mouth for 4 seconds",
      "Pause for 4 seconds before repeating",
    ],
  },
  {
    title: "4-7-8 Reset",
    steps: [
      "Inhale quietly through your nose for 4 seconds",
      "Hold for a steady 7-count",
      "Purse your lips and exhale for 8 seconds with a soft whoosh",
      "Repeat up to 4 cycles to calm the nervous system",
    ],
  },
];

const multimediaLibrary = {
  sadness_multiple_days: {
    label: "Extended Sadness",
    headline: "You deserve immediate, compassionate support.",
    body: "When sadness stretches on for days, reaching out is a sign of strength. Consider connecting with a licensed professional or trusted support immediately.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    resources: [
      {
        label: "988 Suicide & Crisis Lifeline (US)",
        url: "https://988lifeline.org/",
      },
      {
        label: "Find a therapist via Psychology Today",
        url: "https://www.psychologytoday.com/us/therapists",
      },
    ],
    breathing: defaultBreathingGuides,
  },
  mild_sadness: {
    label: "Gentle Encouragement",
    headline: "Let’s brighten the moment a little.",
    body: "Feeling a bit down happens to everyone. Small sparks of color, light, and self-kindness can lift your mood.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    resources: [
      {
        label: "Mini gratitude journaling prompts",
        url: "https://www.dailygreatness.co/blogs/news/10-gratitude-journal-prompts",
      },
      {
        label: "Uplifting photo gallery",
        url: "https://unsplash.com/collections/1591470/bright-colors",
      },
    ],
  },
  anxiety_relief: {
    label: "Anxiety Relief",
    headline: "Let’s slow things down together.",
    body: "Anxiety signals your body needs a reset. Try grounding breathwork and gentle movement to release the tension.",
    imageUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    breathing: defaultBreathingGuides,
    resources: [
      {
        label: "Guided calm visual",
        url: "https://www.youtube.com/watch?v=aNXKjTFs4ag",
      },
      {
        label: "Two-minute grounding audio",
        url: "https://www.headspace.com/meditation/meditation-for-anxiety",
      },
    ],
  },
  help_request: {
    label: "Immediate Help",
    headline: "Pause everything—help is available right now.",
    body: "If you’re in danger or need urgent help, please contact emergency services or a trusted crisis line immediately.",
    imageUrl:
      "https://images.unsplash.com/photo-1527236438218-d82077ae1f85?auto=format&fit=crop&w=1200&q=80",
    resources: [
      { label: "Emergency Services", url: "tel:911" },
      { label: "International hotlines", url: "https://www.opencounseling.com/suicide-hotlines" },
    ],
  },
  work_stress: {
    label: "Work Stress",
    headline: "Small resets prevent burnout.",
    body: "Break tasks into manageable pieces, set micro-breaks, and use breathwork to keep your nervous system steady.",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    breathing: defaultBreathingGuides,
    resources: [
      {
        label: "Pomodoro flow timer",
        url: "https://pomofocus.io/",
      },
      {
        label: "Stress management strategies",
        url: "https://www.apa.org/topics/stress/tips",
      },
    ],
  },
  relationship_support: {
    label: "Relationship Support",
    headline: "Let’s navigate the tough conversation.",
    body: "Healthy communication looks like listening fully, sharing feelings with ‘I’ statements, and agreeing on one small next step.",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
    resources: [
      {
        label: "Guide to compassionate communication",
        url: "https://www.gottman.com/blog/relationship-resources/",
      },
      {
        label: "Conflict resolution worksheet",
        url: "https://www.therapistaid.com/worksheets/fair-fighting-rules",
      },
    ],
  },
  happy_celebration: {
    label: "Celebrate Joy",
    headline: "Let’s amplify the good!",
    body: "Document what’s making you smile, share it with someone you care about, and soak in the moment.",
    imageUrl:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80",
    resources: [
      { label: "Feel-good playlist", url: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0" },
      {
        label: "Capture your wins",
        url: "https://www.canva.com/create/journals/gratitude-journal/",
      },
    ],
  },
  sleep_trouble: {
    label: "Sleep Support",
    headline: "Let’s cue your body for rest.",
    body: "Calming visuals, soft audio, and light stretches signal to your mind it’s safe to power down.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314210-0882f88b353b?auto=format&fit=crop&w=1200&q=80",
    resources: [
      {
        label: "10-minute sleep meditation",
        url: "https://www.youtube.com/watch?v=ZPZQX-6Ig1c",
      },
      {
        label: "Nighttime sky visuals",
        url: "https://www.youtube.com/watch?v=3NoXThL_afM",
      },
    ],
    breathing: [
      {
        title: "Progressive Relaxation",
        steps: [
          "Tense your toes for 5 seconds, then release",
          "Work up through legs, torso, hands, jaw, and eyes",
          "End with a long exhale and soft focus",
        ],
      },
    ],
  },
  burnout_motivation: {
    label: "Motivation Reboot",
    headline: "Tiny steps restart momentum.",
    body: "Set a micro-goal, celebrate it loudly, and stack from there. Progress counts even when it’s small.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534311224-2024c6b73392?auto=format&fit=crop&w=1200&q=80",
    breathing: defaultBreathingGuides,
    resources: [
      { label: "2-minute motivation video", url: "https://www.youtube.com/watch?v=mgmVOuLgFB0" },
      {
        label: "Tiny habit starter",
        url: "https://tinyhabits.com/start/",
      },
    ],
  },
  self_harm: {
    label: "Crisis Support",
    headline: "Your safety matters more than anything.",
    body: "Please reach professional help immediately. You never have to face this alone.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314210-0882f88b353b?auto=format&fit=crop&w=1200&q=80",
    resources: [
      { label: "988 Suicide & Crisis Lifeline (US)", url: "https://988lifeline.org/" },
      {
        label: "Crisis Text Line (Text HOME to 741741)",
        url: "https://www.crisistextline.org/",
      },
      {
        label: "International hotlines",
        url: "https://www.opencounseling.com/suicide-hotlines",
      },
    ],
  },
};

const knownRuleIds = Object.keys(multimediaLibrary);

const promptRules = [
  { id: "sadness_multiple_days", summary: "User sad multiple days in row → urge professional help" },
  { id: "mild_sadness", summary: "User slightly down → uplifting imagery and text" },
  { id: "anxiety_relief", summary: "User anxious → breathing guidance" },
  { id: "help_request", summary: "User explicitly requests HELP → emergency info" },
  { id: "work_stress", summary: "User stressed from work → stress management tips" },
  { id: "relationship_support", summary: "User struggles with friends/relationships → tailored advice" },
  { id: "happy_celebration", summary: "User happy → reinforce joy with multimedia" },
  { id: "sleep_trouble", summary: "User can't sleep due to stress → calming visuals/audio" },
  { id: "burnout_motivation", summary: "User burned out/lacks motivation → motivation + small tasks" },
  { id: "self_harm", summary: "User mentions self-harm → crisis hotlines and urge emergency care" },
];

async function classifyWithGemini(payload) {
  if (!geminiModel) return null;

  const textInput = [
    `Primary feeling: ${payload.primaryFeeling}`,
    `Intensity (0-10): ${payload.intensity}`,
    `Days feeling this way: ${payload.daysFeeling}`,
    `Free text: ${payload.details || "(none)"}`,
  ].join("\n");

  const ruleSummary = promptRules
    .map((rule) => `- ${rule.id}: ${rule.summary}`)
    .join("\n");

  const instruction = `
You triage emotional wellness inputs. Pick the best fitting rule ID from the list and assign a severity level.
Allowed severity levels: critical, high, moderate, low, positive.
Respond ONLY with strict JSON:
{
  "ruleId": "<id from list>",
  "level": "<severity>",
  "reasoning": "<one sentence>",
  "reassurance": "<empathetic sentence>",
  "microSteps": ["<tip 1>", "<tip 2>"]
}

Rules:
${ruleSummary}

User submission:
${textInput}
`;

  try {
    const result = await geminiModel.generateContent(instruction);
    const text = result?.response?.text();
    if (!text) return null;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!knownRuleIds.includes(parsed.ruleId)) return null;
    return {
      ruleId: parsed.ruleId,
      level: parsed.level,
      reasoning: parsed.reasoning,
      reassurance: parsed.reassurance,
      microSteps: Array.isArray(parsed.microSteps) ? parsed.microSteps : [],
      source: "gemini",
    };
  } catch (error) {
    console.error("Gemini classification failed:", error.message);
    return null;
  }
}

function fallbackRule(payload) {
  const text = `${payload.primaryFeeling} ${payload.details || ""}`.toLowerCase();
  const days = Number(payload.daysFeeling || 0);

  if (text.includes("help") || payload.primaryFeeling === "help")
    return { ruleId: "help_request", level: "critical", source: "fallback" };
  if (text.includes("suicide") || text.includes("self-harm") || payload.primaryFeeling === "self_harm")
    return { ruleId: "self_harm", level: "critical", source: "fallback" };
  if (payload.primaryFeeling === "anxious" || text.includes("anxious"))
    return { ruleId: "anxiety_relief", level: "high", source: "fallback" };
  if (payload.primaryFeeling === "sleep" || text.includes("sleep"))
    return { ruleId: "sleep_trouble", level: "moderate", source: "fallback" };
  if (payload.primaryFeeling === "work_stress" || text.includes("work"))
    return { ruleId: "work_stress", level: "moderate", source: "fallback" };
  if (payload.primaryFeeling === "relationship" || text.includes("friend") || text.includes("relationship"))
    return { ruleId: "relationship_support", level: "moderate", source: "fallback" };
  if (payload.primaryFeeling === "happy" || text.includes("happy"))
    return { ruleId: "happy_celebration", level: "positive", source: "fallback" };
  if (payload.primaryFeeling === "burnout" || text.includes("burnout") || text.includes("motivation"))
    return { ruleId: "burnout_motivation", level: "high", source: "fallback" };
  if ((payload.primaryFeeling === "sad" || payload.primaryFeeling === "down") && days >= 3)
    return { ruleId: "sadness_multiple_days", level: "high", source: "fallback" };
  if (payload.primaryFeeling === "sad" || payload.primaryFeeling === "down" || text.includes("down"))
    return { ruleId: "mild_sadness", level: "low", source: "fallback" };

  return { ruleId: "mild_sadness", level: "low", source: "fallback" };
}

function buildResponse(classification, payload) {
  const chosen = classification || fallbackRule(payload);
  const libraryEntry = multimediaLibrary[chosen.ruleId] || multimediaLibrary.mild_sadness;
  return {
    ruleId: chosen.ruleId,
    level: chosen.level,
    source: chosen.source || "fallback",
    reasoning: chosen.reasoning,
    reassurance:
      chosen.reassurance ||
      "Thanks for sharing honestly. Let’s take the next small step together.",
    microSteps: chosen.microSteps?.length
      ? chosen.microSteps
      : [
          "Take one slow inhale and exhale before the next action.",
          "Message someone you trust to let them know how you’re doing.",
        ],
    multimedia: libraryEntry,
  };
}

app.post("/api/analyze", async (req, res) => {
  const payload = req.body || {};
  if (!payload.primaryFeeling) {
    return res.status(400).json({ error: "primaryFeeling is required" });
  }

  const normalizedPayload = {
    primaryFeeling: payload.primaryFeeling,
    intensity: Number(payload.intensity ?? 0),
    daysFeeling: Number(payload.daysFeeling ?? 0),
    details: (payload.details || "").slice(0, 1000),
  };

  const classification = await classifyWithGemini(normalizedPayload);
  const response = buildResponse(classification, normalizedPayload);

  res.json({
    ...response,
    breathing: response.multimedia.breathing || defaultBreathingGuides,
  });
});

// Regex avoids Express 5.x path-to-regexp wildcard validation issues.
app.get(/^(?!\/api).*/, (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Mood inference server listening on http://localhost:${port}`);
});
