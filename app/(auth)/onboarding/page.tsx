"use client";

import { useState, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    description: "Connect your Instagram Business",
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

const agentTypes: AgentType[] = [
  {
    id: "social",
    name: "Social Media Manager",
    icon: Users,
    description: "Manage your social presence and engagement",
    isPro: true,
  },
  {
    id: "support",
    name: "Customer Support",
    icon: Headphones,
    description: "Handle customer inquiries and support tickets",
    isPro: true,
  },
  {
    id: "content",
    name: "Content Writer",
    icon: PenTool,
    description: "Create compelling content for your brand",
  },
  {
    id: "ads",
    name: "Ads Manager",
    icon: MegaphoneIcon,
    description: "Optimize and manage your advertising campaigns",
    isPro: true,
  },
  {
    id: "growth",
    name: "Growth Specialist",
    icon: TrendingUp,
    description: "Drive user acquisition and retention",
    isPro: true,
  },
  {
    id: "designer",
    name: "AI Graphic Designer",
    icon: Palette,
    description: "Create stunning visuals and graphics for your brand",
    comingSoon: true,
    isPro: true,
  },
];

const checklistItems = [
  {
    id: "brand-basics",
    title: "Set up your brand profile",
    description:
      "Add your brand name, industry, country, and language preferences",
    icon: Users,
  },
  {
    id: "connect-channels",
    title: "Connect your social accounts",
    description:
      "Authenticate your social media platforms for AI-powered management",
    icon: Settings,
  },
  {
    id: "create-agent",
    title: "Create your first AI agent",
    description:
      "Set up your AI assistant to handle specific tasks for your brand",
    icon: Bot,
  },
  {
    id: "launch",
    title: "Launch your AI workforce",
    description:
      "Go live with your AI agents and start automating your workflows",
    icon: Rocket,
  },
];

export default function BrandOnboardingChecklist() {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [currentDialog, setCurrentDialog] = useState<string | null>(null);
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
  });
  const [authenticatedChannels, setAuthenticatedChannels] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [countrySearchOpen, setCountrySearchOpen] = useState(false);
  const [countrySearchValue, setCountrySearchValue] = useState("");

  const handleChannelAuth = async (channelId: string) => {
    setLoading((prev) => ({ ...prev, [channelId]: true }));

    // Simulate authentication process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setAuthenticatedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );

    setLoading((prev) => ({ ...prev, [channelId]: false }));
  };

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
        return formData.primaryGoal && authenticatedChannels.length > 0;
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

  const handleItemComplete = (itemId: string) => {
    if (isItemComplete(itemId) && !completedItems.includes(itemId)) {
      setCompletedItems((prev) => [...prev, itemId]);
    }
    handleDialogClose(itemId);
  };

  const canStartItem = (itemId: string) => {
    switch (itemId) {
      case "brand-basics":
        return true;
      case "connect-channels":
        return completedItems.includes("brand-basics");
      case "create-agent":
        return completedItems.includes("connect-channels");
      case "launch":
        return completedItems.includes("create-agent");
      default:
        return false;
    }
  };

  const completedCount = completedItems.length;
  const totalCount = checklistItems.length;

  return (
    <section className="bg-BackgroundLight dark:bg-BackgroundDark">
      <div className="container max-w-none flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-[506px] flex-col items-center justify-center gap-6 px-2">
          <div className="flex justify-center items-center mt-6">
            <Logo className="w-14 h-14" />
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gennit
            </h1>
          </div>

          <div className="w-full max-w-4xl space-y-2 border border-gray-200 dark:border-neutral-800 py-4 px-6 rounded-xl shadow-sm bg-BackgroundLight2 dark:bg-neutral-900">
            <div className="flex flex-col items-center gap-3 mb-3">
              <span className="text-2xl font-bold">Brand Onboarding</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {completedCount} of {totalCount} completed
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-4">
              {checklistItems.map((item, index) => (
                <Card
                  key={item.id}
                  className={cn(
                    "flex w-full items-center gap-4 border bg-white dark:bg-neutral-800 p-4 shadow-sm hover:shadow-md transition-all duration-200",
                    completedItems.includes(item.id)
                      ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20"
                      : canStartItem(item.id)
                      ? "border-gray-200 dark:border-neutral-700 hover:border-cyan-300 dark:hover:border-cyan-600"
                      : "border-gray-200 dark:border-neutral-700 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                      completedItems.includes(item.id)
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-neutral-900 dark:bg-neutral-800"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-6 h-6 transition-colors",
                        completedItems.includes(item.id)
                          ? "text-green-600 dark:text-green-400"
                          : "text-white dark:text-gray-300"
                      )}
                    />
                  </div>

                  <div className="flex grow shrink-0 basis-0 flex-col items-start justify-center">
                    <span className="w-full text-sm font-semibold text-foreground">
                      {item.title}
                    </span>
                    <span className="w-full text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>

                  {completedItems.includes(item.id) ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button
                      onClick={() => handleDialogOpen(item.id)}
                      disabled={!canStartItem(item.id)}
                      size="sm"
                      className={cn(
                        "transition-all duration-300 ease-out transform hover:scale-105 active:scale-95",
                        canStartItem(item.id)
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-200 dark:bg-neutral-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {canStartItem(item.id) ? (
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

            <div className="flex items-center gap-2 mt-6">
              <Button
                size="lg"
                disabled={completedCount < totalCount}
                className={cn(
                  "w-full transition-all duration-300 ease-out transform hover:scale-105 active:scale-95",
                  completedCount === totalCount
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white opacity-50 cursor-not-allowed"
                )}
              >
                {completedCount === totalCount ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Complete All Steps
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 max-w-[26rem] w-full space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            This site is protected by reCAPTCHA and subject to the Klipto{" "}
            <a
              href="#"
              className="text-TextLight1 dark:text-TextDark1 underline hover:no-underline"
            >
              Privacy
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
              Klipto Inc.
            </a>{" "}
            All rights reserved.
          </p>
        </div>
      </div>

      {/* Brand Basics Dialog */}
      <Dialog
        open={currentDialog === "brand-basics"}
        onOpenChange={(open) => !open && handleDialogClose("brand-basics")}
      >
        <DialogContent className="mx-2 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-500" />
              Set up your brand profile
            </DialogTitle>
            <DialogDescription>
              Tell us about your brand so we can personalize your AI experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Brand Logo Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Label className="text-sm font-medium mb-2">
                Brand Logo (Optional)
              </Label>
              <div className="relative">
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors">
                  {formData.brandLogo ? (
                    <img
                      src={URL.createObjectURL(formData.brandLogo)}
                      alt="Brand logo preview"
                      className="w-20 h-20 object-contain rounded"
                    />
                  ) : (
                    <div className="text-center">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Upload Logo</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, brandLogo: file }));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {formData.brandLogo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, brandLogo: null }))
                  }
                  className="text-red-600 hover:text-red-700"
                >
                  Remove Logo
                </Button>
              )}
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
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium mb-2">Industry *</Label>
                <Select
                  value={formData.industry}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, industry: value }))
                  }
                >
                  <SelectTrigger className="h-11">
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
                      className="h-11 w-full justify-between"
                    >
                      {selectedCountry ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {selectedCountry.flag}
                          </span>
                          <span>{selectedCountry.name}</span>
                        </div>
                      ) : (
                        "Select your country..."
                      )}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search countries..."
                        value={countrySearchValue}
                        onValueChange={setCountrySearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                          {filteredCountries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.code}
                              onSelect={(value: string) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  country: value,
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
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Español</SelectItem>
                    <SelectItem value="French">Français</SelectItem>
                    <SelectItem value="German">Deutsch</SelectItem>
                    <SelectItem value="Italian">Italiano</SelectItem>
                    <SelectItem value="Portuguese">Português</SelectItem>
                  </SelectContent>
                </Select>
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
                className="min-h-[80px] resize-none"
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
                disabled={!isItemComplete("brand-basics")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Connect Channels Dialog */}
      <Dialog
        open={currentDialog === "connect-channels"}
        onOpenChange={(open) => !open && handleDialogClose("connect-channels")}
      >
        <DialogContent className="mx-2 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-500" />
              Connect your social accounts
            </DialogTitle>
            <DialogDescription>
              Connect your social media platforms to enable AI-powered
              management and automation.
            </DialogDescription>
          </DialogHeader>
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
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium mb-2">
                  Primary Goal *
                </Label>
                <Select
                  value={formData.primaryGoal}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, primaryGoal: value }))
                  }
                >
                  <SelectTrigger className="h-11">
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
                  Connect Your Social Accounts *
                </Label>
                <Badge variant="outline" className="text-xs">
                  {authenticatedChannels.length} connected
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((channel) => (
                  <Card
                    key={channel.id}
                    className={`px-4 py-2 transition-all duration-200 ${
                      authenticatedChannels.includes(channel.id)
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-neutral-700 hover:border-cyan-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-700 dark:text-gray-300">
                          {channel.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">
                            {channel.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleChannelAuth(channel.id)}
                        disabled={loading[channel.id]}
                        size="sm"
                        className={
                          authenticatedChannels.includes(channel.id)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                        }
                      >
                        {loading[channel.id] ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Connecting
                          </div>
                        ) : authenticatedChannels.includes(channel.id) ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected
                          </div>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
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
                disabled={!isItemComplete("connect-channels")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Complete Setup
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Agent Dialog */}
      <Dialog
        open={currentDialog === "create-agent"}
        onOpenChange={(open) => !open && handleDialogClose("create-agent")}
      >
        <DialogContent className="mx-2 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-500" />
              Create your first AI agent
            </DialogTitle>
            <DialogDescription>
              Set up your AI assistant to handle specific tasks for your brand.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium mb-2">Agent Type *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agentTypes.map((agent) => (
                  <Card
                    key={agent.id}
                    className={cn(
                      "p-4 transition-all duration-200 relative",
                      agent.comingSoon
                        ? "cursor-not-allowed opacity-60 border-gray-200 dark:border-neutral-700"
                        : agent.isPro
                        ? "cursor-pointer border-yellow-300 dark:border-yellow-600 bg-yellow-50/30 dark:bg-yellow-900/10 hover:border-yellow-400"
                        : formData.agentType === agent.id
                        ? "cursor-pointer border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                        : "cursor-pointer border-gray-200 dark:border-neutral-700 hover:border-cyan-300"
                    )}
                    onClick={() => {
                      if (!agent.comingSoon) {
                        setFormData((prev) => ({
                          ...prev,
                          agentType: agent.id,
                        }));
                      }
                    }}
                  >
                    {agent.comingSoon && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                        Coming Soon
                      </Badge>
                    )}
                    {agent.isPro && !agent.comingSoon && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                    <div className="flex items-start gap-3">
                      <agent.icon
                        className={cn(
                          "w-6 h-6 mt-1",
                          agent.comingSoon
                            ? "text-gray-400 dark:text-gray-500"
                            : agent.isPro
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-cyan-500"
                        )}
                      />
                      <div className="flex-1">
                        <h3
                          className={cn(
                            "font-medium text-sm",
                            agent.comingSoon &&
                              "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {agent.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {agent.description}
                        </p>
                      </div>
                      {!agent.comingSoon && (
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2",
                            formData.agentType === agent.id
                              ? "bg-cyan-500 border-cyan-500"
                              : "border-gray-300 dark:border-neutral-600"
                          )}
                        >
                          {formData.agentType === agent.id && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="agentName" className="text-sm font-medium mb-2">
                  Agent Name *
                </Label>
                <Input
                  id="agentName"
                  placeholder="e.g., Luna, Alex, Maya"
                  value={formData.agentName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      agentName: e.target.value,
                    }))
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="agentDescription"
                  className="text-sm font-medium mb-2"
                >
                  Agent Description *
                </Label>
                <Input
                  id="agentDescription"
                  placeholder="e.g., Manages Instagram content and engagement"
                  value={formData.agentDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      agentDescription: e.target.value,
                    }))
                  }
                  className="h-11"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleDialogClose("create-agent")}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleItemComplete("create-agent")}
                disabled={!isItemComplete("create-agent")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                Create Agent
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Launch Dialog */}
      <Dialog
        open={currentDialog === "launch"}
        onOpenChange={(open) => !open && handleDialogClose("launch")}
      >
        <DialogContent className="mx-2 max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <img
                src="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6839.jpg"
                className="h-36 w-36 rounded-full"
                alt="enterbox logo"
                height={200}
                width={200}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Ready to Launch Your AI Workforce!
              </h3>
              <p className="text-muted-foreground">
                Your brand setup is complete. Click below to activate your AI
                agents and start automating your workflows.
              </p>
            </div>

            <Card className="p-6 text-left border border-gray-200 dark:border-neutral-700">
              <h4 className="font-medium mb-3">Setup Summary:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Brand:</span>
                  <div className="flex items-center gap-2">
                    {formData.brandLogo && (
                      <img
                        src={URL.createObjectURL(formData.brandLogo)}
                        alt="Brand logo"
                        className="w-6 h-6 object-contain rounded"
                      />
                    )}
                    <span className="font-medium">{formData.brandName}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry:</span>
                  <span className="font-medium">{formData.industry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Description:</span>
                  <span
                    className="font-medium max-w-[200px] truncate"
                    title={formData.brandDescription}
                  >
                    {formData.brandDescription}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Goal:</span>
                  <span className="font-medium capitalize">
                    {formData.primaryGoal?.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Connected Accounts:
                  </span>
                  <span className="font-medium">
                    {authenticatedChannels.length} platforms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Agent:</span>
                  <span className="font-medium">{formData.agentName}</span>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => handleDialogClose("launch")}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleItemComplete("launch")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                size="lg"
              >
                Launch AI Workforce
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
