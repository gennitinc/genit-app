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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MoreHorizontal, UserCheck, UserMinus, Mail } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Reusing the recent-users endpoint for now, but in a real app this would be a paginated /admin/users
      const res = await apiResponse.get("/admin/analytics/recent-users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your platform's user base and their permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button size="sm" className="gap-2">
            New User
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50 bg-muted/20 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by username or email..." 
              className="pl-10 h-10 rounded-xl bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground ml-auto uppercase tracking-widest font-bold">
            {filteredUsers.length} total users
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">User</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider">Join Date</TableHead>
                <TableHead className="py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-10 bg-muted rounded-lg" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded-full w-20" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded-full w-16" /></TableCell>
                    <TableCell><div className="h-6 bg-muted rounded-lg w-24" /></TableCell>
                    <TableCell><div className="h-8 bg-muted rounded-lg w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/20 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs shrink-0 uppercase">
                          {user.username[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{user.username}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter bg-background">
                        {user.userPlan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-hover:bg-background">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl border-border shadow-xl">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <UserCheck className="w-4 h-4" /> Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-primary">
                            <Mail className="w-4 h-4" /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                            <UserMinus className="w-4 h-4" /> Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <p className="text-muted-foreground">No users found matching your search.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
