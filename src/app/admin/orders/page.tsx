"use client";

import { 
  CheckCircle2, 
  Clock, 
  Package, 
  MoreVertical, 
  Filter,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const ORDERS = [
  { id: "#ORD-9921", date: "Oct 12, 2023", customer: "Rahul Sharma", item: "Ashoka Stambh", amount: 1499, status: "completed" },
  { id: "#ORD-9922", date: "Oct 13, 2023", customer: "Priya V", item: "Custom STL Print", amount: 2450, status: "pending" },
  { id: "#ORD-9923", date: "Oct 13, 2023", customer: "Anand K", item: "BMW Keychain x5", amount: 1495, status: "shipped" },
  { id: "#ORD-9924", date: "Oct 14, 2023", customer: "Meera Das", item: "Buddha Murti", amount: 1999, status: "processing" },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", val: "₹1,24,500", trend: "+12%" },
          { label: "Active Orders", val: "42", trend: "+5" },
          { label: "Pending Quotes", val: "12", trend: "New" },
          { label: "Completion Rate", val: "98%", trend: "+1%" },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
            <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold">{s.val}</h3>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">{s.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Recent Orders
          </h3>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="gap-2 text-sm border border-white/10">
              <Filter className="h-4 w-4" /> Filter
            </Button>
            <Button variant="ghost" className="gap-2 text-sm border border-white/10">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm text-primary">{order.id}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{order.date}</td>
                  <td className="px-6 py-4 font-bold">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-300">{order.item}</td>
                  <td className="px-6 py-4 font-bold">₹{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight
                      ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                        order.status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' :
                        'bg-slate-500/10 text-slate-500'}
                    `}>
                      {order.status === 'completed' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
