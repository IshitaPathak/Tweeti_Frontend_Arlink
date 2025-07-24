"use client";

import {
  BarChart3,
  Settings,
  Wallet,
  X,
  Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import { connectWallet } from "@/lib/arutils";
import ToneSettingsModal from "../tone-modal";
import Link from "next/link";

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

export default function Dashboard() {
  const API_BASE_URL = "https://tweeti-mk3.vercel.app";

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [newPostContent, setNewPostContent] = useState("");
  const [showToneModal, setShowToneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editPostContent, setEditPostContent] = useState("");

  const [toneSettings, setToneSettings] = useState<ToneSettings>({
    style: "Minimal",
    tone: "Neutral",
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

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const github_username = localStorage.getItem("username");
    if (!github_username) return;

    const fetchGeneratedTweet = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/generated_tweet/${github_username}`);
        if (!res.ok) throw new Error("Failed to fetch generated tweet");
        const data = await res.json();
        if (data?.generated_msg) {
          const newPost: Post = {
            id: "generated",
            content: data.generated_msg,
            scheduledFor: "Today 5:00 PM",
            status: "scheduled",
            engagement: 245,
          };
          setPosts([newPost]);
        }
      } catch (error) {
        console.error("Error fetching generated tweet:", error);
      }
    };

    fetchGeneratedTweet();
  }, []);

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
      setShowEditModal(true);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
    const github_username = localStorage.getItem("username");
    if (github_username && postId === "generated") {
      fetch(`${API_BASE_URL}/delete_generated_msg/${github_username}`, {
        method: "DELETE",
      }).catch((err) => console.error("Error deleting generated message:", err));
    }
  };

  const savePostEdit = () => {
    if (!editingPost) return;
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === editingPost.id ? { ...post, content: editPostContent } : post
      )
    );

    const github_username = localStorage.getItem("username");
    if (github_username && editingPost.id === "generated") {
      fetch(`${API_BASE_URL}/update_generated_msg/${github_username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generated_msg: editPostContent }),
      }).catch((err) => console.error("Error updating generated message:", err));
    }

    setShowEditModal(false);
    setEditingPost(null); 
    setEditPostContent("");
  };

  const saveToneSettings = () => {
    const github_username = localStorage.getItem("username");
    console.log(github_username)
    if (github_username) {
      fetch(`http://${API_BASE_URL}/set_tone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          github_username,
          toneSettings: toneSettings,
        }),
      }).catch((err) => console.error("Error sending tone settings:", err));
    }
    setShowToneModal(false);
    savePostEdit();
  };

  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto flex flex-col h-full bg-white shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-purple-600">Tweeti Dashboard</h1>
        </header>
  
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-48 bg-white border-r border-gray-200 flex flex-col gap-2 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleTabClick(item.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${activeTab === item.name
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
  
            <section>
              <div className="flex flex-wrap gap-11 p-6 pr-5 bg-gray-50">
                {/* Card 1 */}
                <div className="relative bg-white rounded-2xl shadow-md p-6 w-full sm:w-[320px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-md mb-4">
                    <span className="text-xl">➡️</span>
                  </div>
                  <span className="absolute top-4 right-4 text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Requires X Credentials
                  </span>
                  <h3 className="text-lg font-semibold mb-1">GitHub Commit to Tweet</h3>
                  <p className="text-sm text-gray-500 mb-4">Automatically tweet updates about your product</p>
                  <button className="w-full text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md py-2 transition">
                    <Link
                      href="https://github.com/apps/tweetiii"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Started Now
                    </Link>
                  </button>
                </div>
  
                {/* Card 2 */}
                <div className="relative bg-white rounded-2xl shadow-md p-6 w-full sm:w-[320px]">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-md mb-4">
                    <span className="text-xl">📄</span>
                  </div>
                  <span className="absolute top-4 right-4 text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    Configure with github
                  </span>
                  <h3 className="text-lg font-semibold mb-1">GitHub Docify</h3>
                  <p className="text-sm text-gray-500 mb-4">Keep your README updated</p>
                  <button className="w-full text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md py-2 transition">
                    <Link
                      href="https://github.com/apps/readmepusher"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Started Now
                    </Link>
                  </button>
                </div>
              </div>
            </section>
  
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-black mb-4">Scheduled Posts</h3>
              <div className="space-y-4">
                {posts
                  .filter((p) => p.status === "scheduled")
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex gap-4 border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">@{localStorage.getItem("username") || "username"}</span>
                            <span className="text-xs text-gray-500">{post.scheduledFor}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handlePostClick(post.id)}
                              className="text-xs text-purple-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-black text-sm leading-snug">{post.content}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg width="16" height="16" fill="currentColor" className="text-pink-500">
                              <path d="M8 14s6-4.3 6-7.5S11.5 2 8 5.3 2 6.5 2 9.5 8 14 8 14z" />
                            </svg>
                            {post.engagement || 0}
                          </div>
                          <span>Scheduled</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </main>
        </div>
      </div>
  
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Post</h3>
            <textarea
              value={editPostContent}
              onChange={(e) => setEditPostContent(e.target.value)}
              className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-600 resize-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex items-center gap-1 text-gray-600 hover:text-black"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={savePostEdit}
                className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
  
      <ToneSettingsModal
        showToneModal={showToneModal}
        setShowToneModal={setShowToneModal}
        toneSettings={toneSettings}
        setToneSettings={setToneSettings}
      />
    </div>
  );
};