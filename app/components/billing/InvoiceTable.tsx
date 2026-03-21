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
        isLight ? "border-slate-200" : "border-[var(--border-tertiary)]"
      }`}>
        <Table
          aria-label="Invoice history"
          removeWrapper
          classNames={{
            table: isLight ? "bg-white" : "bg-[var(--bg-secondary)]",
            th: `text-xs font-semibold uppercase tracking-wider py-4 px-5 ${
              isLight ? "bg-slate-50 text-slate-500" : "bg-[var(--bg-primary)] text-slate-500"
            }`,
            td: "text-sm py-4 px-5",
            tr: `border-b last:border-b-0 transition-colors ${
              isLight ? "hover:bg-slate-50 border-slate-100" : "hover:bg-[var(--bg-elevated)]/50 border-[var(--border-tertiary)]"
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
                    <span className={`font-mono font-medium ${isLight ? "text-slate-700" : "text-slate-200"}`}>{invoice.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className={isLight ? "text-slate-500" : "text-slate-400"}>{invoice.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className={isLight ? "text-slate-600" : "text-slate-300"}>{invoice.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-semibold ${isLight ? "text-slate-800" : "text-slate-100"}`}>{invoice.amount}</span>
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
                          isLight ? "text-slate-500 hover:text-slate-700" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        View
                      </button>
                      <span className={isLight ? "text-slate-300" : "text-slate-600"}>•</span>
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
