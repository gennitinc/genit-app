"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiResponse } from "@/utils/apiResponse";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
      className='bg-card border-border/50 mt-8 rounded-lg border p-6'
    >
      <div className='mb-6 flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>Recent Signups</h3>
        <Badge variant='outline' className='font-normal'>
          Latest 10 users
        </Badge>
      </div>

      <div className='border-border/40 overflow-hidden rounded-md border'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='text-xs font-bold tracking-wider uppercase'>
                User
              </TableHead>
              <TableHead className='text-xs font-bold tracking-wider uppercase'>
                Email
              </TableHead>
              <TableHead className='text-xs font-bold tracking-wider uppercase'>
                Plan
              </TableHead>
              <TableHead className='text-xs font-bold tracking-wider uppercase'>
                Joined
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className='hover:bg-muted/30 transition-colors'
              >
                <TableCell className='text-sm font-medium'>
                  {user.username}
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge variant='secondary' className='px-2 py-0 text-[10px]'>
                    {user.userPlan}
                  </Badge>
                </TableCell>
                <TableCell className='text-muted-foreground text-sm'>
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
