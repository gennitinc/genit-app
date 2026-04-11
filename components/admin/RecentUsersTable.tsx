"use client";

import { useEffect, useState } from "react";
import { apiResponse } from "@/utils/apiResponse";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

export const RecentUsersTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiResponse.get("/admin/analytics/recent-users");
        setUsers(res.data.data);
      } catch (err) {
        console.error("Failed to fetch recent users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 rounded-2xl bg-card border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Signups</h3>
        <Badge variant="outline" className="font-normal">Latest 10 users</Badge>
      </div>

      <div className="rounded-md border border-border/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-xs font-bold uppercase tracking-wider">User</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Email</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Plan</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-sm">{user.username}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] px-2 py-0">
                    {user.userPlan}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(user.createdAt), "MMM d, h:mm a")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};
