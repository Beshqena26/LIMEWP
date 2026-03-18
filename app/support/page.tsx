"use client";

import { useState, useMemo } from "react";
import AppShell from "../components/AppShell";
import { useTheme } from "@/lib/context/ThemeContext";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Chip,
  Pagination,
} from "@heroui/react";

const tickets = [
  { id: "#1234", subject: "SSL certificate not working", status: "Resolved", priority: "High", updated: "2 days ago" },
  { id: "#1233", subject: "Need help with DNS setup", status: "Resolved", priority: "Medium", updated: "1 week ago" },
  { id: "#1230", subject: "Migration assistance request", status: "Resolved", priority: "Low", updated: "2 weeks ago" },
];

export default function SupportPage() {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [searchFilter, setSearchFilter] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredTickets = useMemo(() => {
    if (!searchFilter) return tickets;
    const lower = searchFilter.toLowerCase();
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(lower) ||
        t.subject.toLowerCase().includes(lower)
    );
  }, [searchFilter]);

  const pages = Math.max(Math.ceil(filteredTickets.length / rowsPerPage), 1);
  const paginatedTickets = filteredTickets.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-2xl font-bold mb-1 ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>
            Support Center
          </h1>
          <p className={`text-sm ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Get help from our team or browse documentation</p>
        </div>
        <button className={`group relative h-10 px-5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] flex items-center gap-2 ${isLight ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Live Chat */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
          isLight
            ? "bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-zinc-200/50"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-zinc-600 hover:shadow-black/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>Live Chat</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Chat with our support team in real-time</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
              </span>
              <span className={`text-sm font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>Online Now</span>
            </div>
            <button className={`w-full mt-5 h-10 rounded-xl text-sm font-semibold transition-all ${isLight ? "bg-zinc-800 text-white hover:bg-zinc-700" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"}`}>
              Start Chat
            </button>
          </div>
        </div>

        {/* Email Support */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
          isLight
            ? "bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-zinc-200/50"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-zinc-600 hover:shadow-black/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>Email Support</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Send us an email and we&apos;ll respond within 24h</p>
            <p className={`text-sm font-medium mt-3 ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>support@limewp.com</p>
            <button className={`w-full mt-5 h-10 rounded-xl text-sm font-semibold transition-all border ${isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300 hover:border-zinc-400" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:border-zinc-600"}`}>
              Send Email
            </button>
          </div>
        </div>

        {/* Documentation */}
        <div className={`group relative rounded-2xl p-6 text-center overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
          isLight
            ? "bg-white border border-zinc-200 hover:border-zinc-400 hover:shadow-zinc-200/50"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-zinc-600 hover:shadow-black/20"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-300 ring-1 ring-zinc-600"}`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className={`font-semibold text-lg transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>Documentation</h3>
            <p className={`text-sm mt-2 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Browse our knowledge base and tutorials</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${isLight ? "bg-zinc-200 text-zinc-600" : "bg-zinc-700 text-zinc-400"}`}>200+ Articles</span>
            </div>
            <button className={`w-full mt-5 h-10 rounded-xl text-sm font-semibold transition-all border ${isLight ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300 hover:border-zinc-400" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:border-zinc-600"}`}>
              Browse Docs
            </button>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className={`relative rounded-2xl overflow-hidden ${
        isLight
          ? "bg-white border border-zinc-200"
          : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E]"
      }`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-zinc-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />

        <div className="relative p-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>Recent Tickets</h2>
                <p className={`text-xs ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Track your support requests</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${
                isLight ? "bg-zinc-100 text-zinc-500" : "bg-zinc-800 text-zinc-400"
              }`}>
                {tickets.length} Total
              </span>
            </div>
          </div>

          {/* Search / Filter Bar */}
          <div className="mb-4">
            <Input
              placeholder="Search tickets..."
              value={searchFilter}
              onValueChange={(val) => {
                setSearchFilter(val);
                setPage(1);
              }}
              classNames={{
                inputWrapper: `!rounded-xl transition-colors ${
                  isLight
                    ? "bg-zinc-100 border border-zinc-200 hover:border-zinc-300"
                    : "bg-[#27272A]/50 border border-[#3F3F46]/50 hover:border-[#52525B]"
                }`,
                input: `placeholder:text-zinc-500 ${isLight ? "text-zinc-700" : "text-zinc-300"}`,
              }}
              startContent={
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* HeroUI Table */}
          <Table
            aria-label="Support Tickets"
            classNames={{
              wrapper: "bg-transparent shadow-none p-0",
              table: "min-w-full",
              th: `text-xs font-semibold uppercase tracking-wider first:rounded-l-xl last:rounded-r-xl ${
                isLight
                  ? "bg-zinc-50 text-zinc-500"
                  : "bg-[#27272A]/50 text-zinc-500"
              }`,
              td: `py-4 ${isLight ? "text-zinc-700" : "text-zinc-300"}`,
              tr: `last:border-0 transition-colors ${
                isLight
                  ? "border-b border-zinc-100 hover:bg-zinc-50"
                  : "border-b border-[#27272A] hover:bg-white/[0.02]"
              }`,
            }}
            bottomContent={
              pages > 1 && (
                <div className="flex justify-center py-4">
                  <Pagination
                    total={pages}
                    page={page}
                    onChange={setPage}
                    classNames={{
                      cursor: isLight ? "bg-zinc-800 text-white" : "bg-zinc-200 text-zinc-900",
                      item: isLight
                        ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        : "bg-[#27272A]/50 text-zinc-400 hover:bg-[#3F3F46]/50",
                    }}
                  />
                </div>
              )
            }
          >
            <TableHeader>
              <TableColumn>Ticket</TableColumn>
              <TableColumn>Subject</TableColumn>
              <TableColumn>Priority</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Last Updated</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody emptyContent={
              <div className="py-8 text-center">
                <div className={`w-12 h-12 rounded-xl text-zinc-500 flex items-center justify-center mx-auto mb-3 ${
                  isLight ? "bg-zinc-100" : "bg-zinc-800"
                }`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-zinc-500 text-sm">No tickets found</p>
              </div>
            }>
              {paginatedTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <span className={`font-mono font-medium text-sm ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>{ticket.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{ticket.subject}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      classNames={{
                        base: "bg-zinc-500/10",
                        content: "text-zinc-400 font-medium text-xs",
                      }}
                    >
                      {ticket.priority}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      classNames={{
                        base: "bg-zinc-500/10",
                        content: "text-zinc-400 font-medium text-xs",
                      }}
                    >
                      {ticket.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {ticket.updated}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isLight ? "text-zinc-600 hover:text-zinc-800" : "text-zinc-400 hover:text-zinc-200"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Quick Help Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQ */}
        <div className={`group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
          isLight
            ? "bg-white border border-zinc-200 hover:border-zinc-400"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-zinc-600"
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>Frequently Asked Questions</h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-zinc-600" : "text-zinc-500"}`}>Find answers to common questions</p>
            </div>
            <svg className={`w-5 h-5 group-hover:translate-x-1 transition-all ${isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* System Status */}
        <div className={`group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
          isLight
            ? "bg-white border border-zinc-200 hover:border-zinc-400"
            : "bg-gradient-to-br from-[#1E1E21] to-[#1a1a1d] border border-[#2A2A2E] hover:border-zinc-600"
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
          <div className="relative flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isLight ? "bg-zinc-200 text-zinc-600 ring-1 ring-zinc-300" : "bg-zinc-700 text-zinc-400 ring-1 ring-zinc-600"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold transition-colors ${isLight ? "text-zinc-800 group-hover:text-zinc-900" : "text-zinc-100 group-hover:text-white"}`}>System Status</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isLight ? "bg-zinc-500" : "bg-zinc-400"}`}></span>
                </span>
                <span className={`text-xs font-medium ${isLight ? "text-zinc-600" : "text-zinc-400"}`}>All systems operational</span>
              </div>
            </div>
            <svg className={`w-5 h-5 group-hover:translate-x-1 transition-all ${isLight ? "text-zinc-400 group-hover:text-zinc-600" : "text-zinc-500 group-hover:text-zinc-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
