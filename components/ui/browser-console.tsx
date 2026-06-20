"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  id: number;
  message: string;
  timestamp: Date;
  level: LogLevel;
  source?: string;
}

// Create a global event name for logging
const LOG_EVENT_NAME = "app-console-log";

// Create a global function to log from anywhere
declare global {
  interface Window {
    appConsoleLog: (message: string, level?: LogLevel, source?: string) => void;
  }
}

export default function BrowserConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const nextLogId = useRef(1);

  // Initialize the console and set up event listeners
  useEffect(() => {
    // Load existing logs from localStorage
    const savedLogs = localStorage.getItem("app-console-logs");
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        // Convert string timestamps back to Date objects
        const processedLogs = parsedLogs.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        setLogs(processedLogs);
        nextLogId.current =
          Math.max(...processedLogs.map((log: LogEntry) => log.id), 0) + 1;
      } catch (e) {
        console.error("Failed to parse saved logs", e);
      }
    }

    // Define the global logging function
    window.appConsoleLog = (message, level = "info", source) => {
      const event = new CustomEvent(LOG_EVENT_NAME, {
        detail: { message, level, source },
      });
      window.dispatchEvent(event);
    };

    // Listen for log events
    const handleLogEvent = (event: CustomEvent) => {
      const { message, level, source } = event.detail;
      addLog(message, level, source);
    };

    window.addEventListener(LOG_EVENT_NAME, handleLogEvent as EventListener);

    // Clean up
    return () => {
      window.removeEventListener(
        LOG_EVENT_NAME,
        handleLogEvent as EventListener
      );
    };
  }, []);

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("app-console-logs", JSON.stringify(logs));
  }, [logs]);

  // Function to add a new log entry
  const addLog = (
    message: string,
    level: LogLevel = "info",
    source?: string
  ) => {
    const newLog = {
      id: nextLogId.current++,
      message,
      timestamp: new Date(),
      level,
      source,
    };
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem("app-console-logs");
  };

  // Auto-scroll to the bottom when new logs are added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className='w-full'>
      <div className='flex flex-col overflow-hidden shadow-xs'>
        {/* Console header */}
        <div className='flex items-center justify-between bg-gray-100 px-4 py-2 dark:bg-[#27272A]'>
          <div className='flex items-center'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
            <h3 className='font-mono text-sm font-medium'>Console</h3>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={clearLogs}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              title='Clear console'
            >
              <Trash2 className='h-4 w-4' />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              title='Close console'
            >
              <X className='h-4 w-4' />
            </button>
          </div>
        </div>

        {/* Console content */}
        {isExpanded && (
          <div className='h-full overflow-y-auto font-mono text-sm text-gray-100'>
            {logs.length === 0 ? (
              <div className='p-4 text-gray-500 italic'>No logs to display</div>
            ) : (
              <div className='p-1'>
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className={`border-b border-gray-800 px-4 py-1 ${
                      log.level === "error"
                        ? "bg-red-900/20 text-red-300"
                        : log.level === "warn"
                          ? "bg-yellow-900/20 text-yellow-300"
                          : ""
                    }`}
                  >
                    <span className='mr-2 text-gray-500'>
                      {formatTime(log.timestamp)}
                    </span>
                    {log.source && (
                      <span className='mr-2 text-blue-400'>[{log.source}]</span>
                    )}
                    <span>{log.message}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
