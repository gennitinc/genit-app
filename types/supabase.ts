export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          userdp: string | null;
          metadata: Json | null;
          teams: Json | null;
          userPlan: "Starter" | "Premium" | "Team" | "Enterprise";
          emailVerified: boolean;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          userdp?: string | null;
          metadata?: Json | null;
          teams?: Json | null;
          userPlan?: "Starter" | "Premium" | "Team" | "Enterprise";
          emailVerified?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          userdp?: string | null;
          metadata?: Json | null;
          teams?: Json | null;
          userPlan?: "Starter" | "Premium" | "Team" | "Enterprise";
          emailVerified?: boolean;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
