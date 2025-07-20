"use client";

import {
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";
import { useState, useEffect } from "react";
import { connectWallet } from "@/lib/arutils";

interface Post {
  id: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "published" | "draft";
  engagement?: number;
}

interface Stats {
  streak: number;
  users: number;
  global: number;
  totalPosts: number;
  engagement: number;
}

interface ToneSettings {
  style: string[];
  tone: string[];
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [showToneModal, setShowToneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostSchedule, setEditPostSchedule] = useState("");
  const [editPostStatus, setEditPostStatus] = useState<
    "scheduled" | "published" | "draft"
  >("scheduled");

  const [toneSettings, setToneSettings] = useState<ToneSettings>({
    style: [],
    tone: [],
    audience: "General",
    formality: "Professional",
    length: "Medium",
    keywords: "",
    brandVoice: "Authentic",
    emotionalTone: "Neutral",
    contentType: "Educational",
    callToAction: "None",
    targetEngagement: "Likes",
    industry: "Technology",
    hashtagStyle: "Minimal",
  });

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Just shipped a new API endpoint! 🚀 Check out the docs",
      scheduledFor: "Today 2:00 PM",
      status: "scheduled",
      engagement: 245,
    },
    {
      id: "2",
      content: "Behind the scenes: How we handle 1M+ requests/day",
      scheduledFor: "Tomorrow 10:30 AM",
      status: "scheduled",
      engagement: 189,
    },
    {
      id: "3",
      content: "Developer community milestone: 10k developers! 🎉",
      scheduledFor: "Yesterday 4:00 PM",
      status: "published",
      engagement: 1250,
    },
  ]);

  useEffect(() => {
    console.log(toneSettings);
  }, [toneSettings]);

  const [stats] = useState<Stats>({
    streak: 47,
    users: 12500,
    global: 89,
    totalPosts: 156,
    engagement: 4.2,
  });

  const sidebarItems = [
    { name: "Dashboard", icon: BarChart3 },
    { name: "Tone", icon: Settings },
  ];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === "Tone") setShowToneModal(true);
  };

  const handlePostClick = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post && post.status === "scheduled") {
      setEditingPost(post);
      setEditPostContent(post.content);
      setEditPostSchedule(post.scheduledFor);
      setEditPostStatus(post.status);
      setShowEditModal(true);
    }
  };

  const savePostEdit = () => {
    if (editingPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                content: editPostContent,
                scheduledFor: editPostSchedule,
                status: editPostStatus,
              }
            : post
        )
      );
      setShowEditModal(false);
      setEditingPost(null);
      setEditPostContent("");
      setEditPostSchedule("");
    }

    const github_username = localStorage.getItem("username");
    if (github_username) {
      fetch("http://localhost:3000/set_tone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_username,
          toneSettings: toneSettings,
        }),
      }).catch((err) => console.error("Error sending tone settings:", err));
    }
  };

  const saveToneSettings = () => {
    setShowToneModal(false);
    savePostEdit();
  };

  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden">

        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-purple-600">Tweeti Dashboard</h1>
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 text-sm bg-gray-100 text-gray-900 px-4 py-2 rounded-xl hover:bg-gray-200"
          >
            <Wallet className="w-4 h-4 text-purple-500" /> Connect Wallet
          </button>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-48 bg-white border-r border-gray-200 flex flex-col gap-2 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleTabClick(item.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    activeTab === item.name
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </button>
              );
            })}
          </aside>

          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
            <section className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h2 className="text-sm text-gray-900 font-semibold mb-1">Users</h2>
                <p className="text-xl font-bold text-black">{stats.users}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h2 className="text-sm text-gray-900 font-semibold mb-1">Global</h2>
                <p className="text-xl font-bold text-black">#{stats.global}</p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <h2 className="text-sm text-gray-900 font-semibold mb-1">Total Posts</h2>
                <p className="text-xl font-bold text-black">{stats.totalPosts}</p>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-black mb-4">New Post</h3>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-600 resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    if (newPostContent.trim()) {
                      const newPost: Post = {
                        id: (posts.length + 1).toString(),
                        content: newPostContent,
                        scheduledFor: "Today 6:00 PM",
                        status: "scheduled",
                        engagement: 0,
                      };
                      setPosts([...posts, newPost]);
                      setNewPostContent("");
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Schedule
                </button>
                <button
                  onClick={() => setShowToneModal(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg"
                >
                  Tone & Style
                </button>
              </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-black mb-4">Scheduled Posts</h3>
              <div className="space-y-2">
                {posts
                  .filter((p) => p.status === "scheduled")
                  .map((post) => (
                    <div
                      key={post.id}
                      onClick={() => handlePostClick(post.id)}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-600"
                    >
                      <p className="text-sm text-black">{post.content}</p>
                      <p className="text-xs text-gray-700">{post.scheduledFor}</p>
                    </div>
                  ))}
              </div>
            </section>
          </main>
        </div>

        {showToneModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[480px] bg-white rounded-2xl shadow-2xl p-6 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-bold text-black mb-4">Tone & Style Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-900 mb-1">Audience:</label>
                  <select
                    value={toneSettings.audience}
                    onChange={(e) => setToneSettings((prev) => ({ ...prev, audience: e.target.value }))}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black"
                  >
                    <option>General</option>
                    <option>Developers</option>
                    <option>Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-1">Brand Voice:</label>
                  <select
                    value={toneSettings.brandVoice}
                    onChange={(e) => setToneSettings((prev) => ({ ...prev, brandVoice: e.target.value }))}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black"
                  >
                    <option>Authentic</option>
                    <option>Innovative</option>
                    <option>Trustworthy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-1">Emotional Tone:</label>
                  <select
                    value={toneSettings.emotionalTone}
                    onChange={(e) => setToneSettings((prev) => ({ ...prev, emotionalTone: e.target.value }))}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black"
                  >
                    <option>Neutral</option>
                    <option>Excited</option>
                    <option>Empathetic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-900 mb-1">Formality:</label>
                  <select
                    value={toneSettings.formality}
                    onChange={(e) => setToneSettings((prev) => ({ ...prev, formality: e.target.value }))}
                    className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-black"
                  >
                    <option>Casual</option>
                    <option>Professional</option>
                    <option>Formal</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowToneModal(false)}
                    className="px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveToneSettings}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}