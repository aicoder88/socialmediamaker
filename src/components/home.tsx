import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  User,
} from "lucide-react";
import ContentCreator from "./Dashboard/ContentCreator";
import RecentSubmissions from "./Dashboard/RecentSubmissions";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("create");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.div
          className="h-full bg-gray-900/50 backdrop-blur-xl border-r border-white/10"
          initial={{ width: isSidebarOpen ? "240px" : "72px" }}
          animate={{ width: isSidebarOpen ? "240px" : "72px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            {isSidebarOpen ? (
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <span className="font-bold text-lg">Social Hub</span>
              </div>
            ) : (
              <Sparkles className="h-6 w-6 text-purple-400 mx-auto" />
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="py-6">
            <nav>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab("create")}
                    className={`w-full flex items-center px-4 py-2 ${activeTab === "create" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"} rounded-lg transition-colors`}
                  >
                    <div className="flex items-center">
                      <ChevronRight size={18} className="mr-2" />
                      {isSidebarOpen && <span>Create Content</span>}
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("submissions")}
                    className={`w-full flex items-center px-4 py-2 ${activeTab === "submissions" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"} rounded-lg transition-colors`}
                  >
                    <div className="flex items-center">
                      <ChevronRight size={18} className="mr-2" />
                      {isSidebarOpen && <span>Recent Submissions</span>}
                    </div>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="h-16 border-b border-white/10 bg-gray-900/50 backdrop-blur-xl flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">
              {activeTab === "create"
                ? "Content Creator"
                : "Recent Submissions"}
            </h1>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Bell size={20} className="text-gray-400" />
              </button>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <Settings size={20} className="text-gray-400" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </header>

          {/* Content area */}
          <div className="p-6">
            {activeTab === "create" ? (
              <ContentCreator />
            ) : (
              <RecentSubmissions />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
