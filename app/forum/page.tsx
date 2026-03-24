"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import { getColorClasses } from "@/lib/utils/colors";
import { showToast } from "@/lib/toast";

/* ────────────────────────── Constants ────────────────────────── */

const AVATAR_GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-sky-600",
];

const TAG_COLORS: Record<string, { bg: string; text: string; bgLight: string; textLight: string }> = {
  bug: { bg: "bg-rose-500/15", text: "text-rose-400", bgLight: "bg-rose-50", textLight: "text-rose-600" },
  discussion: { bg: "bg-sky-500/15", text: "text-sky-400", bgLight: "bg-sky-50", textLight: "text-sky-600" },
  tutorial: { bg: "bg-emerald-500/15", text: "text-emerald-400", bgLight: "bg-emerald-50", textLight: "text-emerald-600" },
  "feature-request": { bg: "bg-violet-500/15", text: "text-violet-400", bgLight: "bg-violet-50", textLight: "text-violet-600" },
  help: { bg: "bg-amber-500/15", text: "text-amber-400", bgLight: "bg-amber-50", textLight: "text-amber-600" },
  solved: { bg: "bg-emerald-500/15", text: "text-emerald-400", bgLight: "bg-emerald-50", textLight: "text-emerald-600" },
  popular: { bg: "bg-amber-500/15", text: "text-amber-400", bgLight: "bg-amber-50", textLight: "text-amber-600" },
  featured: { bg: "bg-violet-500/15", text: "text-violet-400", bgLight: "bg-violet-50", textLight: "text-violet-600" },
  performance: { bg: "bg-cyan-500/15", text: "text-cyan-400", bgLight: "bg-cyan-50", textLight: "text-cyan-600" },
  migration: { bg: "bg-indigo-500/15", text: "text-indigo-400", bgLight: "bg-indigo-50", textLight: "text-indigo-600" },
};

const BADGE_COLORS: Record<string, { bg: string; text: string; bgLight: string; textLight: string }> = {
  Staff: { bg: "bg-emerald-500/15", text: "text-emerald-400", bgLight: "bg-emerald-50", textLight: "text-emerald-700" },
  MVP: { bg: "bg-violet-500/15", text: "text-violet-400", bgLight: "bg-violet-50", textLight: "text-violet-700" },
  Helper: { bg: "bg-sky-500/15", text: "text-sky-400", bgLight: "bg-sky-50", textLight: "text-sky-700" },
  Expert: { bg: "bg-amber-500/15", text: "text-amber-400", bgLight: "bg-amber-50", textLight: "text-amber-700" },
};

/* ────────────────────────── Types ────────────────────────── */

type Category = {
  title: string;
  desc: string;
  threads: string;
  replies: string;
  color: string;
  icon: string;
};

type ThreadTag = {
  label: string;
  key: string;
};

type Thread = {
  id: string;
  initials: string;
  gradient: string;
  title: string;
  author: string;
  category: string;
  time: string;
  excerpt: string;
  content: string;
  tags: ThreadTag[];
  comments: number;
  views: number;
  upvotes: number;
  isPinned?: boolean;
  replies: Reply[];
};

type Reply = {
  id: string;
  initials: string;
  gradient: string;
  author: string;
  badge: string | null;
  time: string;
  content: string;
  likes: number;
};

type Contributor = {
  initials: string;
  gradient: string;
  name: string;
  helpful: string;
  badge: string | null;
};

/* ────────────────────────── Data ────────────────────────── */

const categories: Category[] = [
  {
    title: "General Discussion",
    desc: "Chat about anything related to WordPress and web hosting",
    threads: "1,234",
    replies: "8,567",
    color: "emerald",
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  },
  {
    title: "Technical Support",
    desc: "Get help with hosting issues, errors, and configurations",
    threads: "2,456",
    replies: "15,234",
    color: "sky",
    icon: "M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z",
  },
  {
    title: "Feature Requests",
    desc: "Share ideas and vote on new features for LimeWP",
    threads: "456",
    replies: "2,890",
    color: "violet",
    icon: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
  {
    title: "Showcase",
    desc: "Show off your WordPress sites built on LimeWP",
    threads: "189",
    replies: "1,456",
    color: "amber",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
];

const initialThreads: Thread[] = [
  {
    id: "1",
    initials: "JD",
    gradient: AVATAR_GRADIENTS[0],
    title: "How to configure Redis object caching for better performance?",
    author: "John Doe",
    category: "Technical Support",
    time: "2 hours ago",
    excerpt: "I've been trying to set up Redis for my WordPress site but running into some configuration issues. Has anyone successfully implemented this with LimeWP?",
    content: "I've been trying to set up Redis for my WordPress site but running into some configuration issues. Has anyone successfully implemented this with LimeWP?\n\nI followed the official documentation but keep getting connection timeout errors. My site is on the Business plan and I've enabled the Redis add-on from the dashboard. The wp-config.php has the correct settings but the Object Cache Health Check plugin shows 'Not Connected'.\n\nAny help would be greatly appreciated. I've already tried flushing the cache and restarting the Redis service from the panel.",
    tags: [{ label: "help", key: "help" }, { label: "performance", key: "performance" }],
    comments: 12,
    views: 156,
    upvotes: 23,
    isPinned: true,
    replies: [
      { id: "r1", initials: "SM", gradient: AVATAR_GRADIENTS[1], author: "Sarah M.", badge: "Staff", time: "1 hour ago", content: "Hi John! This is a known issue with the latest Redis 7.2 update. We've pushed a fix that should resolve the connection timeout. Please try clearing your object cache from the LimeWP dashboard under Tools > Cache and restart the Redis instance. Let me know if that helps!", likes: 8 },
      { id: "r2", initials: "MK", gradient: AVATAR_GRADIENTS[2], author: "Mike K.", badge: "MVP", time: "45 min ago", content: "I had the same issue last week. Sarah's fix worked for me. Also make sure your wp-config.php has define('WP_REDIS_HOST', '127.0.0.1') and not 'localhost' — there's a subtle DNS resolution difference.", likes: 5 },
      { id: "r3", initials: "AL", gradient: AVATAR_GRADIENTS[3], author: "Amy L.", badge: null, time: "30 min ago", content: "Can confirm, switching from 'localhost' to '127.0.0.1' fixed it for me too. Thanks Mike!", likes: 2 },
    ],
  },
  {
    id: "2",
    initials: "SM",
    gradient: AVATAR_GRADIENTS[1],
    title: "Best practices for WordPress multisite on LimeWP",
    author: "Sarah M.",
    category: "General Discussion",
    time: "5 hours ago",
    excerpt: "I'm planning to set up a multisite network and would love to hear from others who have done this on LimeWP hosting...",
    content: "I'm planning to set up a multisite network and would love to hear from others who have done this on LimeWP hosting.\n\nSpecifically, I'm interested in:\n1. Subdomain vs subdirectory setup — which works better on LimeWP?\n2. Performance considerations with 10+ subsites\n3. Plugin compatibility issues to watch out for\n\nI'm currently on the Business plan with 5 sites. Would I need to upgrade to Enterprise for multisite, or does each subsite count as a separate installation?",
    tags: [{ label: "solved", key: "solved" }, { label: "discussion", key: "discussion" }],
    comments: 24,
    views: 342,
    upvotes: 45,
    isPinned: false,
    replies: [
      { id: "r4", initials: "JD", gradient: AVATAR_GRADIENTS[0], author: "John Doe", badge: "MVP", time: "4 hours ago", content: "Great question! I run a multisite with 8 subsites on the Business plan. Subdirectory setup works seamlessly. Each multisite network counts as 1 site, not per subsite. Performance has been excellent with the built-in caching.", likes: 12 },
      { id: "r5", initials: "RJ", gradient: AVATAR_GRADIENTS[4], author: "Rob J.", badge: null, time: "3 hours ago", content: "One thing to watch out for: some plugins don't support network activation properly. I'd recommend testing thoroughly on a staging environment first.", likes: 6 },
    ],
  },
  {
    id: "3",
    initials: "MK",
    gradient: AVATAR_GRADIENTS[2],
    title: "Feature Request: Staging environment one-click deploy",
    author: "Mike K.",
    category: "Feature Requests",
    time: "1 day ago",
    excerpt: "It would be great to have a one-click deploy from staging to production with automatic backup before deployment...",
    content: "It would be great to have a one-click deploy from staging to production with automatic backup before deployment.\n\nCurrently, pushing changes from staging to production requires several manual steps. A streamlined workflow would save so much time, especially for agencies managing multiple client sites.\n\nIdeal features:\n- One-click push from staging to production\n- Automatic backup creation before deploy\n- Selective sync (files only, database only, or both)\n- Rollback capability if something goes wrong",
    tags: [{ label: "feature-request", key: "feature-request" }, { label: "popular", key: "popular" }],
    comments: 45,
    views: 567,
    upvotes: 89,
    isPinned: false,
    replies: [
      { id: "r6", initials: "TW", gradient: AVATAR_GRADIENTS[5], author: "Tom W.", badge: "Staff", time: "20 hours ago", content: "Thanks for the detailed request Mike! This is actually on our Q2 roadmap. We're planning to release a beta of the one-click deploy feature next month. I'll add your selective sync suggestion to the spec!", likes: 34 },
    ],
  },
  {
    id: "4",
    initials: "AL",
    gradient: AVATAR_GRADIENTS[3],
    title: "Showcase: My e-commerce site built with WooCommerce",
    author: "Amy L.",
    category: "Showcase",
    time: "2 days ago",
    excerpt: "Just launched my online store using WooCommerce on LimeWP. Here's how I optimized it for speed and conversions...",
    content: "Just launched my online store using WooCommerce on LimeWP. Here's how I optimized it for speed and conversions!\n\nAfter 3 months of development, my store is live and achieving a 98 performance score on PageSpeed Insights. Key optimizations:\n- Used LimeWP's built-in CDN for static assets\n- Enabled Redis object caching for WooCommerce sessions\n- Lazy loaded all product images with next-gen formats\n- Implemented cart fragments caching\n\nThe site handles ~500 concurrent users during peak hours with zero downtime. Happy to answer any questions!",
    tags: [{ label: "featured", key: "featured" }, { label: "tutorial", key: "tutorial" }],
    comments: 18,
    views: 234,
    upvotes: 56,
    isPinned: false,
    replies: [
      { id: "r7", initials: "SM", gradient: AVATAR_GRADIENTS[1], author: "Sarah M.", badge: "Staff", time: "1 day ago", content: "This is amazing Amy! Would you be interested in writing a guest post for our blog? We'd love to feature your optimization journey.", likes: 9 },
      { id: "r8", initials: "MK", gradient: AVATAR_GRADIENTS[2], author: "Mike K.", badge: "MVP", time: "1 day ago", content: "98 on PageSpeed is incredible for WooCommerce! Could you share more about your cart fragments caching setup?", likes: 7 },
    ],
  },
  {
    id: "5",
    initials: "RJ",
    gradient: AVATAR_GRADIENTS[4],
    title: "SSL certificate not renewing automatically - Help needed",
    author: "Rob J.",
    category: "Technical Support",
    time: "3 days ago",
    excerpt: "My SSL cert didn't auto-renew and now my site shows security warnings. What should I do?",
    content: "My SSL cert didn't auto-renew and now my site shows security warnings. What should I do?\n\nI noticed my site started showing 'Not Secure' warnings yesterday. The SSL certificate expired on March 20th and didn't auto-renew. I'm on the Business plan which includes free SSL.\n\nI've tried forcing a renewal from the dashboard but it shows 'Renewal Failed - DNS validation error'. My domain DNS is managed through Cloudflare. Could that be causing the issue?",
    tags: [{ label: "solved", key: "solved" }, { label: "bug", key: "bug" }],
    comments: 8,
    views: 189,
    upvotes: 12,
    isPinned: false,
    replies: [
      { id: "r9", initials: "TW", gradient: AVATAR_GRADIENTS[5], author: "Tom W.", badge: "Staff", time: "3 days ago", content: "Hi Rob! When using Cloudflare, make sure the SSL/TLS mode is set to 'Full (Strict)' and that the proxy status for your domain's A record is set to 'DNS only' (gray cloud) temporarily during renewal. After the cert renews, you can re-enable the proxy.", likes: 11 },
      { id: "r10", initials: "RJ", gradient: AVATAR_GRADIENTS[4], author: "Rob J.", badge: null, time: "3 days ago", content: "That worked perfectly! Switched to DNS only, forced renewal, and it went through. Back to green padlock. Thanks Tom!", likes: 4 },
    ],
  },
  {
    id: "6",
    initials: "TW",
    gradient: AVATAR_GRADIENTS[5],
    title: "Guide: Migrating from shared hosting to LimeWP in 10 minutes",
    author: "Tom W.",
    category: "General Discussion",
    time: "4 days ago",
    excerpt: "A step-by-step guide on migrating your WordPress site from any shared hosting provider to LimeWP with zero downtime...",
    content: "A step-by-step guide on migrating your WordPress site from any shared hosting provider to LimeWP with zero downtime.\n\nStep 1: Install the LimeWP Migration Plugin on your existing site\nStep 2: Generate a migration key from your LimeWP dashboard\nStep 3: Enter the key in the plugin and click 'Start Migration'\nStep 4: The plugin handles everything — files, database, configurations\nStep 5: Update your DNS records to point to LimeWP\n\nThe entire process takes about 10 minutes for a typical WordPress site. For larger sites (10GB+), it may take up to 30 minutes. The migration plugin handles serialized data replacement automatically.",
    tags: [{ label: "tutorial", key: "tutorial" }, { label: "migration", key: "migration" }],
    comments: 32,
    views: 891,
    upvotes: 67,
    isPinned: true,
    replies: [
      { id: "r11", initials: "AL", gradient: AVATAR_GRADIENTS[3], author: "Amy L.", badge: null, time: "3 days ago", content: "This guide is so helpful! I migrated 3 sites following these steps and everything went smoothly. The migration plugin is a game changer.", likes: 15 },
    ],
  },
  {
    id: "7",
    initials: "KP",
    gradient: AVATAR_GRADIENTS[0],
    title: "PHP 8.3 compatibility issues with popular plugins",
    author: "Karen P.",
    category: "Technical Support",
    time: "5 days ago",
    excerpt: "After upgrading to PHP 8.3 on LimeWP, some of my plugins started throwing deprecation warnings. Here's what I found...",
    content: "After upgrading to PHP 8.3 on LimeWP, some of my plugins started throwing deprecation warnings. Here's what I found and how I resolved them.\n\nPlugins affected:\n- Contact Form 7 (v5.8) — fixed in v5.8.1\n- Yoast SEO (v21.x) — fixed in v22.0\n- WP Super Cache — still has issues, switch to LimeWP's built-in caching\n\nThe main PHP 8.3 changes causing issues are the deprecation of dynamic properties and changes to string handling functions. Most plugin authors have already released updates.\n\nMy recommendation: test on staging first before upgrading PHP on production.",
    tags: [{ label: "bug", key: "bug" }, { label: "help", key: "help" }],
    comments: 15,
    views: 423,
    upvotes: 34,
    isPinned: false,
    replies: [
      { id: "r12", initials: "JD", gradient: AVATAR_GRADIENTS[0], author: "John Doe", badge: "MVP", time: "4 days ago", content: "Great roundup Karen! I'd add that Elementor also had issues with PHP 8.3 but their latest update (3.19) resolves everything. Always keep plugins updated before switching PHP versions.", likes: 8 },
    ],
  },
];

const contributors: Contributor[] = [
  { initials: "JD", gradient: AVATAR_GRADIENTS[0], name: "John Doe", helpful: "142 helpful", badge: "MVP" },
  { initials: "SM", gradient: AVATAR_GRADIENTS[1], name: "Sarah M.", helpful: "98 helpful", badge: "Staff" },
  { initials: "MK", gradient: AVATAR_GRADIENTS[2], name: "Mike K.", helpful: "76 helpful", badge: "MVP" },
  { initials: "TW", gradient: AVATAR_GRADIENTS[5], name: "Tom W.", helpful: "71 helpful", badge: "Staff" },
  { initials: "AL", gradient: AVATAR_GRADIENTS[3], name: "Amy L.", helpful: "54 helpful", badge: "Helper" },
];

const trendingTags = ["performance", "ssl", "migration", "woocommerce", "caching", "php8", "backup", "dns"];

const CATEGORY_NAMES = categories.map((c) => c.title);

/* ────────────────────────── Helpers ────────────────────────── */

function getCatColor(catTitle: string) {
  const cat = categories.find((c) => c.title === catTitle);
  return cat?.color || "emerald";
}

function getTagStyle(key: string, isLight: boolean) {
  const tc = TAG_COLORS[key];
  if (!tc) return isLight ? "bg-slate-100 text-slate-600" : "bg-slate-500/15 text-slate-400";
  return isLight ? `${tc.bgLight} ${tc.textLight}` : `${tc.bg} ${tc.text}`;
}

function getBadgeStyle(badge: string, isLight: boolean) {
  const bc = BADGE_COLORS[badge];
  if (!bc) return isLight ? "bg-slate-100 text-slate-600" : "bg-slate-500/15 text-slate-400";
  return isLight ? `${bc.bgLight} ${bc.textLight}` : `${bc.bg} ${bc.text}`;
}

/* ────────────────────────── Component ────────────────────────── */

export default function ForumPage() {
  const { resolvedTheme, accentColor } = useTheme();
  const isLight = resolvedTheme === "light";
  const accent = getColorClasses(accentColor);

  // State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [threads, setThreads] = useState(initialThreads);
  const [upvotedThreads, setUpvotedThreads] = useState<Set<string>>(new Set());
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  // New Thread form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");
  const [newThreadLoading, setNewThreadLoading] = useState(false);

  // Tabs
  const tabs = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular" },
    { id: "unanswered", label: "Unanswered" },
    { id: "my-threads", label: "My Threads" },
  ];

  // Body scroll lock + Escape key
  useEffect(() => {
    const isOpen = !!selectedThread || showNewThread;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedThread, showNewThread]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (selectedThread) setSelectedThread(null);
        else if (showNewThread) setShowNewThread(false);
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedThread, showNewThread]);

  // Filter threads
  const filteredThreads = threads.filter((t) => {
    const matchesSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    switch (activeTab) {
      case "popular": return t.upvotes >= 30;
      case "unanswered": return t.comments === 0;
      case "my-threads": return t.author === "John Doe";
      default: return true;
    }
  });

  // Sort: pinned first
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Upvote handler
  const handleUpvote = useCallback((threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setUpvotedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, upvotes: upvotedThreads.has(threadId) ? t.upvotes - 1 : t.upvotes + 1 }
          : t
      )
    );
  }, [upvotedThreads]);

  // Post reply
  const handlePostReply = useCallback(() => {
    if (!replyText.trim() || !selectedThread) return;
    setReplyLoading(true);
    setTimeout(() => {
      const newReply: Reply = {
        id: `r-new-${Date.now()}`,
        initials: "JD",
        gradient: AVATAR_GRADIENTS[0],
        author: "John Doe",
        badge: "MVP",
        time: "Just now",
        content: replyText.trim(),
        likes: 0,
      };
      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThread.id
            ? { ...t, replies: [...t.replies, newReply], comments: t.comments + 1 }
            : t
        )
      );
      setSelectedThread((prev) =>
        prev ? { ...prev, replies: [...prev.replies, newReply], comments: prev.comments + 1 } : null
      );
      setReplyText("");
      setReplyLoading(false);
      showToast.success("Reply posted successfully!");
    }, 800);
  }, [replyText, selectedThread]);

  // Post new thread
  const handlePostThread = useCallback(() => {
    if (!newTitle.trim() || !newCategory || !newContent.trim()) {
      showToast.error("Please fill in all required fields.");
      return;
    }
    setNewThreadLoading(true);
    setTimeout(() => {
      const tagList = newTags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .map((t) => ({ label: t, key: t }));
      const newThread: Thread = {
        id: `t-${Date.now()}`,
        initials: "JD",
        gradient: AVATAR_GRADIENTS[0],
        title: newTitle.trim(),
        author: "John Doe",
        category: newCategory,
        time: "Just now",
        excerpt: newContent.trim().slice(0, 120) + "...",
        content: newContent.trim(),
        tags: tagList,
        comments: 0,
        views: 0,
        upvotes: 0,
        replies: [],
      };
      setThreads((prev) => [newThread, ...prev]);
      setShowNewThread(false);
      setNewTitle("");
      setNewCategory("");
      setNewContent("");
      setNewTags("");
      setNewThreadLoading(false);
      showToast.success("Thread posted successfully!");
    }, 1000);
  }, [newTitle, newCategory, newContent, newTags]);

  // ── Style classes ──
  const cardClass = `rounded-2xl border transition-all ${
    isLight ? "bg-white border-slate-200" : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border-[var(--border-tertiary)]"
  }`;

  const inputClass = `w-full h-10 px-3.5 rounded-xl border text-sm transition-all outline-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const textareaClass = `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all outline-none resize-none ${
    isLight ? "bg-white border-slate-300 text-slate-800 focus:border-slate-400" : "bg-[var(--bg-elevated)] border-[var(--border-primary)] text-slate-200 focus:border-[var(--border-secondary)]"
  }`;

  const modalOverlayClass = "fixed inset-0 z-[100] flex items-center justify-center p-4";
  const modalBackdropClass = "absolute inset-0 bg-black/60 backdrop-blur-sm";
  const modalCardClass = `relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
    isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-tertiary)]"
  }`;

  return (
    <AppShell>
      {/* ─── Page Header ─── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isLight ? `${accent.bg} ring-1 ${accent.ring}` : `${accent.bg} ring-1 ${accent.ring}`}`}>
            <svg className={`w-6 h-6 ${accent.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-slate-800" : "text-slate-100"}`}>
              Community Forum
            </h1>
            <p className={`text-sm ${isLight ? "text-slate-600" : "text-slate-500"}`}>Connect, share, and learn with the LimeWP community</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewThread(true)}
          className={`group h-10 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2 shadow-lg ${accent.button} ${accent.buttonHover} text-white ${accent.buttonShadow}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Thread
        </button>
      </div>

      {/* ─── Categories Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => {
          const cc = getColorClasses(cat.color);
          return (
            <div
              key={cat.title}
              className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-px overflow-hidden ${
                isLight
                  ? "bg-white border border-slate-200 hover:border-slate-300 hover:shadow-slate-200/50"
                  : "bg-gradient-to-br from-[var(--gradient-card-from)] to-[var(--gradient-card-to)] border border-[var(--border-tertiary)] hover:border-[var(--border-primary)] hover:shadow-black/20"
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${cc.glow} rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl ${cc.bg} ${cc.text} ring-1 ${cc.ring} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d={cat.icon} />
                  </svg>
                </div>
                <h3 className={`font-semibold transition-colors ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"}`}>{cat.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.desc}</p>
                <div className={`flex items-center gap-3 mt-4 pt-3 border-t ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
                  <span className="text-[11px] text-slate-500">
                    <span className={`font-semibold ${cc.text}`}>{cat.threads}</span> threads
                  </span>
                  <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                  <span className="text-[11px] text-slate-500">
                    <span className={`font-semibold ${isLight ? "text-slate-700" : "text-slate-400"}`}>{cat.replies}</span> replies
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Main Content ─── */}
      <div className="flex gap-6">
        {/* Discussions Panel */}
        <div className="flex-1 min-w-0">
          <div className={`rounded-2xl overflow-hidden ${isLight ? "bg-white border border-slate-200" : "bg-[var(--bg-primary)] border border-[var(--border-secondary)]"}`}>
            {/* Tabs + Search */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? isLight
                          ? `bg-slate-100 text-slate-900`
                          : `bg-[var(--bg-elevated)] text-white`
                        : isLight
                          ? "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                          : "text-slate-500 hover:text-slate-300 hover:bg-[var(--bg-elevated)]/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-56">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm placeholder:text-slate-500 focus:outline-none transition-all ${
                    isLight
                      ? "bg-slate-100 border border-slate-200 text-slate-800 focus:border-slate-300"
                      : "bg-[var(--bg-elevated)]/50 border border-[var(--border-primary)]/50 text-slate-300 focus:border-[var(--border-secondary)]"
                  }`}
                />
              </div>
            </div>

            {/* Thread List */}
            <div className={`divide-y ${isLight ? "divide-slate-200" : "divide-[var(--border-secondary)]"}`}>
              {sortedThreads.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-slate-500 text-sm">No threads found matching your criteria.</p>
                </div>
              )}
              {sortedThreads.map((thread) => {
                const isUpvoted = upvotedThreads.has(thread.id);
                const catColor = getCatColor(thread.category);
                const catClasses = getColorClasses(catColor);
                return (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className={`group relative px-5 py-4 transition-all cursor-pointer ${
                      isLight ? "hover:bg-slate-50" : "hover:bg-[var(--bg-secondary)]"
                    } ${thread.isPinned ? (isLight ? "border-l-[3px] border-l-emerald-400" : "border-l-[3px] border-l-emerald-500/60") : ""}`}
                  >
                    <div className="flex gap-4">
                      {/* Upvote */}
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-0.5">
                        <button
                          onClick={(e) => handleUpvote(thread.id, e)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                            isUpvoted
                              ? isLight ? `${accent.bg} ${accent.text}` : `${accent.bg} ${accent.text}`
                              : isLight ? "hover:bg-slate-100 text-slate-400 hover:text-slate-600" : "hover:bg-[var(--bg-elevated)] text-slate-600 hover:text-slate-400"
                          }`}
                        >
                          <svg className="w-4 h-4" fill={isUpvoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                          </svg>
                        </button>
                        <span className={`text-xs font-bold ${isUpvoted ? accent.text : "text-slate-500"}`}>
                          {thread.upvotes}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${thread.gradient} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ring-2 ring-black/10 shadow-sm`}>
                        {thread.initials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {thread.isPinned && (
                            <span className="flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.75 2.567a.75.75 0 00-1.5 0v2.083a.75.75 0 001.5 0V2.567zM10 5.75a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zM3.753 5.202a.75.75 0 00-1.06 1.06l1.473 1.474a.75.75 0 001.06-1.06L3.753 5.202zM2.567 10.75a.75.75 0 000-1.5H.484a.75.75 0 000 1.5h2.083zM5.226 14.798a.75.75 0 10-1.06-1.06l-1.474 1.473a.75.75 0 101.06 1.06l1.474-1.473zM10 15.75a.75.75 0 01.75.75v2.083a.75.75 0 01-1.5 0V16.5a.75.75 0 01.75-.75zM16.247 14.798a.75.75 0 010-1.06l1.474-1.474a.75.75 0 011.06 1.06l-1.473 1.474a.75.75 0 01-1.06 0zM17.433 10.75a.75.75 0 000-1.5h2.084a.75.75 0 000 1.5h-2.084zM14.774 5.202a.75.75 0 001.06-1.06l1.474-1.474a.75.75 0 00-1.06-1.06l-1.474 1.473a.75.75 0 000 1.06z" />
                              </svg>
                            </span>
                          )}
                          <h4 className={`font-semibold transition-colors leading-snug ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-100 group-hover:text-white"}`}>
                            {thread.title}
                          </h4>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{thread.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                          <span className={`text-xs font-medium ${isLight ? "text-slate-700" : "text-slate-400"}`}>{thread.author}</span>
                          <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isLight ? catClasses.bg.replace("/10", "/20") : catClasses.bg} ${catClasses.text}`}>
                            {thread.category}
                          </span>
                          <span className={isLight ? "text-slate-300" : "text-slate-700"}>·</span>
                          <span className="text-xs text-slate-500">{thread.time}</span>
                          {thread.tags.map((tag) => (
                            <span
                              key={tag.key}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getTagStyle(tag.key, isLight)}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                          </svg>
                          <span className="text-sm font-medium">{thread.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-xs">{thread.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            <div className={`px-5 py-4 border-t ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800"
                  : "bg-[var(--bg-elevated)]/50 hover:bg-[var(--bg-elevated)] text-slate-400 hover:text-slate-200"
              }`}>
                Load More Discussions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ─── Right Sidebar ─── */}
        <div className="w-72 flex-shrink-0 space-y-5 hidden lg:block">
          {/* Forum Stats */}
          <div className={`rounded-2xl overflow-hidden ${cardClass}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>Forum Stats</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { value: "4,335", label: "Discussions", color: "emerald" },
                { value: "28.1K", label: "Replies", color: "sky" },
                { value: "12.5K", label: "Members", color: "violet" },
                { value: "89%", label: "Solved Rate", color: "amber" },
              ].map((stat) => {
                const sc = getColorClasses(stat.color);
                return (
                  <div key={stat.label} className={`text-center p-3 rounded-xl ${isLight ? "bg-slate-50" : "bg-[var(--bg-elevated)]/30"}`}>
                    <div className={`text-lg font-bold ${sc.text}`}>{stat.value}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Contributors */}
          <div className={`rounded-2xl overflow-hidden ${cardClass}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>Top Contributors</span>
            </div>
            <div className="p-4 space-y-3">
              {contributors.map((c, index) => (
                <div key={c.name} className="flex items-center gap-3 group cursor-pointer">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-black/10 shadow-sm group-hover:scale-105 transition-transform`}>
                      {c.initials}
                    </div>
                    {index < 3 && (
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        index === 0 ? "bg-amber-500 text-amber-950" : index === 1 ? "bg-slate-400 text-slate-900" : "bg-amber-700 text-amber-100"
                      }`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium transition-colors truncate ${isLight ? "text-slate-800 group-hover:text-slate-900" : "text-slate-200 group-hover:text-white"}`}>{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.helpful}</div>
                  </div>
                  {c.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getBadgeStyle(c.badge, isLight)}`}>
                      {c.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className={`rounded-2xl overflow-hidden ${cardClass}`}>
            <div className={`px-4 py-3 border-b flex items-center gap-2 ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent.bg} ${accent.text} ring-1 ${accent.ring}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>Trending Tags</span>
            </div>
            <div className="p-4 flex flex-wrap gap-2">
              {trendingTags.map((tag, i) => {
                const colors = [
                  "text-emerald-500", "text-sky-500", "text-violet-500", "text-amber-500",
                  "text-rose-500", "text-cyan-500", "text-indigo-500", "text-pink-500",
                ];
                return (
                  <span
                    key={tag}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border border-transparent ${
                      isLight
                        ? "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 hover:border-slate-300"
                        : "bg-[var(--bg-elevated)]/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600"
                    }`}
                  >
                    <span className={colors[i % colors.length]}>#</span>{tag}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Thread Detail Modal ─── */}
      {selectedThread && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setSelectedThread(null)} />
          <div className={`${modalCardClass} max-h-[85vh] flex flex-col`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-start justify-between gap-4 ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {selectedThread.isPinned && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"}`}>
                      Pinned
                    </span>
                  )}
                  {(() => {
                    const catColor = getCatColor(selectedThread.category);
                    const catClasses = getColorClasses(catColor);
                    return (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${isLight ? catClasses.bg.replace("/10", "/20") : catClasses.bg} ${catClasses.text}`}>
                        {selectedThread.category}
                      </span>
                    );
                  })()}
                  {selectedThread.tags.map((tag) => (
                    <span key={tag.key} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${getTagStyle(tag.key, isLight)}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{selectedThread.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${selectedThread.gradient} flex items-center justify-center text-white text-[10px] font-semibold ring-1 ring-black/10`}>
                    {selectedThread.initials}
                  </div>
                  <span className={`text-sm font-medium ${isLight ? "text-slate-700" : "text-slate-300"}`}>{selectedThread.author}</span>
                  <span className="text-xs text-slate-500">{selectedThread.time}</span>
                  <span className="text-xs text-slate-500">{selectedThread.views} views</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Thread content */}
              <div className={`px-6 py-5 border-b ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
                <div className={`text-sm leading-relaxed whitespace-pre-line ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  {selectedThread.content}
                </div>
              </div>

              {/* Replies */}
              <div className={`px-6 py-4 border-b ${isLight ? "border-slate-100" : "border-[var(--border-secondary)]"}`}>
                <span className={`text-sm font-semibold ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                  {selectedThread.replies.length} {selectedThread.replies.length === 1 ? "Reply" : "Replies"}
                </span>
              </div>

              <div className={`divide-y ${isLight ? "divide-slate-100" : "divide-[var(--border-secondary)]"}`}>
                {selectedThread.replies.map((reply) => (
                  <div key={reply.id} className="px-6 py-4">
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${reply.gradient} flex items-center justify-center text-white text-[10px] font-semibold ring-1 ring-black/10 flex-shrink-0`}>
                        {reply.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-sm font-medium ${isLight ? "text-slate-800" : "text-slate-200"}`}>{reply.author}</span>
                          {reply.badge && (
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getBadgeStyle(reply.badge, isLight)}`}>
                              {reply.badge}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">{reply.time}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isLight ? "text-slate-600" : "text-slate-400"}`}>{reply.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className={`flex items-center gap-1 text-xs transition-colors ${isLight ? "text-slate-400 hover:text-rose-500" : "text-slate-600 hover:text-rose-400"}`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            <span className="font-medium">{reply.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply input */}
            <div className={`px-6 py-4 border-t ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-secondary)] bg-[var(--bg-secondary)]"}`}>
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className={textareaClass}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handlePostReply}
                  disabled={replyLoading || !replyText.trim()}
                  className={`h-9 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover} text-white ${accent.buttonShadow} shadow-lg`}
                >
                  {replyLoading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  )}
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── New Thread Modal ─── */}
      {showNewThread && (
        <div className={modalOverlayClass}>
          <div className={modalBackdropClass} onClick={() => setShowNewThread(false)} />
          <div className={modalCardClass}>
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${isLight ? "border-slate-200" : "border-[var(--border-secondary)]"}`}>
              <h2 className={`text-lg font-bold ${isLight ? "text-slate-800" : "text-slate-100"}`}>Create New Thread</h2>
              <button
                onClick={() => setShowNewThread(false)}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-slate-100 text-slate-500" : "hover:bg-[var(--bg-elevated)] text-slate-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's your question or topic?"
                  className={inputClass}
                />
              </div>

              {/* Category */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Category <span className="text-rose-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_NAMES.map((cat) => {
                    const catColor = getCatColor(cat);
                    const cc = getColorClasses(catColor);
                    const isSelected = newCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? `${cc.bg} ${cc.text} border-current`
                            : isLight
                              ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                              : "bg-[var(--bg-elevated)]/50 text-slate-500 border-[var(--border-primary)] hover:text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Content <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your question, idea, or topic in detail..."
                  className={textareaClass}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                  Tags <span className="text-xs text-slate-500 font-normal">(comma separated)</span>
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. help, performance, bug"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${isLight ? "border-slate-200 bg-slate-50" : "border-[var(--border-secondary)] bg-[var(--bg-secondary)]"}`}>
              <button
                onClick={() => setShowNewThread(false)}
                className={`h-9 px-4 rounded-xl text-sm font-medium transition-all ${
                  isLight ? "text-slate-600 hover:bg-slate-200" : "text-slate-400 hover:bg-[var(--bg-elevated)]"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handlePostThread}
                disabled={newThreadLoading || !newTitle.trim() || !newCategory || !newContent.trim()}
                className={`h-9 px-5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${accent.button} ${accent.buttonHover} text-white ${accent.buttonShadow} shadow-lg`}
              >
                {newThreadLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
                Post Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
