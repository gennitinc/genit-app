"use client";

import { LocalizedText } from "@/components/localized-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import {
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { useEffect, useState } from "react";

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

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='mx-auto max-w-7xl p-8 pb-20'>
      <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            <LocalizedText text={"User Management"} />
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            <LocalizedText
              text={"Manage your platform's user base and their permissions."}
            />
          </p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' className='gap-2'>
            <Filter className='h-4 w-4' /> <LocalizedText text={"Filter"} />
          </Button>
          <Button size='sm' className='gap-2'>
            <LocalizedText text={"New User"} />
          </Button>
        </div>
      </div>

      <div className='bg-card border-border/50 overflow-hidden rounded-3xl border'>
        <div className='border-border/50 bg-muted/20 flex items-center gap-4 border-b p-6'>
          <div className='relative max-w-md flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              placeholder='Search by username or email...'
              className='bg-background border-border/50 h-10 rounded-xl pl-10'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className='text-muted-foreground ml-auto text-xs font-bold tracking-widest uppercase'>
            {filteredUsers.length} <LocalizedText text={"total users"} />
          </p>
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-muted/30'>
              <TableRow>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  <LocalizedText text={"User"} />
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  <LocalizedText text={"Plan"} />
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  <LocalizedText text={"Status"} />
                </TableHead>
                <TableHead className='py-4 text-xs font-bold tracking-wider uppercase'>
                  <LocalizedText text={"Join Date"} />
                </TableHead>
                <TableHead className='py-4 text-right text-xs font-bold tracking-wider uppercase'>
                  <LocalizedText text={"Actions"} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className='animate-pulse'>
                    <TableCell>
                      <div className='bg-muted h-10 rounded-lg' />
                    </TableCell>
                    <TableCell>
                      <div className='bg-muted h-6 w-20 rounded-full' />
                    </TableCell>
                    <TableCell>
                      <div className='bg-muted h-6 w-16 rounded-full' />
                    </TableCell>
                    <TableCell>
                      <div className='bg-muted h-6 w-24 rounded-lg' />
                    </TableCell>
                    <TableCell>
                      <div className='bg-muted ml-auto h-8 w-8 rounded-lg' />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className='hover:bg-muted/20 group transition-colors'
                  >
                    <TableCell>
                      <div className='flex items-center gap-3'>
                        <div className='text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold uppercase hover:bg-indigo-700/10'>
                          {user.username[0]}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-semibold'>
                            {user.username}
                          </span>
                          <span className='text-muted-foreground max-w-[200px] truncate text-xs'>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className='bg-background px-2 py-0.5 text-[10px] font-bold tracking-tighter uppercase'
                      >
                        {user.userPlan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-1.5'>
                        <div className='h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' />
                        <span className='text-xs font-medium'>
                          <LocalizedText text={"Active"} />
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className='text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='group-hover:bg-background h-8 w-8 rounded-lg'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='end'
                          className='border-border w-48 rounded-xl shadow-xl'
                        >
                          <DropdownMenuLabel>
                            <LocalizedText text={"Actions"} />
                          </DropdownMenuLabel>
                          <DropdownMenuItem className='gap-2'>
                            <UserCheck className='h-4 w-4' />{" "}
                            <LocalizedText text={"Edit Profile"} />
                          </DropdownMenuItem>
                          <DropdownMenuItem className='text-primary gap-2'>
                            <Mail className='h-4 w-4' />{" "}
                            <LocalizedText text={"Send Email"} />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className='text-destructive focus:text-destructive gap-2'>
                            <UserMinus className='h-4 w-4' />{" "}
                            <LocalizedText text={"Suspend Account"} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='h-64 text-center'>
                    <p className='text-muted-foreground'>
                      <LocalizedText
                        text={"No users found matching your search."}
                      />
                    </p>
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
