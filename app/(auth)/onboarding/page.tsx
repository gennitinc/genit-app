"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/AuthenticatedContext";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Users,
  BarChart3,
  MessageSquare,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  Settings,
  Rocket,
  Search,
  ChevronDown,
  Palette,
  Headphones,
  PenTool,
  TrendingUp,
  Bot,
  Crown,
  MegaphoneIcon,
  Edit,
  Save,
  Plus,
  X,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Loading from "@/utils/Loading";
import { useIsMobile } from "@/hooks/use-mobile";
import { apiResponseFileUpload } from "@/utils/apiResponseFileUpload";
import { apiResponse } from "@/utils/apiResponse";
import { toast } from "sonner";
// TwitterApi removed - using direct API calls instead

// Google Identity Services types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}

const countries = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KP", name: "North Korea", flag: "🇰🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MO", name: "Macao", flag: "🇲🇴" },
  { code: "MK", name: "Macedonia", flag: "🇲🇰" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SZ", name: "Swaziland", flag: "🇸🇿" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

const industries = [
  "E-commerce",
  "SaaS",
  "Healthcare",
  "Finance",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Fashion",
  "Technology",
  "Consulting",
  "Marketing",
  "Manufacturing",
  "Travel",
  "Entertainment",
  "Non-profit",
  "Other",
];

const channels = [
  {
    id: "instagram",
    name: "Instagram",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <defs>
          <linearGradient
            id="instagram-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path
          fill="url(#instagram-gradient)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
    description: "Connect your Instagram Business account",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    description: "Connect your X (Twitter) account",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 256 259"
        width="256"
        height="259"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="m67.663 221.823 4.185 2.093c17.44 10.463 36.971 15.346 56.503 15.346 61.385 0 111.609-50.224 111.609-111.609 0-29.297-11.859-57.897-32.785-78.824-20.927-20.927-48.83-32.785-78.824-32.785-61.385 0-111.61 50.224-110.912 112.307 0 20.926 6.278 41.156 16.741 58.594l2.79 4.186-11.16 41.156 41.853-10.464Z"
          fill="#00E676"
        />
        <path
          d="M219.033 37.668C195.316 13.254 162.531 0 129.048 0 57.898 0 .698 57.897 1.395 128.35c0 22.322 6.278 43.947 16.742 63.478L0 258.096l67.663-17.439c18.834 10.464 39.76 15.347 60.688 15.347 70.453 0 127.653-57.898 127.653-128.35 0-34.181-13.254-66.269-36.97-89.986ZM129.048 234.38c-18.834 0-37.668-4.882-53.712-14.648l-4.185-2.093-40.458 10.463 10.463-39.76-2.79-4.186C7.673 134.63 22.322 69.058 72.546 38.365c50.224-30.692 115.097-16.043 145.79 34.181 30.692 50.224 16.043 115.097-34.18 145.79-16.045 10.463-35.576 16.043-55.108 16.043Zm61.385-77.428-7.673-3.488s-11.16-4.883-18.136-8.371c-.698 0-1.395-.698-2.093-.698-2.093 0-3.488.698-4.883 1.396 0 0-.697.697-10.463 11.858-.698 1.395-2.093 2.093-3.488 2.093h-.698c-.697 0-2.092-.698-2.79-1.395l-3.488-1.395c-7.673-3.488-14.648-7.674-20.229-13.254-1.395-1.395-3.488-2.79-4.883-4.185-4.883-4.883-9.766-10.464-13.253-16.742l-.698-1.395c-.697-.698-.697-1.395-1.395-2.79 0-1.395 0-2.79.698-3.488 0 0 2.79-3.488 4.882-5.58 1.396-1.396 2.093-3.488 3.488-4.883 1.395-2.093 2.093-4.883 1.395-6.976-.697-3.488-9.068-22.322-11.16-26.507-1.396-2.093-2.79-2.79-4.883-3.488H83.01c-1.396 0-2.79.698-4.186.698l-.698.697c-1.395.698-2.79 2.093-4.185 2.79-1.395 1.396-2.093 2.79-3.488 4.186-4.883 6.278-7.673 13.951-7.673 21.624 0 5.58 1.395 11.161 3.488 16.044l.698 2.093c6.278 13.253 14.648 25.112 25.81 35.575l2.79 2.79c2.092 2.093 4.185 3.488 5.58 5.58 14.649 12.557 31.39 21.625 50.224 26.508 2.093.697 4.883.697 6.976 1.395h6.975c3.488 0 7.673-1.395 10.464-2.79 2.092-1.395 3.487-1.395 4.882-2.79l1.396-1.396c1.395-1.395 2.79-2.092 4.185-3.487 1.395-1.395 2.79-2.79 3.488-4.186 1.395-2.79 2.092-6.278 2.79-9.765v-4.883s-.698-.698-2.093-1.395Z"
          fill="#FFF"
        />
      </svg>
    ),
    description: "Connect your WhatsApp Business",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: (
      <svg
        className="w-6 h-6"
        width="256"
        height="256"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        viewBox="0 0 256 256"
      >
        <path
          d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
          fill="#0A66C2"
        />
      </svg>
    ),
    description: "Connect your LinkedIn Company page",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: (
      <svg
        className="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 36 36"
        fill="url(#facebook__a)"
        height="40"
        width="40"
      >
        <defs>
          <linearGradient
            x1="50%"
            x2="50%"
            y1="97.078%"
            y2="0%"
            id="facebook__a"
          >
            <stop offset="0%" stopColor="#0062E0" />
            <stop offset="100%" stopColor="#19AFFF" />
          </linearGradient>
        </defs>
        <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
        <path
          fill="#FFF"
          d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
        />
      </svg>
    ),
    description: "Connect your Facebook Business",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: (
      <svg
        className="w-6 h-6"
        viewBox="0 0 256 180"
        width="256"
        height="180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
          fill="red"
        />
        <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
      </svg>
    ),
    description: "Connect your YouTube channel",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <defs>
          <linearGradient
            id="tiktok-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#25F4EE" />
            <stop offset="50%" stopColor="#FE2C55" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>
        <path
          fill="url(#tiktok-gradient)"
          d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
        />
      </svg>
    ),
    description: "Connect your TikTok Business account",
  },
];

interface AgentType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  comingSoon?: boolean;
  isPro?: boolean;
}

const checklistItems = [
  {
    id: "brand-basics",
    title: "Brand Kit",
    description:
      "Add your brand name, industry, country, and language preferences",
    icon: Users,
  },
  {
    id: "connect-channels",
    title: "Social accounts",
    description: "Add your social media profile URLs to help your brand",
    icon: Settings,
  },
  {
    id: "launch",
    title: "Launch your AI Designer",
    description: "Start creating stunning social media designs with AI",
    icon: Rocket,
  },
];

// Responsive Dialog/Drawer Component
function ResponsiveDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: React.ReactNode;
  description?: string;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] sm:max-h-[85vh] bg-BackgroundLight2 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-4">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-2 max-w-[550px] max-h-[70vh] sm:max-h-[70vh] overflow-y-auto bg-BackgroundLight2 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default function BrandOnboardingChecklist() {
  const router = useRouter();
  const { user, loading: authLoading, fetchCurrentUser } = useUserContext();
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [currentDialog, setCurrentDialog] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  ``;
  const [hasRedirected, setHasRedirected] = useState(false);
  const [formData, setFormData] = useState({
    brandName: "",
    brandDescription: "",
    industry: "",
    country: "",
    language: "English",
    website: "",
    primaryGoal: "",
    channels: [] as string[],
    agentType: "",
    agentName: "",
    agentDescription: "",
    brandLogo: null as File | null,
    brandLogoUrl: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
  });
  const [socialMediaUrls, setSocialMediaUrls] = useState<
    { platform: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countrySearchValue, setCountrySearchValue] = useState("");

  // Check if user has already completed onboarding and redirect immediately
  // Check if onboarding is completed and redirect
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (authLoading || !user) return;

      // Check if user has already completed onboarding
      // Handle both populated onboarding object and ObjectId reference
      const onboardingCompleted =
        typeof user.onboarding === "object" &&
        user.onboarding !== null &&
        "onboardingCompleted" in user.onboarding
          ? user.onboarding.onboardingCompleted === true
          : false;

      if (onboardingCompleted && !hasRedirected) {
        console.log(
          "User has already completed onboarding, redirecting to chat"
        );
        setHasRedirected(true);
        router.replace("/chat");
        return;
      }

      // If onboarding exists but is not populated, fetch it separately
      if (
        user.onboarding &&
        typeof user.onboarding === "string" &&
        !hasRedirected
      ) {
        try {
          const response = await apiResponse.get("/auth/onboarding");
          if (
            response.status === 200 &&
            response.data.onboarding?.onboardingCompleted === true
          ) {
            console.log(
              "Onboarding completed (fetched separately), redirecting to chat"
            );
            setHasRedirected(true);
            router.replace("/chat");
            return;
          }
        } catch (error) {
          console.error("Error fetching onboarding status:", error);
        }
      }
    };

    checkAndRedirect();
  }, [user, user?.onboarding, authLoading, hasRedirected, router]);

  // Check if user has already completed onboarding and load existing data
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // If auth is still loading, wait
      if (authLoading) {
        console.log("Auth still loading, waiting...");
        return;
      }

      if (!user) {
        console.log("No user found, redirecting to signin");
        router.push("/signin");
        return;
      }

      // Skip loading if onboarding is already completed (will be handled by redirect effect)
      if (user.onboarding?.onboardingCompleted === true) {
        setIsLoading(false);
        return;
      }

      // Load data from localStorage first, then from server if available
      const localStorageKey = `onboarding_data_${user._id}`;
      const savedData = localStorage.getItem(localStorageKey);

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log(
            "Loading saved onboarding data from localStorage:",
            parsedData
          );

          setFormData((prev) => ({
            ...prev,
            brandName: parsedData.brandName || "",
            brandDescription: parsedData.brandDescription || "",
            industry: parsedData.industry || "",
            country: parsedData.country || "",
            language: parsedData.language || "English",
            website: parsedData.website || "",
            primaryGoal: parsedData.primaryGoal || "",
            primaryColor: parsedData.primaryColor || "#3b82f6",
            secondaryColor: parsedData.secondaryColor || "#8b5cf6",
            brandLogoUrl: parsedData.brandLogoUrl || "",
          }));

          if (
            parsedData.socialMediaUrls &&
            Array.isArray(parsedData.socialMediaUrls)
          ) {
            setSocialMediaUrls(parsedData.socialMediaUrls);
          }

          if (
            parsedData.completedItems &&
            Array.isArray(parsedData.completedItems)
          ) {
            setCompletedItems(parsedData.completedItems);
          }
        } catch (error) {
          console.error("Error parsing saved onboarding data:", error);
          localStorage.removeItem(localStorageKey);
        }
      } else if (user.onboarding) {
        // Load existing partial data from server if no localStorage data
        const existingData = user.onboarding;
        setFormData((prev) => ({
          ...prev,
          brandName: existingData.businessName || "",
          brandDescription: existingData.businessBio || "",
          industry: existingData.industry || "",
          country: existingData.country || "",
          language: existingData.language || "English",
          website: existingData.companyWebsite || "",
          primaryGoal: existingData.primaryGoal || "",
        }));

        if (
          existingData.socialMediaUrls &&
          Array.isArray(existingData.socialMediaUrls)
        ) {
          setSocialMediaUrls(existingData.socialMediaUrls);
        } else if (
          existingData.channels &&
          Array.isArray(existingData.channels)
        ) {
          // Legacy format: convert channel IDs to URLs
          const convertedUrls = existingData.channels.map(
            (channelId: string) => ({
              platform: channelId,
              url: "",
            })
          );
          setSocialMediaUrls(convertedUrls);
        }

        // Mark completed sections based on existing data
        const completed: string[] = [];
        if (
          existingData.businessName &&
          existingData.businessBio &&
          existingData.industry &&
          existingData.country
        ) {
          completed.push("brand-basics");
        }
        if (
          existingData.primaryGoal &&
          ((existingData.socialMediaUrls &&
            existingData.socialMediaUrls.length > 0) ||
            (existingData.channels && existingData.channels.length > 0))
        ) {
          completed.push("connect-channels");
        }

        setCompletedItems(completed);
      }

      setIsLoading(false);
    };

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Onboarding check timeout, allowing access");
      setIsLoading(false);
    }, 5000); // 5 second timeout

    checkOnboardingStatus();

    return () => clearTimeout(timeoutId);
  }, [user, authLoading, router]);

  // Reset redirect state when user changes (but only if onboarding is not completed)
  useEffect(() => {
    if (user && !user.onboarding?.onboardingCompleted) {
      setHasRedirected(false);
    }
  }, [user]);

  // OAuth callback handling removed - now using URL inputs

  // OAuth handlers removed - now using URL inputs instead

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearchValue) return countries;
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(countrySearchValue.toLowerCase()) ||
        country.code.toLowerCase().includes(countrySearchValue.toLowerCase())
    );
  }, [countrySearchValue]);

  // Get selected country display
  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.code === formData.country);
  }, [formData.country]);

  // Generate agent description based on name and type
  const generateAgentDescription = useCallback((name: string, type: string) => {
    if (!name.trim() || !type) return "";

    const agentName = name.trim();
    const descriptions = {
      social: `${agentName} is a social media manager who creates engaging content, manages community interactions, and builds brand presence across all social platforms. They handle posting schedules, respond to comments, and analyze engagement metrics to optimize your social media strategy.`,
      support: `${agentName} is a customer support specialist who provides excellent customer service, handles inquiries, resolves issues, and ensures customer satisfaction. They manage support tickets, respond to customer questions, and maintain positive customer relationships.`,
      content: `${agentName} is a content writer who creates compelling, high-quality content for your brand. They write blog posts, social media captions, marketing copy, and other content that engages your audience and drives conversions.`,
      ads: `${agentName} is an ads manager who optimizes and manages your advertising campaigns across various platforms. They handle budget allocation, target audience selection, ad creation, and performance analysis to maximize your ROI.`,
      growth: `${agentName} is a growth specialist who focuses on user acquisition, retention, and business expansion. They develop growth strategies, analyze user behavior, implement conversion optimization, and drive sustainable business growth.`,
      designer: `${agentName} is an AI graphic designer who creates stunning visuals and graphics for your brand. They design logos, social media graphics, marketing materials, and other visual content that enhances your brand identity.`,
    };

    return (
      descriptions[type as keyof typeof descriptions] ||
      `${agentName} is your AI assistant who helps manage and optimize your business operations.`
    );
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = useCallback(
    async (data: any, completedSections: string[]) => {
      if (!user) return;

      const localStorageKey = `onboarding_data_${user._id}`;

      // Convert File to data URL if logo exists
      let brandLogoDataUrl = data.brandLogoUrl || "";
      if (data.brandLogo && data.brandLogo instanceof File) {
        try {
          brandLogoDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(data.brandLogo);
          });
        } catch (error) {
          console.error("Error converting logo to data URL:", error);
        }
      }

      const dataToSave = {
        brandName: data.brandName,
        brandDescription: data.brandDescription,
        industry: data.industry,
        country: data.country,
        language: data.language,
        website: data.website,
        primaryGoal: data.primaryGoal,
        agentType: data.agentType,
        agentName: data.agentName,
        agentDescription: data.agentDescription,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        brandLogoUrl: brandLogoDataUrl,
        socialMediaUrls: socialMediaUrls,
        completedItems: completedSections,
        lastSaved: new Date().toISOString(),
      };

      try {
        localStorage.setItem(localStorageKey, JSON.stringify(dataToSave));
        console.log("Saved onboarding data to localStorage:", dataToSave);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [user, socialMediaUrls]
  );

  // Clear localStorage data
  const clearLocalStorage = useCallback(() => {
    if (!user) return;

    const localStorageKey = `onboarding_data_${user._id}`;
    try {
      localStorage.removeItem(localStorageKey);
      console.log("Cleared onboarding data from localStorage");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }, [user]);

  // Save to localStorage only (no server auto-save)
  const saveLocally = useCallback(
    async (data: any, completedSections: string[]) => {
      if (!user) return;
      await saveToLocalStorage(data, completedSections);
    },
    [user, saveToLocalStorage]
  );

  // Debounced local save effect (localStorage only)
  useEffect(() => {
    if (!user || !formData.brandName) return; // Only save if user is logged in and has started filling data

    const timeoutId = setTimeout(() => {
      saveLocally(formData, completedItems);
    }, 2000); // Save to localStorage after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData, completedItems, user, saveLocally]);

  // Auto-generate agent description when name or type changes
  useEffect(() => {
    if (
      formData.agentName &&
      formData.agentType &&
      !formData.agentDescription
    ) {
      const description = generateAgentDescription(
        formData.agentName,
        formData.agentType
      );
      setFormData((prev) => ({
        ...prev,
        agentDescription: description,
      }));
    }
  }, [formData.agentName, formData.agentType, generateAgentDescription]);

  const handleDialogClose = useCallback((dialogId: string) => {
    setCurrentDialog(null);
  }, []);

  const handleDialogOpen = useCallback((dialogId: string) => {
    // Add a small delay for smoother transition
    setTimeout(() => {
      setCurrentDialog(dialogId);
    }, 50);
  }, []);

  const isItemComplete = (itemId: string) => {
    switch (itemId) {
      case "brand-basics":
        return (
          formData.brandName.trim() &&
          formData.brandDescription.trim() &&
          formData.industry &&
          formData.country
        );
      case "connect-channels":
        return (
          formData.primaryGoal &&
          // Social media URLs are optional - only validate if any are provided
          (socialMediaUrls.length === 0 ||
            socialMediaUrls.every((url) => url.url.trim() !== ""))
        );
      case "create-agent":
        return (
          formData.agentType &&
          formData.agentName.trim() &&
          formData.agentDescription.trim()
        );
      case "launch":
        return (
          completedItems.includes("brand-basics") &&
          completedItems.includes("connect-channels") &&
          completedItems.includes("create-agent")
        );
      default:
        return false;
    }
  };

  const handleItemComplete = async (itemId: string) => {
    if (isItemComplete(itemId) && !completedItems.includes(itemId)) {
      const newCompletedItems = [...completedItems, itemId];
      setCompletedItems(newCompletedItems);

      // Set saving state for this section
      setSavingSection(itemId);

      try {
        // Save to localStorage when a section is completed
        await saveLocally(formData, newCompletedItems);

        // Check if all sections are now completed
        if (newCompletedItems.length === totalCount) {
          // Trigger completion confetti from left and right
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { x: 0, y: 0.5 }, // Left side
            colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"],
            angle: 45,
            startVelocity: 25,
            gravity: 0.8,
            ticks: 150,
            zIndex: 9999,
          });

          // Second burst from right side
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { x: 1, y: 0.5 }, // Right side
            colors: ["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"],
            angle: 135,
            startVelocity: 25,
            gravity: 0.8,
            ticks: 150,
            zIndex: 9999,
          });

          // Launch is now handled directly by button click, no dialog needed
        }

        // Close dialog after save completes successfully
        handleDialogClose(itemId);
      } catch (error) {
        console.error("Error saving section:", error);
        toast.error("Failed to save changes. Please try again.");
        // Don't close dialog on error so user can retry
      } finally {
        // Clear saving state after save completes
        setSavingSection(null);
      }
    } else if (isItemComplete(itemId) && completedItems.includes(itemId)) {
      // If already completed, just save changes to localStorage
      setSavingSection(itemId);

      try {
        await saveLocally(formData, completedItems);
        // Close dialog after save completes successfully
        handleDialogClose(itemId);
      } catch (error) {
        console.error("Error saving changes:", error);
        toast.error("Failed to save changes. Please try again.");
        // Don't close dialog on error so user can retry
      } finally {
        setSavingSection(null);
      }
    }
  };

  const handleLaunchComplete = async () => {
    setIsSaving(true);
    try {
      // Save business profile data to database with onboarding completed
      const formDataToSend = new FormData();
      formDataToSend.append("businessName", formData.brandName);
      formDataToSend.append("businessBio", formData.brandDescription);
      formDataToSend.append("companyWebsite", formData.website);
      formDataToSend.append("industry", formData.industry);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("language", formData.language);
      formDataToSend.append("primaryGoal", formData.primaryGoal);
      formDataToSend.append("socialMediaUrls", JSON.stringify(socialMediaUrls));
      formDataToSend.append("agentName", formData.agentName);
      formDataToSend.append("agentDescription", formData.agentDescription);
      formDataToSend.append("primaryColor", formData.primaryColor || "#3b82f6");
      formDataToSend.append(
        "secondaryColor",
        formData.secondaryColor || "#8b5cf6"
      );
      formDataToSend.append("onboardingCompleted", "true");

      if (formData.brandLogo) {
        formDataToSend.append("brandLogo", formData.brandLogo);
      }

      const response = await apiResponseFileUpload.post(
        "/auth/onboarding/save",
        formDataToSend
      );

      if (response.status !== 200) {
        throw new Error("Failed to save business profile");
      }

      // Clear localStorage after successful completion
      clearLocalStorage();

      // Refresh user context to get updated onboarding data
      if (user && fetchCurrentUser) {
        await fetchCurrentUser();
      }

      // Trigger celebration confetti from left and right
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { x: 0, y: 0.7 }, // Left side
        colors: [
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
        ],
        angle: 45,
        startVelocity: 45,
        gravity: 0.8,
        ticks: 300,
        zIndex: 9999,
      });

      // Second burst from right side
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { x: 1, y: 0.7 }, // Right side
        colors: [
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
        ],
        angle: 135,
        startVelocity: 45,
        gravity: 0.8,
        ticks: 300,
        zIndex: 9999,
      });

      // Wait for confetti animation to play, then redirect
      setTimeout(async () => {
        // Double-check by fetching user again if needed
        if (fetchCurrentUser) {
          await fetchCurrentUser();
        }

        // Redirect to chat after confetti animation
        router.replace("/chat");
      }, 2000); // Wait 2 seconds for confetti animation to complete
    } catch (error: any) {
      console.error("Error saving business profile:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to complete onboarding. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle editing a completed section
  const handleEditSection = (itemId: string) => {
    handleDialogOpen(itemId);
  };

  const canStartItem = (itemId: string) => {
    switch (itemId) {
      case "brand-basics":
        return true;
      case "connect-channels":
        return completedItems.includes("brand-basics");
      case "launch":
        return (
          completedItems.includes("brand-basics") &&
          completedItems.includes("connect-channels")
        );
      default:
        return false;
    }
  };

  const completedCount = completedItems.length;
  const totalCount = checklistItems.length;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-black">
        <Loading />
      </div>
    );
  }

  return (
    <section className="bg-black flex flex-col items-center justify-center min-h-[100dvh]">
      <div className="max-w-[85rem]  h-[dvh] px-4 sm:px-6 flex items-center justify-center lg:px-8 mx-auto ">
        {/* Grid */}
        <div className="grid lg:grid-cols-2 items-center justify-center xl:px-16 gap-4 lg:gap-8">
          <div className="flex flex-col items-center justify-center lg:justify-start lg:items-start px-4 lg:px-0">
            <div className="flex justify-center items-center mt-4 gap-2">
              <Logo />
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Gennit
              </h1>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl lg:text-4xl lg:leading-tight dark:text-white">
              Brand Onboarding
            </h1>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                What can I expect?
              </h2>
              <ul className="mt-2 space-y-2">
                <li className="flex space-x-3">
                  <svg
                    className="flex-shrink-0 mt-0.5 size-5 text-gray-600 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">
                    Industry-leading design
                  </span>
                </li>
                <li className="flex space-x-3">
                  <svg
                    className="flex-shrink-0 mt-0.5 size-5 text-gray-600 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">
                    Developer community support
                  </span>
                </li>
                <li className="flex space-x-3">
                  <svg
                    className="flex-shrink-0 mt-0.5 size-5 text-gray-600 dark:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">
                    Simple and affordable
                  </span>
                </li>
              </ul>
            </div>
            {/* Brands */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Used by top Creators and brands:
              </h2>
              <div className="mt-4 flex gap-x-8">
                <svg
                  className="w-20 h-auto"
                  width={106}
                  height={36}
                  viewBox="0 0 106 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M55.4732 9.52669C55.4732 10.6846 54.5258 11.6846 53.3153 11.6846C52.1048 11.6846 51.1574 10.7372 51.1574 9.52669C51.1574 8.31616 52.0521 7.36879 53.3153 7.36879C54.5785 7.47406 55.4732 8.42142 55.4732 9.52669ZM46.6837 13.8425C46.6837 14.053 46.6837 14.3688 46.6837 14.3688C46.6837 14.3688 45.6837 13.053 43.5258 13.053C39.9469 13.053 37.1574 15.7898 37.1574 19.5267C37.1574 23.2635 39.8942 26.0004 43.5258 26.0004C45.7363 26.0004 46.6837 24.6319 46.6837 24.6319V25.2109C46.6837 25.4741 46.8942 25.6846 47.1574 25.6846H49.789V13.3688C49.789 13.3688 47.3679 13.3688 47.1574 13.3688C46.8942 13.3688 46.6837 13.632 46.6837 13.8425ZM46.6837 21.7372C46.21 22.4741 45.21 23.1056 44.0521 23.1056C41.9469 23.1056 40.3679 21.7898 40.3679 19.5793C40.3679 17.3688 41.9995 16.053 44.0521 16.053C45.21 16.053 46.2627 16.6846 46.6837 17.4214V21.7372ZM51.789 13.3688H54.9469V25.6846H51.789V13.3688ZM98.789 13.053C96.6311 13.053 95.6311 14.3688 95.6311 14.3688V7.47406H92.4732V25.7372C92.4732 25.7372 94.8942 25.7372 95.1048 25.7372C95.3679 25.7372 95.5785 25.5267 95.5785 25.2635V24.6846C95.5785 24.6846 96.5785 26.053 98.7364 26.053C102.315 26.053 105.105 23.3162 105.105 19.5793C105.157 15.7898 102.368 13.053 98.789 13.053ZM98.2627 23.053C97.0521 23.053 96.1048 22.4214 95.6311 21.6846V17.2635C96.1048 16.632 97.1574 15.8951 98.2627 15.8951C100.368 15.8951 101.947 17.2109 101.947 19.4214C101.947 21.632 100.368 23.053 98.2627 23.053ZM90.8416 18.4214V25.7898H87.6837V18.7898C87.6837 16.7372 87.0521 15.9477 85.2627 15.9477C84.3153 15.9477 83.3153 16.4214 82.6837 17.1583V25.7372H79.5258V13.3688H81.9995C82.2627 13.3688 82.4732 13.5793 82.4732 13.8425V14.3688C83.3679 13.4214 84.6311 13.053 85.8416 13.053C87.21 13.053 88.3679 13.4214 89.2627 14.2109C90.4206 15.1583 90.8416 16.3162 90.8416 18.4214ZM71.8942 13.053C69.7364 13.053 68.7364 14.3688 68.7364 14.3688V7.47406H65.5785V25.7372C65.5785 25.7372 67.9995 25.7372 68.21 25.7372C68.4732 25.7372 68.6837 25.5267 68.6837 25.2635V24.6846C68.6837 24.6846 69.6837 26.053 71.8416 26.053C75.4206 26.053 78.21 23.3162 78.21 19.5793C78.2627 15.7898 75.4732 13.053 71.8942 13.053ZM71.3679 23.053C70.1574 23.053 69.21 22.4214 68.7364 21.6846V17.2635C69.21 16.632 70.2627 15.8951 71.3679 15.8951C73.4732 15.8951 75.0521 17.2109 75.0521 19.4214C75.0521 21.632 73.4732 23.053 71.3679 23.053ZM62.8416 13.053C63.789 13.053 64.2627 13.2109 64.2627 13.2109V16.1056C64.2627 16.1056 61.6311 15.2109 59.9995 17.1056V25.7372H56.8416V13.3688C56.8416 13.3688 59.2627 13.3688 59.4732 13.3688C59.7364 13.3688 59.9469 13.5793 59.9469 13.8425V14.3688C60.5785 13.6846 61.8942 13.053 62.8416 13.053ZM30.1574 24.6319C29.9995 24.2635 29.8416 23.7898 29.6837 23.4741C29.4206 22.8951 29.1574 22.3162 28.9469 21.7898L28.8942 21.7372C26.6311 16.8425 24.21 11.8425 21.6311 6.89511L21.5258 6.68458C21.2627 6.2109 20.9995 5.68458 20.7363 5.15827C20.4206 4.57932 20.1048 3.94774 19.5785 3.36879C18.5258 2.053 16.9995 1.31616 15.4206 1.31616C13.789 1.31616 12.3153 2.053 11.21 3.26353C10.6837 3.89511 10.3153 4.47406 9.99951 5.10564C9.73635 5.63195 9.47319 6.15827 9.21003 6.63195L9.10477 6.84248C6.57845 11.7372 4.10477 16.7372 1.84161 21.6846L1.78898 21.7372C1.57845 22.2635 1.3153 22.8425 1.05214 23.4214C0.894243 23.7898 0.736348 24.1583 0.578453 24.5793C0.1574 25.7898 -0.000494249 26.9477 0.210032 28.1056C0.578453 30.5793 2.21003 32.632 4.47319 33.5267C5.3153 33.8951 6.21003 34.053 7.10477 34.053C7.36793 34.053 7.68372 34.0004 7.94687 34.0004C9.05214 33.8951 10.1574 33.5267 11.21 32.8951C12.5785 32.1583 13.8416 31.053 15.2627 29.4741C16.6837 31.053 17.9995 32.1056 19.3153 32.8951C20.4206 33.5267 21.5258 33.8951 22.5785 34.0004C22.8416 34.053 23.1574 34.053 23.4206 34.053C24.3153 34.053 25.2627 33.8951 26.0521 33.5267C28.3679 32.632 29.9469 30.5267 30.3153 28.1056C30.6837 26.9477 30.5785 25.8425 30.1574 24.6319ZM15.3679 26.3162C13.5785 24.1056 12.4732 22.0004 12.0521 20.2109C11.8942 19.4741 11.8416 18.7898 11.9469 18.2109C11.9995 17.6846 12.21 17.2109 12.4732 16.8425C13.1048 15.9477 14.1574 15.4214 15.3679 15.4214C16.5785 15.4214 17.6837 15.9477 18.2627 16.8425C18.5258 17.2109 18.7363 17.6846 18.789 18.2109C18.8942 18.7898 18.8416 19.4741 18.6837 20.2109C18.2627 21.9477 17.1048 24.053 15.3679 26.3162ZM28.4206 27.8425C28.21 29.5267 27.0521 31.0004 25.4206 31.6846C24.6311 32.0004 23.789 32.1056 22.9469 32.0004C22.1048 31.8951 21.3153 31.632 20.4732 31.1583C19.3153 30.5267 18.1048 29.4741 16.7363 28.0004C18.8942 25.3688 20.21 22.8951 20.6837 20.7372C20.8942 19.7372 20.9469 18.7898 20.8416 17.9477C20.7363 17.1056 20.4206 16.3688 19.9469 15.7372C18.9469 14.2635 17.21 13.4214 15.3153 13.4214C13.4206 13.4214 11.6837 14.3162 10.6837 15.7372C10.21 16.3688 9.94687 17.1583 9.78898 17.9477C9.68372 18.7898 9.68372 19.7372 9.94687 20.7372C10.4206 22.8951 11.789 25.3688 13.8942 28.0004C12.5258 29.5267 11.3153 30.5267 10.1574 31.1583C9.3153 31.632 8.47319 31.8951 7.68372 32.0004C6.78898 32.1056 5.94687 31.9477 5.21003 31.6846C3.57845 31.053 2.47319 29.5267 2.21003 27.8425C2.10477 27.0004 2.1574 26.2109 2.52582 25.2635C2.63108 24.9477 2.78898 24.632 2.94687 24.2109C3.1574 23.6846 3.42056 23.1056 3.68372 22.5793L3.73635 22.5267C5.99951 17.632 8.42056 12.632 10.9469 7.78985L11.0521 7.57932C11.3153 7.10564 11.5785 6.57932 11.8416 6.053C12.1048 5.52669 12.4206 5.053 12.7363 4.63195C13.4206 3.84248 14.3679 3.42143 15.3679 3.42143C16.3679 3.42143 17.3153 3.84248 17.9995 4.63195C18.3679 5.053 18.6311 5.52669 18.8942 6.053C19.1574 6.52669 19.4206 7.053 19.6837 7.57932L19.789 7.78985C22.2627 12.6846 24.6837 17.6846 26.9469 22.5267V22.5793C27.21 23.1056 27.4206 23.6846 27.6837 24.2109C27.8416 24.5793 27.9995 24.9477 28.1048 25.2635C28.4732 26.1583 28.5785 27.0004 28.4206 27.8425Z"
                      fill="currentColor"
                      className="fill-gray-500"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect
                        width="105.474"
                        height={35}
                        fill="currentColor"
                        className="fill-gray-500"
                        transform="translate(0 0.26355)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  className="w-20 h-auto"
                  width={140}
                  height={47}
                  viewBox="0 0 140 47"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.3991 8.15082C20.3991 9.61789 19.1416 10.8754 17.6745 10.8754C16.2075 10.8754 14.95 9.61789 14.95 8.15082C14.95 6.68375 16.2075 5.42627 17.6745 5.42627C19.1416 5.42627 20.3991 6.68375 20.3991 8.15082ZM17.6745 13.1109C16.0678 13.1109 14.8103 14.3684 14.8103 15.9752C14.8103 17.582 16.0678 18.8394 17.6745 18.8394C19.2813 18.8394 20.5388 17.582 20.5388 15.9752C20.5388 14.2985 19.2813 13.1109 17.6745 13.1109ZM17.6745 20.7257C16.0678 20.7257 14.7404 22.053 14.7404 23.6598C14.7404 25.2666 16.0678 26.5939 17.6745 26.5939C19.2813 26.5939 20.6087 25.2666 20.6087 23.6598C20.6785 22.053 19.2813 20.7257 17.6745 20.7257ZM17.6745 28.4802C16.0678 28.4802 14.8103 29.7376 14.8103 31.3444C14.8103 32.9512 16.0678 34.2087 17.6745 34.2087C19.2813 34.2087 20.5388 32.9512 20.5388 31.3444C20.5388 29.8075 19.2813 28.4802 17.6745 28.4802ZM17.6745 36.3744C16.2075 36.3744 14.95 37.6319 14.95 39.0989C14.95 40.566 16.2075 41.8235 17.6745 41.8235C19.1416 41.8235 20.3991 40.566 20.3991 39.0989C20.3991 37.6319 19.2115 36.3744 17.6745 36.3744ZM25.2195 12.7616C23.4729 12.7616 22.0059 14.2287 22.0059 15.9752C22.0059 17.7217 23.4729 19.1887 25.2195 19.1887C26.966 19.1887 28.433 17.7217 28.433 15.9752C28.433 14.2287 26.966 12.7616 25.2195 12.7616ZM25.2195 20.3764C23.4031 20.3764 21.8662 21.8434 21.8662 23.7297C21.8662 25.546 23.3332 27.083 25.2195 27.083C27.0358 27.083 28.5728 25.6159 28.5728 23.7297C28.5728 21.8434 27.0358 20.3764 25.2195 20.3764ZM25.2195 28.1309C23.4729 28.1309 22.0059 29.5979 22.0059 31.3444C22.0059 33.0909 23.4729 34.558 25.2195 34.558C26.966 34.558 28.433 33.0909 28.433 31.3444C28.433 29.5979 26.966 28.1309 25.2195 28.1309ZM32.9739 19.9572C31.0179 19.9572 29.2714 21.564 29.2714 23.6598C29.2714 25.6159 30.8781 27.3624 32.9739 27.3624C35.0698 27.3624 36.6765 25.7556 36.6765 23.6598C36.5368 21.564 34.93 19.9572 32.9739 19.9572ZM10.0598 13.4602C8.73243 13.4602 7.61466 14.578 7.61466 15.9053C7.61466 17.2327 8.73243 18.3504 10.0598 18.3504C11.3871 18.3504 12.5049 17.2327 12.5049 15.9053C12.5049 14.578 11.457 13.4602 10.0598 13.4602ZM10.0598 21.075C8.59271 21.075 7.47494 22.1927 7.47494 23.6598C7.47494 25.1269 8.59271 26.2446 10.0598 26.2446C11.5268 26.2446 12.6446 25.1269 12.6446 23.6598C12.6446 22.1927 11.5268 21.075 10.0598 21.075ZM10.0598 28.8295C8.73243 28.8295 7.61466 29.9472 7.61466 31.2746C7.61466 32.6019 8.73243 33.7197 10.0598 33.7197C11.3871 33.7197 12.5049 32.6019 12.5049 31.2746C12.5049 29.9472 11.457 28.8295 10.0598 28.8295ZM2.445 21.4941C1.18752 21.4941 0.209473 22.4722 0.209473 23.7297C0.209473 24.9871 1.18752 25.9652 2.445 25.9652C3.70249 25.9652 4.68053 24.9871 4.68053 23.7297C4.68053 22.4722 3.70249 21.4941 2.445 21.4941Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M64.4812 18.9092C64.2018 18.9092 63.9922 19.1886 63.9922 19.3982V38.7495C63.9922 39.0289 64.2716 39.2385 64.4812 39.2385H66.7866C67.066 39.2385 67.2756 38.9591 67.2756 38.7495V19.3982C67.2756 19.1188 66.9962 18.9092 66.7866 18.9092H64.4812Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M65.7389 10.7358C64.4815 10.7358 63.5034 11.7139 63.5034 12.9714C63.5034 14.2289 64.4815 15.2069 65.7389 15.2069C66.9964 15.2069 67.9745 14.2289 67.9745 12.9714C67.9745 11.7139 66.9266 10.7358 65.7389 10.7358Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M114.082 18.9092C113.803 18.9092 113.593 19.1886 113.593 19.3982V38.7495C113.593 39.0289 113.873 39.2385 114.082 39.2385H116.388C116.667 39.2385 116.877 38.9591 116.877 38.7495V19.3982C116.877 19.1188 116.597 18.9092 116.388 18.9092H114.082Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M115.2 10.7358C113.942 10.7358 112.964 11.7139 112.964 12.9714C112.964 14.2289 113.942 15.2069 115.2 15.2069C116.457 15.2069 117.435 14.2289 117.435 12.9714C117.435 11.7139 116.457 10.7358 115.2 10.7358Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M138.603 37.3525C138.743 37.2127 138.743 37.073 138.743 37.0031C138.743 36.8634 138.743 36.8634 138.743 36.8634C138.743 36.8634 138.743 36.7237 138.603 36.7237C138.603 36.7237 138.463 36.584 138.324 36.584C138.184 36.584 138.184 36.584 138.044 36.584H137.416V38.3305H137.695V37.7018H138.044L138.533 38.3305H138.813L138.184 37.562C138.463 37.6319 138.603 37.4922 138.603 37.3525ZM137.765 37.4922V36.8634H138.254C138.394 36.8634 138.533 36.8634 138.603 37.0031C138.743 37.0031 138.743 37.1429 138.743 37.2826C138.743 37.4223 138.743 37.562 138.603 37.562C138.463 37.562 138.324 37.7018 138.254 37.7018H137.765V37.4922Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M138.114 35.8853C137.276 35.8853 136.507 36.6537 136.507 37.492C136.507 38.3304 137.276 39.0988 138.114 39.0988C138.952 39.0988 139.721 38.3304 139.721 37.492C139.721 36.5839 139.022 35.8853 138.114 35.8853ZM138.114 38.9591C137.276 38.9591 136.647 38.3304 136.647 37.492C136.647 36.6537 137.276 36.025 138.114 36.025C138.952 36.025 139.581 36.6537 139.581 37.492C139.581 38.3304 138.883 38.9591 138.114 38.9591Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M83.6928 22.0531C83.9722 22.0531 84.1818 21.7737 84.1818 21.5641V19.2587C84.1818 18.9793 83.9024 18.7697 83.6928 18.7697H78.7327V11.3645C78.7327 11.0851 78.4533 10.8755 78.2437 10.8755H75.9383C75.6588 10.8755 75.4493 11.1549 75.4493 11.3645V18.7697H73.0042C72.7247 18.7697 72.5151 19.0491 72.5151 19.2587V21.5641C72.5151 21.8436 72.7946 22.0531 73.0042 22.0531H75.4493V33.2308C75.4493 36.6539 77.7547 38.8895 81.108 38.8895H83.5531C83.8325 38.8895 84.0421 38.61 84.0421 38.4004V36.0951C84.0421 35.8156 83.7626 35.606 83.5531 35.606H81.4573C79.8505 35.606 78.7327 34.4883 78.7327 32.7418V21.9833L83.6928 22.0531Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M132.735 22.0531C133.014 22.0531 133.224 21.7737 133.224 21.5641V19.2587C133.224 18.9793 132.944 18.7697 132.735 18.7697H127.775V11.3645C127.775 11.0851 127.495 10.8755 127.286 10.8755H124.98C124.701 10.8755 124.491 11.1549 124.491 11.3645V18.7697H122.046C121.767 18.7697 121.557 19.0491 121.557 19.2587V21.5641C121.557 21.8436 121.837 22.0531 122.046 22.0531H124.491V33.2308C124.491 36.6539 126.797 38.8895 130.15 38.8895H132.595C132.874 38.8895 133.084 38.61 133.084 38.4004V36.0951C133.084 35.8156 132.805 35.606 132.595 35.606H130.36C128.753 35.606 127.635 34.4883 127.635 32.7418V21.9833L132.735 22.0531Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M49.8106 22.053V38.5401C49.8106 38.8195 50.09 39.0291 50.2996 39.0291H52.605C52.8844 39.0291 53.094 38.7497 53.094 38.5401V22.053H58.5431C58.8226 22.053 59.0321 21.7736 59.0321 21.564V19.2586C59.0321 18.9792 58.7527 18.7696 58.5431 18.7696H53.094V14.4383C53.094 12.6918 54.3515 11.5041 55.8186 11.5041H58.5431C58.8226 11.5041 59.0321 11.2247 59.0321 11.0151V8.70973C59.0321 8.43028 58.7527 8.2207 58.5431 8.2207H55.9583C52.5351 8.2207 49.8106 11.085 49.8106 14.3684V18.7696H47.3655C47.086 18.7696 46.8765 19.049 46.8765 19.2586V21.564C46.8765 21.8435 47.1559 22.053 47.3655 22.053H49.8106Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M106.258 21.2148C104.442 19.2587 101.857 18.1409 99.1321 18.1409C96.5473 18.1409 93.9625 19.2587 92.3557 20.8655V8.57008C92.3557 8.29064 92.0763 8.08105 91.8667 8.08105H89.5613C89.2818 8.08105 89.0723 8.3605 89.0723 8.57008V28.8994C89.0723 36.4443 94.1022 39.7278 99.0623 39.7278C103.952 39.7278 109.052 36.3745 109.052 28.8994C109.052 25.8954 108.074 23.1709 106.258 21.2148ZM99.0623 36.584C94.1022 36.584 92.2858 32.6719 92.2858 28.9693C92.2858 24.4284 95.0104 21.4244 99.0623 21.4244C103.114 21.4244 105.839 24.4982 105.839 28.9693C105.769 32.6719 104.022 36.584 99.0623 36.584Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                </svg>
                <svg
                  className="w-20 h-auto"
                  width={200}
                  height={67}
                  viewBox="0 0 200 67"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44.6108 11.7537C45.9082 11.7537 47.1058 11.3545 48.0041 10.5561C48.9023 9.75767 49.4013 8.65988 49.4013 7.46227C49.4013 6.16487 48.9023 5.16686 48.0041 4.26866C47.1058 3.47026 46.008 3.07104 44.6108 3.07104C43.3134 3.07104 42.2156 3.47026 41.3174 4.36846C40.4192 5.26666 40.02 6.26467 40.02 7.46227C40.02 8.65988 40.4192 9.65787 41.3174 10.5561C42.2156 11.3545 43.3134 11.7537 44.6108 11.7537Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M73.3534 0.176758V20.6358H73.1538C72.8544 20.1368 72.3554 19.6378 71.8564 19.1388C71.2576 18.6398 70.559 18.1408 69.7606 17.7416C68.9622 17.3424 68.064 16.9432 66.9662 16.6438C65.8684 16.3444 64.6708 16.2446 63.3734 16.2446C61.2776 16.2446 59.3814 16.6438 57.6847 17.4422C55.9881 18.2406 54.4911 19.3384 53.1937 20.7356C51.9961 22.1328 50.9981 23.7297 50.2995 25.6259C49.6009 27.5221 49.3015 29.5181 49.3015 31.6139C49.3015 33.7097 49.6009 35.8055 50.2995 37.6019C50.8983 39.4981 51.8963 41.0949 53.1937 42.4921C54.4911 43.8893 55.9881 44.9871 57.6847 45.7855C59.4812 46.5839 61.4772 46.9831 63.7726 46.9831C65.8684 46.9831 67.7646 46.5839 69.561 45.7855C71.3574 44.9871 72.7546 43.6897 73.8524 41.8933H73.9522V46.0849H80.8384V0.176758H73.3534ZM73.054 34.8075C72.6548 35.9053 72.056 36.8035 71.3574 37.6019C70.559 38.4003 69.6608 39.0989 68.6628 39.4981C67.565 39.9971 66.3674 40.1967 65.07 40.1967C63.7726 40.1967 62.575 39.9971 61.4772 39.4981C60.3794 38.9991 59.4812 38.4003 58.7826 37.6019C57.9841 36.8035 57.4851 35.9053 57.0859 34.8075C56.6867 33.7097 56.4871 32.7117 56.4871 31.5141C56.4871 30.4163 56.6867 29.3185 57.0859 28.2207C57.4851 27.1229 58.0839 26.2247 58.7826 25.4263C59.581 24.6279 60.4792 23.9293 61.4772 23.5301C62.575 23.031 63.7726 22.8314 65.07 22.8314C66.3674 22.8314 67.565 23.031 68.6628 23.5301C69.7606 24.0291 70.6588 24.6279 71.3574 25.4263C72.1558 26.2247 72.6548 27.1229 73.054 28.2207C73.4532 29.3185 73.6528 30.4163 73.6528 31.5141C73.6528 32.6119 73.4532 33.7097 73.054 34.8075Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M130.739 19.9373L123.553 27.1229V40.3963H123.353C122.954 39.8973 122.555 39.3983 121.956 38.8993C121.357 38.4003 120.659 37.9013 119.86 37.5021C119.062 37.1029 118.164 36.7037 117.066 36.4043C116.367 36.2047 115.469 36.1049 114.571 36.0051L99.501 51.2746C99.501 53.3704 99.8004 55.3664 100.499 57.2626C101.098 59.1588 102.096 60.7556 103.393 62.1528C104.691 63.55 106.188 64.6478 107.884 65.3464C109.681 66.1448 111.677 66.544 113.872 66.544C115.968 66.544 117.864 66.1448 119.661 65.3464C121.457 64.548 122.854 63.2506 123.852 61.4542H123.952V65.8454H130.838V19.9373H130.739ZM123.253 54.4682C122.854 55.566 122.255 56.4642 121.557 57.2626C120.858 58.061 119.86 58.7596 118.862 59.1588C117.764 59.6578 116.667 59.8574 115.269 59.8574C113.972 59.8574 112.774 59.6578 111.677 59.1588C110.579 58.6598 109.681 58.061 108.982 57.2626C108.283 56.4642 107.685 55.566 107.285 54.4682C106.886 53.3704 106.687 52.3724 106.687 51.1748C106.687 50.077 106.886 48.9792 107.285 47.8814C107.685 46.7836 108.283 45.8854 108.982 45.087C109.681 44.2886 110.579 43.5899 111.677 43.1907C112.774 42.6917 113.872 42.4921 115.269 42.4921C116.567 42.4921 117.764 42.6917 118.862 43.1907C119.96 43.6897 120.858 44.2886 121.557 45.087C122.255 45.8854 122.854 46.7836 123.253 47.8814C123.653 48.9792 123.852 50.077 123.852 51.1748C123.852 52.3724 123.653 53.4702 123.253 54.4682Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M162.275 44.9872C161.477 43.091 160.279 41.4941 158.882 40.1967C157.485 38.8993 155.788 37.8015 153.892 37.1029C151.996 36.4043 149.9 36.0051 147.704 36.0051C145.509 36.0051 143.513 36.4043 141.517 37.1029C139.621 37.8015 137.924 38.8993 136.527 40.1967C135.13 41.4941 134.032 43.091 133.134 44.9872C132.335 46.8834 131.936 48.9792 131.936 51.2746C131.936 53.57 132.335 55.6658 133.134 57.562C133.932 59.4582 135.13 61.055 136.527 62.3524C137.924 63.6498 139.621 64.7476 141.517 65.4462C143.413 66.1448 145.509 66.544 147.704 66.544C149.9 66.544 151.896 66.1448 153.892 65.4462C155.788 64.7476 157.485 63.6498 158.882 62.3524C160.279 61.055 161.377 59.4582 162.275 57.562C163.074 55.6658 163.473 53.57 163.473 51.2746C163.573 48.9792 163.174 46.8834 162.275 44.9872ZM155.689 54.4682C155.289 55.566 154.691 56.4642 153.992 57.2626C153.293 58.061 152.395 58.7596 151.297 59.1588C150.2 59.6578 149.102 59.8574 147.704 59.8574C146.407 59.8574 145.209 59.6578 144.112 59.1588C143.014 58.6598 142.116 58.061 141.417 57.2626C140.718 56.4642 140.12 55.566 139.72 54.4682C139.321 53.3704 139.122 52.3724 139.122 51.1748C139.122 50.077 139.321 48.9792 139.72 47.8814C140.12 46.7836 140.619 45.8854 141.417 45.087C142.116 44.2886 143.014 43.59 144.112 43.1908C145.209 42.6918 146.307 42.4922 147.704 42.4922C149.002 42.4922 150.2 42.6918 151.297 43.1908C152.395 43.6898 153.293 44.2886 153.992 45.087C154.691 45.8854 155.289 46.7836 155.689 47.8814C156.088 48.9792 156.287 50.077 156.287 51.1748C156.287 52.3724 156.088 53.4702 155.689 54.4682Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M186.128 52.6718C185.329 51.574 184.431 50.6758 183.234 50.077C182.036 49.4782 180.838 48.9792 179.441 48.6798C178.144 48.3804 176.946 48.081 175.649 47.7816C174.451 47.4822 173.553 47.1828 172.755 46.7836C171.956 46.3844 171.557 45.6858 171.557 44.8874C171.557 43.7896 172.056 42.9912 172.954 42.4922C173.852 41.9932 174.85 41.7936 175.848 41.7936C178.244 41.7936 180.14 42.7916 181.537 44.7876L186.427 40.3963C185.23 38.7995 183.733 37.6019 181.836 37.0031C179.94 36.3045 178.044 36.0051 176.048 36.0051C174.551 36.0051 173.154 36.2047 171.757 36.5041C170.359 36.9033 169.062 37.4023 167.964 38.2007C166.866 38.9991 165.968 39.9971 165.369 41.0949C164.671 42.2926 164.371 43.6898 164.371 45.2866C164.371 47.1828 164.771 48.58 165.569 49.6778C166.367 50.7756 167.266 51.574 168.463 52.1728C169.661 52.7716 170.858 53.1708 172.256 53.4702C173.653 53.7696 174.85 53.9692 176.048 54.3684C177.246 54.6678 178.144 55.067 178.942 55.566C179.741 56.065 180.14 56.7636 180.14 57.7616C180.14 58.3604 179.94 58.8594 179.641 59.2586C179.341 59.6578 178.942 60.057 178.443 60.3564C177.944 60.6558 177.445 60.8554 176.846 60.9552C176.248 61.055 175.749 61.1548 175.25 61.1548C173.753 61.1548 172.455 60.8554 171.357 60.1568C170.26 59.4582 169.262 58.6598 168.363 57.562L163.473 62.1528C164.97 63.8494 166.667 65.047 168.563 65.6458C170.459 66.2446 172.555 66.6438 174.85 66.6438C176.248 66.6438 177.645 66.544 179.142 66.2446L187.425 57.9612C187.425 57.7616 187.425 57.562 187.425 57.3624C187.325 55.2666 186.926 53.7696 186.128 52.6718Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M33.8322 17.3425L26.0478 37.5022H25.948L18.2634 17.3425L12.6746 22.9313L22.1556 46.085H29.8402L40.9181 18.1409V46.085H48.2035V17.3425H33.8322Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                  <path
                    d="M108.483 34.4084V29.4183C108.483 28.7197 108.483 27.9213 108.383 27.0231C108.383 26.1249 108.184 25.1269 107.984 24.2287C107.785 23.2307 107.385 22.3325 106.886 21.3345C106.387 20.4363 105.689 19.5381 104.691 18.8395C103.793 18.1409 102.595 17.5421 101.198 17.0431C99.8005 16.5441 98.0041 16.3445 96.0081 16.3445C93.7127 16.3445 91.5171 16.7437 89.3215 17.4423C87.1258 18.1409 85.2296 19.3385 83.6328 21.0351L87.4252 24.8275C88.4233 23.9293 89.5211 23.1309 90.9183 22.6319C92.2157 22.1329 93.7127 21.8335 95.2097 21.8335C97.1059 21.8335 98.7027 22.3325 100 23.2307C101.298 24.1289 101.896 25.5261 101.896 27.3225V28.1209H100.1C98.9023 28.1209 97.6049 28.1209 96.2077 28.2207C94.8105 28.3205 93.5131 28.4203 92.1159 28.6199C90.7187 28.8195 89.4213 29.2187 88.2237 29.6179C86.9262 30.0171 85.8284 30.6159 84.9302 31.4143C83.9322 32.1129 83.2336 33.1109 82.6348 34.2087C82.036 35.3066 81.8364 36.7038 81.8364 38.2008C81.8364 39.6978 82.1358 40.8954 82.7346 41.9932C83.3334 43.091 84.1318 43.9892 85.1298 44.6878C86.1278 45.3864 87.2256 45.9852 88.523 46.2846C89.8205 46.6838 91.1179 46.7836 92.4153 46.7836C94.0121 46.7836 95.4093 46.584 96.8065 46.085L108.483 34.4084ZM101.497 34.7078C101.497 36.8036 100.898 38.4004 99.7007 39.598C98.5031 40.7956 96.7067 41.3944 94.1119 41.3944C93.5131 41.3944 92.9143 41.2946 92.3155 41.1948C91.7167 41.095 91.1179 40.7956 90.7187 40.4962C90.2197 40.1968 89.8205 39.7976 89.5211 39.2986C89.2217 38.7996 89.0221 38.3006 89.0221 37.602C89.0221 36.5042 89.4213 35.7058 90.2197 35.107C91.0181 34.5082 91.9163 34.109 93.0141 33.8096C94.1119 33.5101 95.3095 33.3105 96.5071 33.2107C97.8045 33.1109 98.9023 33.1109 99.9003 33.1109H101.397V34.7078H101.497Z"
                    fill="currentColor"
                    className="fill-gray-500"
                  />
                </svg>
              </div>
            </div>
            {/* End Brands */}
            <div className="mt-10 flex items-center gap-x-5">
              {/* Avatar Group */}
              <div className="flex -space-x-2">
                <img
                  className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                  alt="Image Description"
                />
                <img
                  className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2.5&w=320&h=320&q=80"
                  alt="Image Description"
                />
                <img
                  className="inline-block size-8 rounded-full ring-2 ring-white dark:ring-gray-800"
                  src="https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
                  alt="Image Description"
                />
                <span className="inline-flex justify-center items-center size-8 rounded-full bg-blue-600 text-white ring-2 ring-white">
                  <svg
                    className="size-3.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                  </svg>
                </span>
              </div>
              {/* End Avatar Group */}
              <span className="text-sm text-gray-500">
                Trusted by over 100+ customer
              </span>
            </div>
          </div>
          {/* End Col */}
          <div className="container max-w-none flex w-full flex-col items-center justify-center py-4 overflow-y-auto">
            <div className="flex w-full max-w-[506px] flex-col items-center justify-center gap-4 px-2">
              <div className="w-full max-w-4xl space-y-2 border border-gray-200 dark:border-neutral-800 py-4 px-4 sm:px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-neutral-900">
                <div className="flex flex-col items-center gap-3 mb-3">
                  <span className="text-xl font-bold">Brand Onboarding</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {completedCount} of {totalCount} completed
                    </span>
                    {/* {isAutoSaving && (
                      <div className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400">
                        <div className="w-2 h-2 border border-current border-t-transparent rounded-full animate-spin" />
                        Saving
                      </div>
                    )} */}
                  </div>
                </div>

                <div className="flex w-full flex-col items-start gap-4">
                  {checklistItems.map((item, index) => (
                    <Card
                      key={item.id}
                      className={cn(
                        "flex w-full items-center gap-4 border bg-white dark:bg-neutral-800 p-2 md:p-4 shadow-sm hover:shadow-md transition-all duration-200",
                        completedItems.includes(item.id)
                          ? ""
                          : canStartItem(item.id)
                            ? "border-gray-200 dark:border-neutral-700"
                            : "border-gray-200 dark:border-neutral-700 opacity-60"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-colors",
                          completedItems.includes(item.id)
                            ? ""
                            : "bg-neutral-900 dark:bg-neutral-800"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-6 h-6 transition-colors",
                            completedItems.includes(item.id)
                              ? "text-white dark:text-gray-300"
                              : "text-white dark:text-gray-300"
                          )}
                        />
                      </div>

                      <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center">
                        {/* <span className="w-full text-sm font-semibold text-foreground block md:hidden">
                      Step {index + 1}
                        </span> */}
                        <span className="w-32 md:w-full text-sm font-semibold text-foreground block truncate md:whitespace-normal md:line-clamp-none">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 w-full md:line-clamp-none">
                          {item.description}
                        </span>
                      </div>

                      {completedItems.includes(item.id) ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <Button
                            onClick={() => handleEditSection(item.id)}
                            size="sm"
                            variant="ghost"
                            className="p-2 h-10 w-10 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-200/50 dark:hover:border-cyan-700/50 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            if (item.id === "launch") {
                              handleLaunchComplete();
                            } else {
                              handleDialogOpen(item.id);
                            }
                          }}
                          disabled={
                            !canStartItem(item.id) ||
                            (item.id === "launch" && isSaving)
                          }
                          size="sm"
                          className={cn(
                            "transition-all duration-300 ease-out transform hover:scale-105 active:scale-95",
                            canStartItem(item.id)
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
                              : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          )}
                        >
                          {item.id === "launch" && canStartItem(item.id) ? (
                            <>
                              {isSaving ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Launching...
                                </>
                              ) : (
                                <>
                                  <Rocket className="w-4 h-4 mr-1" />
                                  Launch
                                </>
                              )}
                            </>
                          ) : canStartItem(item.id) ? (
                            <>
                              Start
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Locked
                              <ChevronRight className="w-4 h-4 ml-1 opacity-50" />
                            </>
                          )}
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-5 max-w-[26rem] w-full space-y-3 px-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                This site is protected by reCAPTCHA and our{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Policy
                </a>{" "}
                {/* &{" "}
                <a
                  href="#"
                  className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
                >
                  Terms of Service
                </a> */}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                ©2025 Gennit. A product of{" "}
                <a
                  className="text-gray-800 dark:text-white font-medium hover:text-blue-600"
                  href="#"
                >
                  Klip Inc.
                </a>{" "}
                All rights reserved.
              </p>
            </div>
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>

      {/* Brand Basics Dialog */}
      <ResponsiveDialog
        open={currentDialog === "brand-basics"}
        onOpenChange={(open) => !open && handleDialogClose("brand-basics")}
        title={
          <div className="flex items-center gap-2">
            {/* Set up your brand profile */}
          </div>
        }
        description=""
      >
        <div className="space-y-6">
          {/* Brand Logo Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Label className="text-sm font-medium mb-2">
              Brand Logo (Optional)
            </Label>
            <div className="relative">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors relative">
                {formData.brandLogoUrl || formData.brandLogo ? (
                  <img
                    src={
                      formData.brandLogoUrl ||
                      (formData.brandLogo
                        ? URL.createObjectURL(formData.brandLogo)
                        : "")
                    }
                    alt="Brand logo preview"
                    className="w-20 h-20 object-contain rounded-full"
                    onLoad={(e) => {
                      // Store the URL to prevent re-creation on re-renders
                      if (!formData.brandLogoUrl && formData.brandLogo) {
                        const objectUrl = URL.createObjectURL(
                          formData.brandLogo
                        );
                        setFormData((prev) => ({
                          ...prev,
                          brandLogoUrl: objectUrl,
                        }));
                      }
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Upload Logo</p>
                  </div>
                )}

                {/* Cancel icon - positioned absolutely */}
                {(formData.brandLogo || formData.brandLogoUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      // Revoke object URL if it exists
                      if (
                        formData.brandLogoUrl &&
                        formData.brandLogoUrl.startsWith("blob:")
                      ) {
                        URL.revokeObjectURL(formData.brandLogoUrl);
                      }
                      setFormData((prev) => ({
                        ...prev,
                        brandLogo: null,
                        brandLogoUrl: "",
                      }));
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && user) {
                    // Revoke previous object URL if it exists
                    if (
                      formData.brandLogoUrl &&
                      formData.brandLogoUrl.startsWith("blob:")
                    ) {
                      URL.revokeObjectURL(formData.brandLogoUrl);
                    }
                    setFormData((prev) => ({
                      ...prev,
                      brandLogo: file,
                      brandLogoUrl: "", // Reset URL to trigger new image load
                    }));
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brandName" className="text-sm font-medium mb-2">
                Brand Name *
              </Label>
              <Input
                id="brandName"
                placeholder="Enter your brand name"
                value={formData.brandName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    brandName: e.target.value,
                  }))
                }
                className="h-11 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-2">
                Industry / niche *
              </Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industry: value }))
                }
              >
                <SelectTrigger className="h-11 bg-gray-50 dark:bg-neutral-800 border py-5 border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-2">
                Country/Region *
              </Label>
              <Popover
                open={countrySearchOpen}
                onOpenChange={setCountrySearchOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countrySearchOpen}
                    className="h-11 w-full justify-between bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span>{selectedCountry.name}</span>
                      </div>
                    ) : (
                      "Select your country..."
                    )}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search countries..."
                      value={countrySearchValue}
                      onValueChange={setCountrySearchValue}
                    />
                    <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {filteredCountries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={`${country.name} ${country.code}`}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                country: country.code,
                              }));
                              setCountrySearchOpen(false);
                              setCountrySearchValue("");
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                            <CheckCircle2
                              className={cn(
                                "ml-auto h-4 w-4",
                                formData.country === country.code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-2">
                Language Preference
              </Label>
              <Select
                value={formData.language}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger className="h-11 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  {/* <SelectItem value="Spanish">Español</SelectItem>
                  <SelectItem value="French">Français</SelectItem>
                  <SelectItem value="German">Deutsch</SelectItem>
                  <SelectItem value="Italian">Italiano</SelectItem>
                  <SelectItem value="Portuguese">Português</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-5 h-5 text-cyan-500" />
              <Label className="text-base font-semibold">Brand Colors</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-neutral-800 dark:to-neutral-900/50  transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-md ring-2 ring-white dark:ring-neutral-800"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <Label
                    htmlFor="primaryColor"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Primary Color
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          primaryColor: e.target.value,
                        }))
                      }
                      className="w-20 h-8 rounded-md border-0 cursor-pointer shadow-inner hover:shadow-lg transition-shadow duration-200 overflow-hidden p-1"
                      style={{
                        backgroundColor: formData.primaryColor,
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    />
                  </div>
                  <Input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primaryColor: e.target.value,
                      }))
                    }
                    placeholder="#3b82f6"
                    className="h-8 flex-1 bg-white dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-600 font-mono text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Main brand color for primary elements
                </p>
              </div>
              <div className="space-y-3 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-neutral-800 dark:to-neutral-900/50  transition-all duration-200 shadow-sm hover:shadow-md">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-md ring-2 ring-white dark:ring-neutral-800"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <Label
                    htmlFor="secondaryColor"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Secondary Color
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          secondaryColor: e.target.value,
                        }))
                      }
                      className="w-20 h-8 rounded-md border-0 cursor-pointer shadow-inner hover:shadow-lg transition-shadow duration-200 overflow-hidden p-1"
                      style={{
                        backgroundColor: formData.secondaryColor,
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        appearance: "none",
                      }}
                    />
                  </div>
                  <Input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secondaryColor: e.target.value,
                      }))
                    }
                    placeholder="#8b5cf6"
                    className="h-8 flex-1 bg-white dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-600 font-mono text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Complementary color for secondary elements
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="brandDescription"
              className="text-sm font-medium mb-2"
            >
              Brand Description *
            </Label>
            <Textarea
              id="brandDescription"
              placeholder="Describe your brand, what you do, and your mission..."
              value={formData.brandDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  brandDescription: e.target.value,
                }))
              }
              className="min-h-[80px] resize-none bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogClose("brand-basics")}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleItemComplete("brand-basics")}
              disabled={
                !isItemComplete("brand-basics") ||
                savingSection === "brand-basics"
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {savingSection === "brand-basics" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : completedItems.includes("brand-basics") ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Connect Channels Dialog */}
      <ResponsiveDialog
        open={currentDialog === "connect-channels"}
        onOpenChange={(open) => !open && handleDialogClose("connect-channels")}
        title={
          <div className="flex items-center gap-2">
            {/* Add your social media URLs */}
          </div>
        }
        description=""
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium mb-2">
                Website URL (Optional)
              </Label>
              <Input
                id="website"
                placeholder="https://yourbrand.com"
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    website: e.target.value,
                  }))
                }
                className="h-11 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium mb-2">Primary Goal *</Label>
              <Select
                value={formData.primaryGoal}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, primaryGoal: value }))
                }
              >
                <SelectTrigger className="h-11 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full py-5">
                  <SelectValue placeholder="What's your main focus?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Drive Sales</SelectItem>
                  <SelectItem value="awareness">Build Awareness</SelectItem>
                  <SelectItem value="support">Customer Support</SelectItem>
                  <SelectItem value="growth">User Growth</SelectItem>
                  <SelectItem value="engagement">
                    Increase Engagement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium mb-2">
                Add Your Social Media URLs (Optional)
              </Label>
              <Badge variant="outline" className="text-xs">
                {socialMediaUrls.filter((url) => url.url.trim() !== "").length}{" "}
                added
              </Badge>
            </div>
            <div className="space-y-3">
              {channels.map((channel) => {
                const existingUrl = socialMediaUrls.find(
                  (url) => url.platform === channel.id
                );
                return (
                  <div key={channel.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-700 dark:text-gray-300">
                          {channel.icon}
                        </div>
                        <Label className="text-sm font-medium flex-1">
                          {channel.name} URL
                        </Label>
                      </div>
                      {existingUrl?.url && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder={`https://${channel.id === "instagram" ? "instagram.com" : channel.id === "twitter" || channel.id === "x" ? "x.com" : channel.id === "facebook" ? "facebook.com" : channel.id === "youtube" ? "youtube.com" : `${channel.id}.com`}/your-profile`}
                        value={existingUrl?.url || ""}
                        onChange={(e) => {
                          const url = e.target.value.trim();
                          setSocialMediaUrls((prev) => {
                            const filtered = prev.filter(
                              (u) => u.platform !== channel.id
                            );
                            if (url) {
                              return [
                                ...filtered,
                                { platform: channel.id, url },
                              ];
                            }
                            return filtered;
                          });
                        }}
                        className="h-11 bg-gray-50 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                      {existingUrl?.url && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSocialMediaUrls((prev) =>
                              prev.filter((u) => u.platform !== channel.id)
                            );
                          }}
                          className="h-11 px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground bg-neutral-50 dark:bg-neutral-900/20 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <strong>Note:</strong> Adding your social media URLs is optional
              but helps your AI designer understand your brand style and create
              content that matches your existing presence.
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleDialogClose("connect-channels")}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleItemComplete("connect-channels")}
              disabled={
                !isItemComplete("connect-channels") ||
                savingSection === "connect-channels"
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
            >
              {savingSection === "connect-channels" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : completedItems.includes("connect-channels") ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </div>
      </ResponsiveDialog>

      {/* Platform Requirements Dialog removed - now using URL inputs */}
    </section>
  );
}
