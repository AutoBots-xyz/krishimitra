import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/shared/LanguageProvider";

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (messages: any[]) => void;
}

export default function ChatHistorySidebar({ isOpen, onClose, onSelectSession }: ChatHistorySidebarProps) {
  const { language } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) return;

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at')
        .eq('farmer_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (err) {
      console.error("Failed to load sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setLoadingSessionId(sessionId);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        onSelectSession(data);
        onClose();
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoadingSessionId(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-primary/10"
          >
            <div className="flex items-center justify-between p-6 border-b border-primary/5">
              <h2 className="font-display text-2xl text-primary font-bold">
                {language === 'hi' ? "चैट हिस्ट्री" : "Chat History"}
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin text-primary/50" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-10 text-muted">
                  {language === 'hi' ? "कोई सुरक्षित चैट नहीं मिली।" : "No saved chats found."}
                </div>
              ) : (
                sessions.map(session => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    disabled={loadingSessionId !== null}
                    className="w-full text-left p-4 rounded-xl border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        {loadingSessionId === session.id ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text text-[15px] leading-tight truncate group-hover:text-primary transition-colors">
                          {session.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted">
                          <Clock className="w-3 h-3" />
                          {new Date(session.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
