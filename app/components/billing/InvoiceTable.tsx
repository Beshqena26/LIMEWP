"use client";

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";
import { SectionHeader } from "../ui/SectionHeader";
import { useTheme } from "@/lib/context/ThemeContext";
import type { Invoice } from "@/data/billing";
import { INVOICE_STATUS_STYLES } from "@/data/billing";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewInvoice?: (invoice: Invoice) => void;
  onDownloadInvoice?: (invoice: Invoice) => void;
}

export function InvoiceTable({ invoices, onViewInvoice, onDownloadInvoice }: InvoiceTableProps) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <div>
      <SectionHeader
        title="Invoice History"
        icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        iconColor="zinc"
      />
      <div className={`rounded-2xl border overflow-hidden ${
        isLight ? "border-zinc-200" : "border-[#2A2A2E]"
      }`}>
        <Table
          aria-label="Invoice history"
          removeWrapper
          classNames={{
            table: isLight ? "bg-white" : "bg-[#1E1E21]",
            th: `text-xs font-semibold uppercase tracking-wider py-4 px-5 ${
              isLight ? "bg-zinc-50 text-zinc-500" : "bg-[#18181B] text-zinc-500"
            }`,
            td: "text-sm py-4 px-5",
            tr: `border-b last:border-b-0 transition-colors ${
              isLight ? "hover:bg-zinc-50 border-zinc-100" : "hover:bg-[#27272A]/50 border-[#2A2A2E]"
            }`,
          }}
        >
          <TableHeader>
            <TableColumn>Invoice</TableColumn>
            <TableColumn>Date</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Amount</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const statusStyle = INVOICE_STATUS_STYLES[invoice.status] || INVOICE_STATUS_STYLES.Paid;
              return (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <span className={`font-mono font-medium ${isLight ? "text-zinc-700" : "text-zinc-200"}`}>{invoice.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className={isLight ? "text-zinc-500" : "text-zinc-400"}>{invoice.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className={isLight ? "text-zinc-600" : "text-zinc-300"}>{invoice.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${isLight ? "text-zinc-800" : "text-zinc-100"}`}>{invoice.amount}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      classNames={{
                        base: `${statusStyle.bg} border-0`,
                        content: `${statusStyle.text} font-semibold text-[10px]`
                      }}
                      startContent={<span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />}
                    >
                      {invoice.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewInvoice?.(invoice)}
                        className={`text-xs font-medium transition-colors ${
                          isLight ? "text-zinc-500 hover:text-zinc-700" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        View
                      </button>
                      <span className={isLight ? "text-zinc-300" : "text-zinc-600"}>•</span>
                      <button
                        onClick={() => onDownloadInvoice?.(invoice)}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
