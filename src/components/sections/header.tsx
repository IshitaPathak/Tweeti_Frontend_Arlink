"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { Check } from "lucide-react";
import useAuth from "@/lib/hooks/useAuth";
import Drawer from "@/components/drawer";
import Menu from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { session, signIn } = useAuth();
  const [addBorder, setAddBorder] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | null>(
    null
  );
  const [showXModal, setShowXModal] = useState(false);
  const [xCredentials, setXCredentials] = useState({
    access_token: "",
    access_secret: "",
  });
  const [githubUsername, setGithubUsername] = useState("");
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isXLoading, setIsXLoading] = useState(false);

  const isXConnected = Boolean(
    xCredentials.access_token && xCredentials.access_secret
  );

  useEffect(() => {
    const handleScroll = () => setAddBorder(window.scrollY > 20);

    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    
    if (username) {
      localStorage.setItem("username", username);
      setGithubUsername(username);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const username = params.get('username');
      console.log('GitHub Username:', username);
    if (session?.githubUsername) {
      console.log(session.githubUsername);
      setGithubUsername(session.githubUsername);
    }
  }, [session]);

  useEffect(() => {
    if (localStorage.getItem("showXModal") === "true") {
      setShowXModal(true);
    }
  }, []);

  const openModal = () => {
    setShowXModal(true);
    localStorage.setItem("showXModal", "true");
  };

  const closeModal = () => {
    setShowXModal(false);
    localStorage.removeItem("showXModal");
  };

  const handleSignIn = async () => {
    try {
      console.log("entered in the login with github");
      setIsGithubLoading(true);
      await signIn();
      // const data = await axios.get("http://localhost:3001/api/auth/github")
      // console.log(data)
    } catch (error) {
      console.error("GitHub sign in error:", error);
    } finally {
      setIsGithubLoading(false);
    }
  };

  const handleConnectX = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openModal();
  };

  const getXCredentials = async () => {
    try {
      setIsXLoading(true);
      const popup = window.open(
        `https://x-auth-kiqo.vercel.app/auth/twitter`,
        "_blank",
        "width=500,height=600"
      );

      if (!popup) {
        setStatusType("error");
        setStatusMessage("Popup blocked. Please allow popups and try again.");
        return;
      }

      const messageListener = async (event: MessageEvent) => {
        if (
          event.data?.access_token &&
          event.data?.access_secret &&
          githubUsername
        ) {
          const tokenData = {
            github_username: githubUsername,
            access_token: event.data.access_token,
            access_secret: event.data.access_secret,
          };

          setXCredentials({
            access_token: tokenData.access_token,
            access_secret: tokenData.access_secret,
          });

          try {
            const res = await fetch(
              `https://tweeti-backend.vercel.app/api/save-x-credentials`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(tokenData),
              }
            );

            if (!res.ok) throw new Error("Failed to save credentials");

            setStatusType("success");
            setStatusMessage("✅ Token received and saved successfully");
            setTimeout(() => {
              setStatusType(null);
              setStatusMessage("");
            }, 3000); // 3 seconds
          } catch (err) {
            console.error("❌ Failed to save credentials:", err);
            setStatusType("error");
            setStatusMessage("❌ Token received but failed to save..");
          } finally {
            setIsXLoading(false);
          }

          if (githubUsername && tokenData.access_token && tokenData.access_secret) {
            closeModal();
          }

          window.removeEventListener("message", messageListener);
          popup.close();
        }
      };

      window.addEventListener("message", messageListener);
    } catch (err) {
      console.error("X OAuth error:", err);
      setStatusType("error");
      setStatusMessage("❌ Failed to connect to X. Try again.");
      setIsXLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          addBorder && "border-border/40"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link
              href="/"
              title="brand-logo"
              className="relative mr-6 flex items-center"
            >
              <Image
                src="/Tweeti_Logo.png"
                alt="Tweeti Logo"
                width={100}
                height={100}
              />
            </Link>
          </div>

          <div className="hidden lg:block">
            <div className="flex items-center">
              <nav className="mr-10">
                <Menu />
              </nav>

              <div className="gap-2 flex items-center">
                {isXConnected ? (
                  <div className="inline-flex items-center text-green-700 font-medium border border-green-200 px-3 py-2 rounded-md text-sm bg-green-300">
                    ✅ Connected
                  </div>
                ) : (
                  <Link
                    href=""
                    onClick={handleConnectX}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Connect GitHub & X
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-2 cursor-pointer block lg:hidden">
            <Drawer />
          </div>
        </div>
      </header>

      {/* Status Toast */}
      {statusType && (
        <div
          className={cn(
            "fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-md shadow-md transition-all duration-300 z-[9999]",
            statusType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-purple-100 text-purple-800 border border-purple-300"
          )}
        >
          {statusMessage}
        </div>
      )}

      {/* X Connect Modal */}
      {showXModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="relative w-full max-w-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
              aria-label="Close"
            >
              ×
            </button>

            <CardHeader>
              <CardTitle className="text-2xl font-heading tracking-wide ">
                🔗 Connect GitHub & X
              </CardTitle>
              <p className="text-sm font-body tracking-body text-muted-foreground mt-1">
                Securely link your X and GitHub developer credentials to
                generate automated tweets powered by Tweeti.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm font-body tracking-body text-muted-foreground">
                <span>
                  {!githubUsername
                    ? "Step 1 of 2"
                    : !isXConnected
                    ? "Step 2 of 2"
                    : "All steps complete"}
                </span>
                <span>
                  {!githubUsername
                    ? "First connect to GitHub"
                    : !isXConnected
                    ? "Now connect to X"
                    : "You're all set!"}
                </span>
              </div>

              <Progress value={!githubUsername ? 0 : !isXConnected ? 50 : 100} className="h-2" />

              <div className="pt-2 text-sm font-body tracking-body text-muted-foreground">
                Need help?{" "}
                <a
                  href="https://tweeti.vercel.app/blog/how-we-manage-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-body tracking-body"
                >
                  Learn how we manage your data →
                </a>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-3">
              <Button
                variant={githubUsername ? undefined : "ghost"}
                onClick={handleSignIn}
                className={`w-full flex items-center justify-center gap-2 transition-colors ${
                  githubUsername
                    ? "bg-green-600 hover:bg-green-600 text-white cursor-default"
                    : ""
                }`}
                disabled={isGithubLoading || !!githubUsername}
              >
                {githubUsername ? (
                  "Connected"
                ) : isGithubLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-primary" />
                    Connecting...
                  </>
                ) : (
                  "Connect to GitHub"
                )}
              </Button>

              <Button
                className="w-full text-white-900 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
                onClick={getXCredentials}
                disabled={isXLoading || !githubUsername}
              >
                {isXConnected ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    Connected to X
                  </>
                ) : isXLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white" />
                    Connecting...
                  </>
                ) : (
                  "Connect to X"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
