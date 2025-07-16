"use client";
import {
  Calendar,
  ImageIcon,
  BarChart3,
  Crown,
  Settings,
  Plus,
  Tag,
  Upload,
  TrendingUp,
  Users,
  Globe,
  Wallet,
  Activity,
  Zap,
  Trophy,
  Medal,
  Award,
  X,
  ChevronDown,
  Edit3,
  Clock,
  Save,
} from "lucide-react";
import Image from "next/image";
import axios from "axios"
import { useEffect, useState } from "react";

interface Post {
  id: string;
  content: string;
  scheduledFor: string;
  status: "scheduled" | "published" | "draft";
  engagement?: number;
}

interface User {
  id: string;
  username: string;
  streak: number;
  avatar: string;
  rank: number;
  change: "up" | "down" | "same";
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

  const [leaderboard] = useState<User[]>([
    {
      id: "1",
      username: "anon",
      streak: 47,
      avatar: "A",
      rank: 1,
      change: "same",
    },
    {
      id: "2",
      username: "dev_sarah",
      streak: 45,
      avatar: "S",
      rank: 2,
      change: "up",
    },
    {
      id: "3",
      username: "code_ninja",
      streak: 42,
      avatar: "C",
      rank: 3,
      change: "down",
    },
    {
      id: "4",
      username: "api_master",
      streak: 38,
      avatar: "M",
      rank: 4,
      change: "up",
    },
    {
      id: "5",
      username: "tech_guru",
      streak: 35,
      avatar: "T",
      rank: 5,
      change: "same",
    },
  ]);

  useEffect(() => {
    console.log(toneSettings)
  }, [setToneSettings])
  

  const [stats] = useState<Stats>({
    streak: 47,
    users: 12500,
    global: 89,
    totalPosts: 156,
    engagement: 4.2,
  });

  const sidebarItems = [
    { name: "Dashboard", icon: BarChart3 },
    { name: "Schedule", icon: Calendar },
    { name: "Tone", icon: Settings },
    { name: "Images", icon: ImageIcon },
    { name: "Premium", icon: Crown },
    { name: "Analytics", icon: TrendingUp },
  ];

  const toneOptions = [
    "Professional",
    "Casual",
    "Friendly",
    "Authoritative",
    "Humorous",
    "Inspirational",
    "Motivational",
    "Educational",
  ];

  const styleOptions = [
    "Technical",
    "Conversational",
    "Educational",
    "Promotional",
    "Storytelling",
    "News-like",
    "Question-based",
    "List-format",
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="text-gray-600 font-bold text-sm">#{rank}</span>;
    }
  };

  const getChangeIndicator = (change: "up" | "down" | "same") => {
    switch (change) {
      case "up":
        return <span className="text-green-500 text-xs">↗</span>;
      case "down":
        return <span className="text-red-500 text-xs">↘</span>;
      default:
        return <span className="text-gray-500 text-xs">—</span>;
    }
  };

  const handleToneChange = async (option: string, type: "tone" | "style") => {
    setToneSettings((prev) => {
      const updated = {
        ...prev,
        [type]: prev[type].includes(option)
          ? prev[type].filter((item) => item !== option)
          : [...prev[type], option],
      };
  
      return updated;
    });
  };
  
const handleUpdateTone = async()=>{
  await axios.post("http://localhost:3000/set_tone" , toneSettings)
}

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === "Tone") {
      setShowToneModal(true);
    }
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

  const saveToneSettings = () => {
    console.log("Saving tone settings:", toneSettings);
    setShowToneModal(false);
    
    savePostEdit()
  };

  const savePostEdit = () => {
    console.log("sending data to database")
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
    console.log(github_username)
      if (github_username) {
        fetch("http://localhost:3000/set_tone", {
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
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPost(null);
    setEditPostContent("");
    setEditPostSchedule("");
  };

  return (
    <div className="h-screen w-full bg-gray-100 p-2 overflow-hidden">
      <div className="h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 h-16 flex justify-between items-center">
          <div className="bg-black rounded-xl px-4 py-2">
            <span className="text-white font-semibold">
              Developer Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-300 flex items-center gap-2">
              <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-gray-800 font-medium">hey anon</span>
            </div>
            <button className="bg-gray-100 rounded-xl px-4 py-2 border border-gray-300 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gray-600" />
              <span className="text-gray-800 font-medium">wallet address</span>
            </button>
          </div>
        </div>

        {/* Main Content - Bento Grid */}
        <div className="h-[calc(100%-4rem)] p-4 grid grid-cols-12 grid-rows-6 gap-4">
          {/* Sidebar */}
          <div className="col-span-2 row-span-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="space-y-2 h-full">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleTabClick(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      isActive
                        ? "bg-black text-white shadow-lg"
                        : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Posts */}
          <div className="col-span-5 row-span-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-black" />
              upcoming scheduled posts
            </h3>
            <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto">
              {posts
                .filter((p) => p.status === "scheduled")
                .map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-black transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium text-sm">
                          {post.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {post.scheduledFor}
                        </p>
                      </div>
                      <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-2 row-span-3 space-y-2">
            <button className="w-full bg-black hover:bg-gray-800 text-white p-3 rounded-xl transition-all duration-200 flex items-center gap-2 justify-center">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">tag people</span>
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 justify-center border border-gray-300">
              <Upload className="w-4 h-4" />
              <span className="text-sm font-medium">select img</span>
            </button>
          </div>

          {/* Leaderboard */}
          <div className="col-span-3 row-span-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-black" />
              streak leaderboard
            </h3>
            <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto">
              {leaderboard.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                    user.username === "anon"
                      ? "bg-black text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <div
                      className={`w-6 h-6 ${
                        user.username === "anon" ? "bg-white" : "bg-black"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`${
                          user.username === "anon" ? "text-black" : "text-white"
                        } font-bold text-xs`}
                      >
                        {user.avatar}
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        user.username === "anon"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {user.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-bold text-sm ${
                        user.username === "anon"
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {user.streak}
                    </span>
                    {getChangeIndicator(user.change)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="col-span-3 row-span-2 grid grid-cols-2 gap-2">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="w-4 h-4 text-black" />
                <span className="text-gray-600 font-medium text-sm">users</span>
              </div>
              <div className="text-xl font-bold text-black">
                {(stats.users / 1000).toFixed(1)}K
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Globe className="w-4 h-4 text-black" />
                <span className="text-gray-600 font-medium text-sm">
                  global
                </span>
              </div>
              <div className="text-xl font-bold text-black">
                #{stats.global}
              </div>
            </div>
            <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Total Posts</span>
                <span className="text-black font-bold">{stats.totalPosts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Engagement Rate</span>
                <span className="text-black font-bold">
                  {stats.engagement}%
                </span>
              </div>
            </div>
          </div>

          {/* Post Content Creator */}
          <div className="col-span-5 row-span-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              **posts content**
            </h3>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your latest development insights..."
              className="w-full h-24 p-3 bg-gray-50 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-black text-gray-800 placeholder-gray-500 text-sm"
            />
            <div className="flex gap-2 mt-3">
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
                    setPosts((prev) => [...prev, newPost]);
                    setNewPostContent("");
                  }
                }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Schedule Post
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 border border-gray-300">
                <Zap className="w-4 h-4" />
                AI Enhance
              </button>
            </div>
          </div>

          {/* Content Gallery */}
          <div className="col-span-5 row-span-3 bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-5 gap-2 h-full">
              {[
                "first.jpg",
                "second.jpg",
                "third.jpg",
                "fourth.png",
                "fifth.jpg",
              ].map((e, i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-black transition-all duration-200 cursor-pointer flex items-center justify-center group"
                >
                  {/* <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-black" /> */}
                  <Image
                    src={`/${e}`}
                    width={100}
                    height={100}
                    alt={`image-${i}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Post Modal */}
        {showEditModal && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Edit Scheduled Post
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your post content and schedule
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Post Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Content:
                  </label>
                  <textarea
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-black text-gray-800 placeholder-gray-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {editPostContent.length}/280 characters
                  </div>
                </div>

                {/* Schedule Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled For:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editPostSchedule}
                      onChange={(e) => setEditPostSchedule(e.target.value)}
                      placeholder="e.g., Today 2:00 PM, Tomorrow 10:30 AM"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black pl-10"
                    />
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Post Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status:
                  </label>
                  <div className="relative">
                    <select
                      value={editPostStatus}
                      onChange={(e) =>
                        setEditPostStatus(
                          e.target.value as "scheduled" | "published" | "draft"
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Post Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview:
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">A</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-800">
                            anon
                          </span>
                          <span className="text-gray-500 text-sm">@anon</span>
                          <span className="text-gray-500 text-sm">·</span>
                          <span className="text-gray-500 text-sm">
                            {editPostSchedule}
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {editPostContent ||
                            "Your post content will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Activity className="w-4 h-4" />
                  <span>Last edited: Just now</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeEditModal}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={savePostEdit}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tone Modal */}
        {showToneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Tone & Style Settings
                  </h2>
                  <p className="text-sm text-gray-500">
                    showing{" "}
                    {toneSettings.tone.length + toneSettings.style.length} from{" "}
                    {toneOptions.length + styleOptions.length} options
                  </p>
                </div>
                <button
                  onClick={() => setShowToneModal(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Audience & Industry */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audience:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.audience}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            audience: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>General</option>
                        <option>Developers</option>
                        <option>Business</option>
                        <option>Technical</option>
                        <option>Students</option>
                        <option>Entrepreneurs</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.industry}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            industry: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Education</option>
                        <option>Marketing</option>
                        <option>E-commerce</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords/Topics:
                  </label>
                  <input
                    type="text"
                    value={toneSettings.keywords}
                    onChange={(e) =>
                      setToneSettings((prev) => ({
                        ...prev,
                        keywords: e.target.value,
                      }))
                    }
                    placeholder="e.g., AI, development, productivity, innovation"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>

                {/* Brand Voice & Emotional Tone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand Voice:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.brandVoice}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            brandVoice: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Authentic</option>
                        <option>Innovative</option>
                        <option>Trustworthy</option>
                        <option>Playful</option>
                        <option>Expert</option>
                        <option>Approachable</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emotional Tone:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.emotionalTone}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            emotionalTone: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Neutral</option>
                        <option>Excited</option>
                        <option>Confident</option>
                        <option>Empathetic</option>
                        <option>Urgent</option>
                        <option>Optimistic</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Tone
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {toneOptions.map((tone) => (
                      <label
                        key={tone}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={toneSettings.tone.includes(tone)}
                          onChange={() => handleToneChange(tone, "tone")}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-gray-700">{tone}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Style
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {styleOptions.map((style) => (
                      <label
                        key={style}
                        className="flex items-center space-x-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={toneSettings.style.includes(style)}
                          onChange={() => handleToneChange(style, "style")}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <span className="text-gray-700">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Content Type & Call to Action */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.contentType}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            contentType: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Educational</option>
                        <option>Promotional</option>
                        <option>Behind-the-scenes</option>
                        <option>News/Updates</option>
                        <option>Question/Poll</option>
                        <option>Personal Story</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.callToAction}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            callToAction: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>None</option>
                        <option>Like & Share</option>
                        <option>Comment</option>
                        <option>Visit Link</option>
                        <option>Follow</option>
                        <option>Try Product</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Target Engagement & Hashtag Style */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Engagement:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.targetEngagement}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            targetEngagement: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Likes</option>
                        <option>Comments</option>
                        <option>Shares</option>
                        <option>Clicks</option>
                        <option>Saves</option>
                        <option>All</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashtag Style:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.hashtagStyle}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            hashtagStyle: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Minimal</option>
                        <option>Moderate</option>
                        <option>Heavy</option>
                        <option>Trending</option>
                        <option>Niche</option>
                        <option>None</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Formality & Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formality:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.formality}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            formality: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Casual</option>
                        <option>Professional</option>
                        <option>Formal</option>
                        <option>Semi-formal</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Length:
                    </label>
                    <div className="relative">
                      <select
                        value={toneSettings.length}
                        onChange={(e) =>
                          setToneSettings((prev) => ({
                            ...prev,
                            length: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black appearance-none bg-white"
                      >
                        <option>Short</option>
                        <option>Medium</option>
                        <option>Long</option>
                        <option>Thread</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center p-6 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {toneSettings.tone.length + toneSettings.style.length} tone
                  selections made
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowToneModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveToneSettings}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Save Settings
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
