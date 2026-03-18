"use client";

import { useState, useMemo } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

const dnsRecords = [
  { type: "A", name: "@", content: "185.199.108.153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { type: "CNAME", name: "www", content: "limewp.com", ttl: "3600", proxy: true, modified: "1 day ago" },
  { type: "MX", name: "@", content: "mail.limewp.com", ttl: "3600", proxy: false, modified: "3 days ago", priority: 10 },
  { type: "TXT", name: "@", content: "v=spf1 include:_spf.google.com ~all", ttl: "3600", proxy: false, modified: "1 week ago" },
  { type: "AAAA", name: "@", content: "2606:50c0:8000::153", ttl: "3600", proxy: true, modified: "2 hours ago" },
  { type: "A", name: "api", content: "185.199.109.153", ttl: "3600", proxy: true, modified: "5 days ago" },
  { type: "CNAME", name: "mail", content: "ghs.google.com", ttl: "3600", proxy: false, modified: "2 weeks ago" },
  { type: "TXT", name: "_dmarc", content: "v=DMARC1; p=quarantine; rua=mailto:dmarc@limewp.com", ttl: "3600", proxy: false, modified: "1 week ago" },
  { type: "NS", name: "@", content: "ns1.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
  { type: "NS", name: "@", content: "ns2.limewp.com", ttl: "86400", proxy: false, modified: "1 month ago" },
];

const recordTypes = ["A", "CNAME", "MX", "TXT", "AAAA", "NS"];

const domains = [
  { name: "limewp.com", records: 10, status: "Active", ssl: "Active", nameservers: "LimeWP" },
  { name: "supernova.guru", records: 4, status: "Active", ssl: "Pending", nameservers: "LimeWP" },
];

const propagationServers = [
  { location: "US East", flag: "🇺🇸", status: "propagated", latency: "12ms" },
  { location: "US West", flag: "🇺🇸", status: "propagated", latency: "18ms" },
  { location: "Europe", flag: "🇪🇺", status: "propagated", latency: "45ms" },
  { location: "Asia", flag: "🇯🇵", status: "propagated", latency: "89ms" },
];

export default function DnsManagementPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [selectedDomain, setSelectedDomain] = useState("limewp.com");
  const [searchFilter, setSearchFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    let filtered = dnsRecords;
    if (typeFilter !== "All") {
      filtered = filtered.filter((r) => r.type === typeFilter);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [searchFilter, typeFilter]);

  const selectedDomainData = domains.find((d) => d.name === selectedDomain);

  const recordTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dnsRecords.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const cardBase = isLight
    ? "bg-white border border-zinc-200"
    : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E]";

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>DNS Management</h1>
          <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Configure DNS records for your domains</p>
        </div>
        <div className="flex items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button
                className={`font-medium text-sm transition-all gap-1.5 rounded-xl h-10 px-4 ${
                  isLight
                    ? "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    : "bg-[#27272A] text-zinc-300 hover:bg-[#3F3F46]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
                Actions
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="DNS Actions"
              classNames={{
                base: `rounded-xl min-w-[180px] ${isLight ? "bg-white border border-zinc-200" : "bg-[#1E1E21] border border-[#2A2A2E]"}`,
              }}
            >
              <DropdownItem key="import" className={`py-2.5 ${isLight ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-300 hover:bg-[#27272A]"}`}
                startContent={<svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}
              >Import Zone</DropdownItem>
              <DropdownItem key="export" className={`py-2.5 ${isLight ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-300 hover:bg-[#27272A]"}`}
                startContent={<svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
              >Export Zone</DropdownItem>
              <DropdownItem key="flush" className={`py-2.5 ${isLight ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-300 hover:bg-[#27272A]"}`}
                startContent={<svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>}
              >Flush Cache</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button className={`font-semibold text-sm gap-2 rounded-xl h-10 px-5 ${
            isLight
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          }`}
            startContent={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
          >Add Record</Button>
        </div>
      </div>

      {/* Domain Selector + Stats Grid */}
      <div className="grid grid-cols-12 gap-4 mb-6">
        {/* Domain Card */}
        <div className={`col-span-8 rounded-2xl p-5 ${cardBase}`}>
          <div className="flex items-center justify-between mb-5">
            <Dropdown>
              <DropdownTrigger>
                <button className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-colors ${
                  isLight ? "bg-zinc-50 hover:bg-zinc-100" : "bg-zinc-900/50 hover:bg-zinc-800/80"
                }`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-zinc-200" : "bg-zinc-700"
                  }`}>
                    <svg className={`w-4 h-4 ${isLight ? "text-zinc-600" : "text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className={`text-[10px] uppercase tracking-wider font-medium ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>Domain</div>
                    <div className={`font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{selectedDomain}</div>
                  </div>
                  <svg className={`w-4 h-4 ml-2 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select domain"
                selectionMode="single"
                selectedKeys={new Set([selectedDomain])}
                onSelectionChange={(keys) => setSelectedDomain(Array.from(keys)[0] as string)}
                classNames={{ base: `rounded-xl ${isLight ? "bg-white border border-zinc-200" : "bg-[#1E1E21] border border-[#2A2A2E]"}` }}
              >
                {domains.map((d) => (
                  <DropdownItem key={d.name} className={`py-2.5 ${isLight ? "text-zinc-700 hover:bg-zinc-100" : "text-zinc-300 hover:bg-[#27272A]"}`}>
                    <div className="flex items-center justify-between w-full">
                      <span>{d.name}</span>
                      <span className="text-xs text-zinc-500">{d.records} records</span>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${
                isLight ? "bg-zinc-100" : "bg-zinc-800"
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
                </span>
                <span className={`text-[11px] font-semibold ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Propagated</span>
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Records", value: selectedDomainData?.records || 0, icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" },
              { label: "Nameservers", value: selectedDomainData?.nameservers || "-", icon: "M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" },
              { label: "SSL Status", value: selectedDomainData?.ssl || "-", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
              { label: "DNSSEC", value: "Enabled", icon: "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" },
            ].map((stat) => (
              <div key={stat.label} className={`p-4 rounded-xl ${isLight ? "bg-zinc-50" : "bg-zinc-900/50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isLight ? "bg-zinc-200" : "bg-zinc-800"
                  }`}>
                    <svg className={`w-4 h-4 ${isLight ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider font-medium ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{stat.label}</div>
                    <div className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Propagation Card */}
        <div className={`col-span-4 rounded-2xl p-5 ${cardBase}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Global Propagation</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              isLight ? "text-zinc-600 bg-zinc-100" : "text-zinc-300 bg-zinc-800"
            }`}>100%</span>
          </div>

          {/* Progress Bar */}
          <div className={`h-2 rounded-full mb-4 overflow-hidden ${isLight ? "bg-zinc-200" : "bg-zinc-800"}`}>
            <div className={`h-full w-full rounded-full ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`} />
          </div>

          <div className="space-y-2.5">
            {propagationServers.map((server, idx) => (
              <div key={idx} className={`flex items-center justify-between p-2.5 rounded-lg ${
                isLight ? "bg-zinc-50" : "bg-zinc-900/50"
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{server.flag}</span>
                  <span className={`text-sm font-medium ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>{server.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{server.latency}</span>
                  <span className={`w-2 h-2 rounded-full ${isLight ? "bg-zinc-400" : "bg-zinc-500"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Record Type Pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setTypeFilter("All")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            typeFilter === "All"
              ? isLight
                ? "bg-zinc-900 text-white"
                : "bg-white text-zinc-900"
              : isLight
                ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          All Records
          <span className={`ml-2 text-xs ${typeFilter === "All" ? "opacity-70" : "opacity-50"}`}>{dnsRecords.length}</span>
        </button>
        {recordTypes.map((type) => {
          const count = recordTypeCounts[type] || 0;
          const isActive = typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter(type === typeFilter ? "All" : type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                isActive
                  ? isLight
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-900"
                  : isLight
                    ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              <span className="font-mono font-bold">{type}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                isActive
                  ? isLight ? "bg-zinc-700 text-zinc-200" : "bg-zinc-200 text-zinc-700"
                  : isLight ? "bg-zinc-200 text-zinc-500" : "bg-zinc-700 text-zinc-400"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className={`rounded-2xl p-4 mb-4 ${cardBase}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-zinc-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, content, or type..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                  isLight
                    ? "bg-zinc-100 text-zinc-800 placeholder:text-zinc-400 focus:bg-zinc-50 focus:ring-2 focus:ring-zinc-300"
                    : "bg-zinc-900/50 text-zinc-200 placeholder:text-zinc-500 focus:bg-zinc-900 focus:ring-2 focus:ring-zinc-600"
                }`}
              />
            </div>
            {typeFilter !== "All" && (
              <button
                onClick={() => setTypeFilter("All")}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isLight ? "bg-zinc-200 text-zinc-700" : "bg-zinc-700 text-zinc-300"
                }`}
              >
                {typeFilter}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{filteredRecords.length} records</span>
            <button className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLight ? "text-zinc-600 hover:text-zinc-800" : "text-zinc-400 hover:text-zinc-200"
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* DNS Records List */}
      <div className={`rounded-2xl overflow-hidden ${cardBase}`}>
        {/* Table Header */}
        <div className={`grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider ${
          isLight ? "bg-zinc-50 text-zinc-500 border-b border-zinc-200" : "bg-zinc-900/80 text-zinc-500 border-b border-zinc-800"
        }`}>
          <div className="col-span-1">Type</div>
          <div className="col-span-2">Name</div>
          <div className="col-span-4">Content</div>
          <div className="col-span-1">TTL</div>
          <div className="col-span-1">Proxy</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {filteredRecords.length === 0 ? (
            <div className={`px-5 py-12 text-center ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <p className="font-medium">No records found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredRecords.map((record, index) => {
              const recordId = `${record.type}-${record.name}-${index}`;
              return (
                <div
                  key={index}
                  className={`grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors ${
                    isLight ? "hover:bg-zinc-50" : "hover:bg-zinc-800/30"
                  }`}
                >
                  <div className="col-span-1">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                      isLight ? "bg-zinc-100 text-zinc-700" : "bg-zinc-800 text-zinc-300"
                    }`}>
                      {record.type}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={`font-medium ${isLight ? "text-zinc-800" : "text-zinc-200"}`}>{record.name}</span>
                  </div>
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm truncate ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{record.content}</span>
                      <button
                        onClick={() => copyToClipboard(record.content, recordId)}
                        className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ${
                          copiedRecord === recordId
                            ? isLight ? "bg-zinc-200 text-zinc-700" : "bg-zinc-700 text-zinc-200"
                            : isLight
                              ? "hover:bg-zinc-200 text-zinc-400"
                              : "hover:bg-zinc-700 text-zinc-500"
                        }`}
                        style={{ opacity: 1 }}
                      >
                        {copiedRecord === recordId ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>
                      {parseInt(record.ttl) >= 3600 ? `${parseInt(record.ttl) / 3600}h` : `${record.ttl}s`}
                    </span>
                  </div>
                  <div className="col-span-1">
                    {record.proxy ? (
                      <span className={`flex items-center gap-1.5 ${isLight ? "text-zinc-700" : "text-zinc-300"}`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                        </svg>
                        <span className="text-xs font-medium">On</span>
                      </span>
                    ) : (
                      <span className={`flex items-center gap-1.5 ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                        </svg>
                        <span className="text-xs font-medium">Off</span>
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>{record.modified}</span>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button className={`p-2 rounded-lg transition-all ${
                      isLight ? "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </button>
                    <button className={`p-2 rounded-lg transition-all ${
                      isLight ? "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Help */}
      <div className={`mt-6 rounded-2xl p-5 ${cardBase}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isLight ? "bg-zinc-100" : "bg-zinc-800"
            }`}>
              <svg className={`w-5 h-5 ${isLight ? "text-zinc-500" : "text-zinc-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-sm font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Need help with DNS configuration?</h3>
              <p className={`text-sm ${isLight ? "text-zinc-500" : "text-zinc-500"}`}>Check our documentation for common setups and troubleshooting guides.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isLight ? "text-zinc-600 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800"
            }`}>View Docs</button>
            <button className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-800" : "bg-zinc-800 hover:bg-zinc-700 text-white"
            }`}>
              Contact Support
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
