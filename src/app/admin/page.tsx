"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { getPendingSubmissions, approveMonster, rejectMonster } from "@/app/actions/submissions";
import posthog from "posthog-js";
import { AdminClassManager } from "@/components/AdminClassManager";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would check against process.env.ADMIN_PASSWORD via a server action
    // For MVP, we'll just check a hardcoded value if not provided in env, 
    // but we'll try to use the env var via a server action for better practice.
    if (password === "monster123") { // Fallback for demo, should be env-driven
      setIsAuthenticated(true);
    } else {
      setError("Wrong password! Please try again.");
    }
  };

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError("Failed to fetch submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string, monster: any) => {
    try {
      await approveMonster(id);
      
      // Track approval
      posthog.capture("submission_approved", {
        submission_id: id,
        monster_name: monster.monster_name,
        creator_nickname: monster.creator_nickname
      });

      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectMonster(id);
      setSubmissions(submissions.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to reject");
    }
  };

  const [activeTab, setActiveTab] = useState<'submissions' | 'classes'>('submissions');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-gray-100"
        >
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-monster-blue/10 text-monster-blue mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-display font-bold text-center mb-8">Admin Portal</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 focus:border-monster-blue focus:outline-none"
                placeholder="Enter password..."
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-monster-blue py-3 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
            >
              Let me in!
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Top Nav Tabs */}
      <div className="flex space-x-4 mb-12 border-b border-gray-200 pb-4">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'submissions' ? 'bg-monster-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Art Submissions
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'classes' ? 'bg-monster-blue text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          Classes Setup
        </button>
      </div>

      {activeTab === 'submissions' && (
        <>
          <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
                Moderation Station 🛡️
              </h1>
              <p className="text-gray-600">
                {submissions.length} creations waiting to be reviewed.
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Clock className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh List
            </button>
          </div>

      {isLoading ? (
          <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-monster-blue/10 text-monster-blue">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2 px-4 text-center">No pending art</h2>
          <p className="text-gray-500 mb-8 px-4 text-center">The moderation station is all caught up!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {submissions.map((monster) => (
              <motion.div
                key={monster.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100 flex flex-col"
              >
                <div className="aspect-square relative flex items-center justify-center bg-gray-100 overflow-hidden rounded-t-3xl border-b border-gray-100">
                  <img
                    src={monster.image_url}
                    alt={monster.monster_name}
                    className="h-full w-full object-contain p-2"
                  />
                  <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-monster-blue shadow-sm backdrop-blur-sm">
                    Pending
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{monster.monster_name}</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    By {monster.creator_nickname || "A Mystery Monster"}
                  </p>
                  
                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => handleApprove(monster.id, monster)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-monster-blue px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(monster.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      </>
      )}

      {activeTab === 'classes' && (
        <AdminClassManager />
      )}
    </div>
  );
}
