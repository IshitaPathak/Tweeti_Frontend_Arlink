"use client";
import { Dispatch, SetStateAction } from "react";

export interface ToneSettings {
  style: string;
  tone: string;
  audience: string;
  formality: string;
  length: string;
  keywords: string;
  brandVoice: string;
  emotionalTone: string;
  contentType: string;
  callToAction: string;
  targetEngagement: string;
  industry: string;
  hashtagStyle: string;
}

interface ToneSettingsModalProps {
  showToneModal: boolean;
  setShowToneModal: Dispatch<SetStateAction<boolean>>;
  toneSettings: ToneSettings;
  setToneSettings: Dispatch<SetStateAction<ToneSettings>>;
}

const templates: Record<string, ToneSettings> = {
  "Growth Guru": {
    style: "Energetic",
    tone: "Excited",
    audience: "Business",
    brandVoice: "Authentic",
    emotionalTone: "Excited",
    formality: "Professional",
    length: "Medium",
    keywords: "growth, scale, opportunity",
    contentType: "Promotional",
    callToAction: "Learn More",
    targetEngagement: "Shares",
    industry: "Finance",
    hashtagStyle: "Trending",
  },
  "Minimalist Mentor": {
    style: "Simple",
    tone: "Neutral",
    audience: "General",
    brandVoice: "Trustworthy",
    emotionalTone: "Neutral",
    formality: "Casual",
    length: "Short",
    keywords: "clarity, simplicity, less",
    contentType: "Educational",
    callToAction: "None",
    targetEngagement: "Likes",
    industry: "Healthcare",
    hashtagStyle: "Minimal",
  },
  "Innovation Architect": {
    style: "Visionary",
    tone: "Neutral",
    audience: "Developers",
    brandVoice: "Innovative",
    emotionalTone: "Neutral",
    formality: "Formal",
    length: "Long",
    keywords: "AI, decentralization, innovation",
    contentType: "Inspirational",
    callToAction: "Learn More",
    targetEngagement: "Shares",
    industry: "Technology",
    hashtagStyle: "Branded",
  },
  "Health Ally": {
    style: "Supportive",
    tone: "Empathetic",
    audience: "General",
    brandVoice: "Trustworthy",
    emotionalTone: "Empathetic",
    formality: "Professional",
    length: "Medium",
    keywords: "care, wellness, support",
    contentType: "Educational",
    callToAction: "Visit Website",
    targetEngagement: "Comments",
    industry: "Healthcare",
    hashtagStyle: "Heavy",
  },
  "Tech Trendsetter": {
    style: "Bold",
    tone: "Excited",
    audience: "Developers",
    brandVoice: "Innovative",
    emotionalTone: "Excited",
    formality: "Casual",
    length: "Short",
    keywords: "launch, innovation, breakthrough",
    contentType: "News",
    callToAction: "Sign Up",
    targetEngagement: "Likes",
    industry: "Technology",
    hashtagStyle: "Trending",
  },
};


export default function ToneSettingsModal({
  showToneModal,
  setShowToneModal,
  toneSettings,
  setToneSettings,
}: ToneSettingsModalProps) {
  const saveToneSettings = () => {
    console.log("Saved Tone Settings:", toneSettings);
    setShowToneModal(false);
  };

  if (!showToneModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-[480px] bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto transition-all duration-200">
        <h2 className="text-xl font-bold text-black mb-2">We know… its tedious to fill all this 😅</h2>
        <p className="text-sm text-gray-600 mb-6">
          Pick a ready-made template and get back to writing faster.
        </p>

        <h3 className="text-md font-semibold text-gray-800 mb-2">✨ Quick Templates</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(templates).map((templateName) => (
            <button
              key={templateName}
              onClick={() => setToneSettings(templates[templateName])}
              className="px-3 py-1 rounded-full bg-gray-100 hover:bg-purple-100 text-sm text-gray-700 transition hover:scale-[1.03]"
            >
              {templateName}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {([
            ["Audience", "audience", ["General", "Developers", "Business"]],
            ["Brand Voice", "brandVoice", ["Authentic", "Innovative", "Trustworthy"]],
            ["Emotional Tone", "emotionalTone", ["Neutral", "Excited", "Empathetic"]],
            ["Formality", "formality", ["Casual", "Professional", "Formal"]],
            ["Length", "length", ["Short", "Medium", "Long"]],
            ["Content Type", "contentType", ["Educational", "Promotional", "Inspirational", "News"]],
            ["Call to Action", "callToAction", ["None", "Visit Website", "Sign Up", "Learn More"]],
            ["Target Engagement", "targetEngagement", ["Likes", "Comments", "Saves", "Shares"]],
            ["Industry", "industry", ["Technology", "Healthcare", "Finance", "Education"]],
            ["Hashtag Style", "hashtagStyle", ["Minimal", "Heavy", "Branded", "Trending"]],
          ] as const).map(([label, key, options]) => (
            <div key={key}>
              <label className="block text-sm text-gray-900 mb-1">{label}:</label>
              <select
                value={toneSettings[key]}
                onChange={(e) =>
                  setToneSettings((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400 transition"
              >
                {options.map((option: string) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-900 mb-1">Keywords:</label>
            <input
              type="text"
              value={toneSettings.keywords}
              onChange={(e) =>
                setToneSettings((prev) => ({ ...prev, keywords: e.target.value }))
              }
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Comma-separated e.g., AI, blockchain, web3"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mt-6">
          <h4 className="font-medium text-gray-700 mb-2">📝 Quick Summary:</h4>
          <p className="text-sm text-gray-600">
            Audience: <b>{toneSettings.audience}</b>, Voice: <b>{toneSettings.brandVoice}</b>, Tone: <b>{toneSettings.emotionalTone}</b>, Formality: <b>{toneSettings.formality}</b>, Target: <b>{toneSettings.targetEngagement}</b>, Industry: <b>{toneSettings.industry}</b>.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => setShowToneModal(false)}
            className="px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
          <button
            onClick={saveToneSettings}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Looks Good!
          </button>
        </div>
      </div>
    </div>
  );
}
