"use client";

import { useState } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";

type NavItem = {
  name: string;
  method: string | null;
  icon?: string;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Getting Started",
    items: [
      { name: "Overview", method: null, icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" },
      { name: "Authentication", method: null, icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" },
      { name: "Rate Limits", method: null, icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
      { name: "Errors", method: null, icon: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" },
    ],
  },
  {
    label: "Sites",
    items: [
      { name: "List Sites", method: "GET" },
      { name: "Get Site", method: "GET" },
      { name: "Create Site", method: "POST" },
      { name: "Update Site", method: "PUT" },
      { name: "Delete Site", method: "DEL" },
    ],
  },
  {
    label: "Backups",
    items: [
      { name: "List Backups", method: "GET" },
      { name: "Create Backup", method: "POST" },
      { name: "Restore Backup", method: "POST" },
    ],
  },
  {
    label: "Domains",
    items: [
      { name: "List Domains", method: "GET" },
      { name: "Add Domain", method: "POST" },
      { name: "Remove Domain", method: "DEL" },
    ],
  },
];

function getMethodStyles() {
  return { bg: "bg-zinc-500/15", text: "text-zinc-400", border: "border-zinc-500/20" };
}

const codeTabs = ["cURL", "JavaScript", "Python", "PHP"] as const;

export default function ApiReferencePage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [activeSection, setActiveSection] = useState("Overview");
  const [activeCodeTab, setActiveCodeTab] = useState<string>("cURL");

  return (
    <AppShell>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <div>
            <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>API Reference</h1>
            <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Build integrations with the LimeWP REST API</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className={`rounded-2xl border overflow-hidden ${isLight ? "bg-white border-zinc-200" : "bg-[#18181B] border-[#27272A]"}`}>
        <div className="flex">
          {/* Left Sidebar */}
          <div className={`w-64 border-r ${isLight ? "border-zinc-200 bg-zinc-50" : "border-[#27272A] bg-[#1a1a1d]"}`}>
            <div className="p-4">
              {/* Search */}
              <div className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search endpoints..."
                  className={`w-full h-9 pl-9 pr-3 rounded-lg text-sm focus:outline-none focus:border-zinc-500/50 transition-colors ${
                    isLight
                      ? "bg-white border border-zinc-200 text-zinc-800 placeholder:text-zinc-400"
                      : "bg-[#27272A]/50 border border-[#3F3F46]/50 text-zinc-300 placeholder:text-zinc-600"
                  }`}
                />
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navSections.map((section) => (
                  <div key={section.label} className="mb-4">
                    <div className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-2 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>
                      {section.label}
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item) => {
                        const isActive = activeSection === item.name;
                        const methodStyles = item.method ? getMethodStyles() : null;

                        return (
                          <button
                            key={item.name}
                            onClick={() => setActiveSection(item.name)}
                            className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[13px] font-medium transition-all ${
                              isActive
                                ? isLight
                                  ? "bg-zinc-200 text-zinc-700"
                                  : "bg-zinc-700 text-zinc-200"
                                : isLight
                                  ? "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                                  : "text-zinc-400 hover:bg-[#27272A]/70 hover:text-zinc-300"
                            }`}
                          >
                            {item.icon && (
                              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                              </svg>
                            )}
                            <span className="flex-1 text-left truncate">{item.name}</span>
                            {item.method && (
                              <span className={`${methodStyles?.bg} ${methodStyles?.text} text-[9px] font-mono font-bold px-1.5 py-0.5 rounded`}>
                                {item.method}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* API Overview Section */}
            <div className={`border-b ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
                    </svg>
                  </div>
                  <h2 className={`text-lg font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>API Overview</h2>
                </div>
                <p className={`text-sm mb-5 leading-relaxed ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                  The LimeWP REST API allows you to manage your WordPress sites, domains, backups, and more programmatically. All API requests require authentication via API key.
                </p>

                {/* Base URL */}
                <div className={`rounded-xl p-4 flex items-center justify-between border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider font-medium mb-1 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>Base URL</div>
                    <code className={`font-mono text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>
                      https://api.limewp.com/v1
                    </code>
                  </div>
                  <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-700" : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-500 hover:text-zinc-300"}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Authentication Section */}
            <div className={`border-b ${isLight ? "border-zinc-200" : "border-[#27272A]"}`}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <h2 className={`text-lg font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Authentication</h2>
                </div>

                {/* Warning */}
                <div className={`rounded-xl p-4 mb-5 flex items-start gap-3 border ${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-800/50 border-zinc-700"}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                    Keep your API key secure and never expose it in client-side code or public repositories.
                  </p>
                </div>

                {/* API Key */}
                <div className={`rounded-xl p-4 flex items-center justify-between border ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider font-medium mb-1 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>Your API Key</div>
                    <code className={`font-mono text-sm ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                      lwp_sk_••••••••••••••••••••••••
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800" : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-zinc-300"}`}>
                      Reveal
                    </button>
                    <button className={`h-8 px-3 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-800" : "bg-[#27272A] hover:bg-[#3F3F46] text-zinc-400 hover:text-zinc-300"}`}>
                      Regenerate
                    </button>
                  </div>
                </div>

                {/* Header Example */}
                <div className="mt-4">
                  <div className={`text-[11px] uppercase tracking-wider font-medium mb-2 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>Request Header</div>
                  <div className={`rounded-xl p-4 border overflow-x-auto ${isLight ? "bg-zinc-900" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                    <pre className="text-sm font-mono">
                      <span className="text-zinc-500">Authorization:</span>{" "}
                      <span className="text-zinc-300">Bearer lwp_sk_your_api_key</span>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Endpoints Section */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h2 className={`text-lg font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Endpoints</h2>
              </div>

              {/* Endpoint: List Sites */}
              <div className={`rounded-xl border overflow-hidden mb-4 ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#1a1a1d] border-[#27272A]"}`}>
                <div className={`px-5 py-4 border-b flex items-center gap-3 ${isLight ? "bg-zinc-100 border-zinc-200" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                  <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${isLight ? "bg-zinc-200 text-zinc-600 border border-zinc-300" : "bg-zinc-700 text-zinc-300 border border-zinc-600"}`}>
                    GET
                  </span>
                  <code className={`font-mono text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>/sites</code>
                  <span className={`text-sm ml-2 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>List all sites in your account</span>
                </div>
                <div className="p-5">
                  {/* Parameters */}
                  <div className="mb-5">
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Query Parameters</h4>
                    <div className="space-y-2">
                      {[
                        { name: "page", type: "integer", desc: "Page number for pagination" },
                        { name: "limit", type: "integer", desc: "Number of items per page (max 100)" },
                        { name: "status", type: "string", desc: "Filter by site status: active, suspended" },
                      ].map((param) => (
                        <div key={param.name} className={`flex items-start gap-4 py-2 border-b last:border-0 ${isLight ? "border-zinc-200/50" : "border-[#27272A]/50"}`}>
                          <code className={`font-mono text-sm w-20 flex-shrink-0 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{param.name}</code>
                          <span className={`text-xs w-16 flex-shrink-0 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>{param.type}</span>
                          <span className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{param.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Examples */}
                  <div className="mb-5">
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Example Request</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {codeTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveCodeTab(tab)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            activeCodeTab === tab
                              ? isLight
                                ? "bg-zinc-200 text-zinc-700"
                                : "bg-zinc-700 text-zinc-200"
                              : isLight
                                ? "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                                : "text-zinc-500 hover:text-zinc-400 hover:bg-[#27272A]/50"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <div className={`rounded-xl p-4 border overflow-x-auto ${isLight ? "bg-zinc-900 border-zinc-800" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                      <pre className="text-sm font-mono">
                        <span className="text-zinc-500">curl</span>{" "}
                        <span className="text-zinc-400">-X GET</span>{" "}
                        <span className="text-zinc-300">&quot;https://api.limewp.com/v1/sites&quot;</span>{" "}
                        <span className="text-zinc-600">\</span>{"\n"}
                        {"  "}<span className="text-zinc-400">-H</span>{" "}
                        <span className="text-zinc-300">&quot;Authorization: Bearer lwp_sk_your_api_key&quot;</span>
                      </pre>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className={`text-[11px] uppercase tracking-wider font-semibold ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Response</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isLight ? "bg-zinc-200 text-zinc-600" : "bg-zinc-700 text-zinc-300"}`}>200 OK</span>
                    </div>
                    <div className={`rounded-xl p-4 border overflow-x-auto ${isLight ? "bg-zinc-900 border-zinc-800" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                      <pre className="text-sm font-mono text-zinc-400">
{`{
  "data": [
    {
      "id": "site_abc123",
      "name": "limewp.com",
      "status": "active",
      "php_version": "8.2",
      "wp_version": "6.6.2",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 20
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint: Create Site */}
              <div className={`rounded-xl border overflow-hidden mb-4 ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#1a1a1d] border-[#27272A]"}`}>
                <div className={`px-5 py-4 border-b flex items-center gap-3 ${isLight ? "bg-zinc-100 border-zinc-200" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                  <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${isLight ? "bg-zinc-200 text-zinc-600 border border-zinc-300" : "bg-zinc-700 text-zinc-300 border border-zinc-600"}`}>
                    POST
                  </span>
                  <code className={`font-mono text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>/sites</code>
                  <span className={`text-sm ml-2 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Create a new WordPress site</span>
                </div>
                <div className="p-5">
                  {/* Request Body */}
                  <div className="mb-5">
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Request Body</h4>
                    <div className="space-y-2">
                      {[
                        { name: "name", type: "string", desc: "Site name", required: true },
                        { name: "php_version", type: "string", desc: "PHP version (8.1, 8.2, 8.3)", required: false },
                        { name: "wp_version", type: "string", desc: "WordPress version", required: false },
                        { name: "admin_email", type: "string", desc: "Administrator email address", required: true },
                      ].map((param) => (
                        <div key={param.name} className={`flex items-start gap-4 py-2 border-b last:border-0 ${isLight ? "border-zinc-200/50" : "border-[#27272A]/50"}`}>
                          <div className="w-24 flex-shrink-0 flex items-center gap-1">
                            <code className={`font-mono text-sm ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{param.name}</code>
                            {param.required && <span className="text-zinc-500 text-xs">*</span>}
                          </div>
                          <span className={`text-xs w-16 flex-shrink-0 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>{param.type}</span>
                          <span className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{param.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Example */}
                  <div>
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Example Request</h4>
                    <div className={`rounded-xl p-4 border overflow-x-auto ${isLight ? "bg-zinc-900 border-zinc-800" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                      <pre className="text-sm font-mono">
                        <span className="text-zinc-500">curl</span>{" "}
                        <span className="text-zinc-400">-X POST</span>{" "}
                        <span className="text-zinc-300">&quot;https://api.limewp.com/v1/sites&quot;</span>{" "}
                        <span className="text-zinc-600">\</span>{"\n"}
                        {"  "}<span className="text-zinc-400">-H</span>{" "}
                        <span className="text-zinc-300">&quot;Authorization: Bearer lwp_sk_your_api_key&quot;</span>{" "}
                        <span className="text-zinc-600">\</span>{"\n"}
                        {"  "}<span className="text-zinc-400">-H</span>{" "}
                        <span className="text-zinc-300">&quot;Content-Type: application/json&quot;</span>{" "}
                        <span className="text-zinc-600">\</span>{"\n"}
                        {"  "}<span className="text-zinc-400">-d</span>{" "}
                        <span className="text-zinc-300">{`'{
    "name": "my-new-site",
    "php_version": "8.2",
    "admin_email": "admin@example.com"
  }'`}</span>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endpoint: Delete Site */}
              <div className={`rounded-xl border overflow-hidden ${isLight ? "bg-zinc-50 border-zinc-200" : "bg-[#1a1a1d] border-[#27272A]"}`}>
                <div className={`px-5 py-4 border-b flex items-center gap-3 ${isLight ? "bg-zinc-100 border-zinc-200" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                  <span className={`font-mono text-[10px] font-bold px-2 py-1 rounded ${isLight ? "bg-zinc-200 text-zinc-600 border border-zinc-300" : "bg-zinc-700 text-zinc-300 border border-zinc-600"}`}>
                    DELETE
                  </span>
                  <code className={`font-mono text-sm font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>/sites/{"{site_id}"}</code>
                  <span className={`text-sm ml-2 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Delete a site permanently</span>
                </div>
                <div className="p-5">
                  {/* Path Parameters */}
                  <div className="mb-5">
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Path Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-4 py-2">
                        <div className="w-24 flex-shrink-0 flex items-center gap-1">
                          <code className={`font-mono text-sm ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>site_id</code>
                          <span className="text-zinc-500 text-xs">*</span>
                        </div>
                        <span className={`text-xs w-16 flex-shrink-0 ${isLight ? "text-zinc-500" : "text-zinc-600"}`}>string</span>
                        <span className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Unique site identifier</span>
                      </div>
                    </div>
                  </div>

                  {/* Warning */}
                  <div className={`rounded-xl p-4 mb-5 flex items-start gap-3 border ${isLight ? "bg-zinc-100 border-zinc-200" : "bg-zinc-800/50 border-zinc-700"}`}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>
                      This action is irreversible. All site data, files, and backups will be permanently deleted.
                    </p>
                  </div>

                  {/* Code Example */}
                  <div>
                    <h4 className={`text-[11px] uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Example Request</h4>
                    <div className={`rounded-xl p-4 border overflow-x-auto ${isLight ? "bg-zinc-900 border-zinc-800" : "bg-[#0d0d0f] border-[#27272A]"}`}>
                      <pre className="text-sm font-mono">
                        <span className="text-zinc-500">curl</span>{" "}
                        <span className="text-zinc-400">-X DELETE</span>{" "}
                        <span className="text-zinc-300">&quot;https://api.limewp.com/v1/sites/site_abc123&quot;</span>{" "}
                        <span className="text-zinc-600">\</span>{"\n"}
                        {"  "}<span className="text-zinc-400">-H</span>{" "}
                        <span className="text-zinc-300">&quot;Authorization: Bearer lwp_sk_your_api_key&quot;</span>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
