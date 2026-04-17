'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Loader2 } from 'lucide-react';
import { 
  generateAvatarVideo, 
  pollAvatarVideoStatus, 
  stitchClassVideo, 
  pollStitchStatus,
  AvatarVideoStatus 
} from '@/app/actions/avatarVideos';

export function ClassRunnerClient({ classData }: { classData: any }) {
  const [childName, setChildName] = useState('');
  const [phase, setPhase] = useState<'input' | 'processing' | 'ready'>('input');
  
  const [error, setError] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  // Individual Stage States
  const [introStatus, setIntroStatus] = useState<AvatarVideoStatus | 'idle'>('idle');
  const [outroStatus, setOutroStatus] = useState<AvatarVideoStatus | 'idle'>('idle');
  const [stitchStatus, setStitchStatus] = useState<AvatarVideoStatus | 'idle'>('idle');

  const [introData, setIntroData] = useState<{ id?: string, url?: string }>({});
  const [outroData, setOutroData] = useState<{ id?: string, url?: string }>({});

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    
    setPhase('processing');
    setError(null);
    setIntroStatus('pending');
    setOutroStatus('pending');
    setStitchStatus('idle');

    try {
      const [introRes, outroRes] = await Promise.all([
        generateAvatarVideo(childName, classData.id, 'intro', classData.intro_text),
        generateAvatarVideo(childName, classData.id, 'outro', classData.outro_text)
      ]);

      if (introRes.status === 'failed') throw new Error(introRes.error || 'Failed intro generation');
      if (outroRes.status === 'failed') throw new Error(outroRes.error || 'Failed outro generation');

      setIntroStatus(introRes.status);
      setOutroStatus(outroRes.status);
      
      setIntroData({ id: introRes.taskId, url: introRes.videoUrl });
      setOutroData({ id: outroRes.taskId, url: outroRes.videoUrl });

    } catch (err: any) {
      setError(err.message);
      setPhase('input');
    }
  };

  // Poll Intro
  useEffect(() => {
    if (introStatus === 'pending' && introData.id) {
      const interval = setInterval(async () => {
        const res = await pollAvatarVideoStatus(introData.id!);
        if (res.status === 'succeeded') {
          setIntroStatus('succeeded');
          setIntroData(prev => ({ ...prev, url: res.videoUrl }));
          clearInterval(interval);
        } else if (res.status === 'failed') {
          setIntroStatus('failed');
          setError(res.error || 'Intro failed to render');
          setPhase('input');
          clearInterval(interval);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [introStatus, introData.id]);

  // Poll Outro
  useEffect(() => {
    if (outroStatus === 'pending' && outroData.id) {
      const interval = setInterval(async () => {
        const res = await pollAvatarVideoStatus(outroData.id!);
        if (res.status === 'succeeded') {
          setOutroStatus('succeeded');
          setOutroData(prev => ({ ...prev, url: res.videoUrl }));
          clearInterval(interval);
        } else if (res.status === 'failed') {
          setOutroStatus('failed');
          setError(res.error || 'Outro failed to render');
          setPhase('input');
          clearInterval(interval);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [outroStatus, outroData.id]);

  // Trigger Stitching once both are ready
  useEffect(() => {
    if (introStatus === 'succeeded' && outroStatus === 'succeeded' && stitchStatus === 'idle') {
      if (introData.url && outroData.url) {
        setStitchStatus('pending');
        stitchClassVideo(childName, classData.id, introData.url, outroData.url, classData.core_video_url)
          .then(res => {
            if (res.status === 'failed') {
              setStitchStatus('failed');
              setError(res.error || 'Failed to start stitching process');
              setPhase('input');
            } else if (res.status === 'succeeded' && res.videoUrl) {
               setStitchStatus('succeeded');
               setFinalVideoUrl(res.videoUrl);
               setPhase('ready');
            }
          })
          .catch(err => {
            setStitchStatus('failed');
            setError(err.message);
            setPhase('input');
          });
      }
    }
  }, [introStatus, outroStatus, stitchStatus, introData.url, outroData.url, childName, classData]);

  // Poll Stitching
  useEffect(() => {
    if (stitchStatus === 'pending') {
      const interval = setInterval(async () => {
        const res = await pollStitchStatus(childName, classData.id);
        if (res.status === 'succeeded') {
          setStitchStatus('succeeded');
          setFinalVideoUrl(res.videoUrl!);
          setPhase('ready');
          clearInterval(interval);
        } else if (res.status === 'failed') {
          setStitchStatus('failed');
          setError(res.error || 'FFmpeg failed to stitch videos together.');
          setPhase('input');
          clearInterval(interval);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [stitchStatus, childName, classData]);

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-lg">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center">
              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <img src={classData.cover_art_url} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{classData.title}</h1>
              <p className="text-gray-500 mb-8">{classData.description}</p>
              
              <form onSubmit={handleStart} className="w-full">
                <div className="mb-6 text-left">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Who is taking the class today?</label>
                  <input
                    required
                    type="text"
                    value={childName}
                    onChange={e => setChildName(e.target.value)}
                    placeholder="Enter child's name (e.g. Kevin)"
                    className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 focus:border-monster-blue focus:outline-none transition-colors text-lg"
                  />
                </div>
                {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}
                <button type="submit" className="w-full bg-monster-blue text-white font-bold py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform flex justify-center items-center gap-2 text-lg">
                  <PlayCircle className="w-6 h-6" /> Start My Class!
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {phase === 'processing' && (
          <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl text-center py-12">
            <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl mb-8 relative bg-black">
              {/* Assuming loading.mp4 is available */}
              <video src="/videos/loading.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-monster-blue/20 mix-blend-overlay" />
            </div>
            
            <motion.h2 
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl font-display font-bold text-monster-blue mb-2"
            >
              We're preparing your class...
            </motion.h2>
            <p className="text-gray-500">
              Our teachers are pulling up the lesson plan just for {childName}!
            </p>

            <div className="mt-8 flex flex-col items-center gap-2 text-sm text-gray-400">
              <p>Intro {introStatus === 'pending' ? <Loader2 className="inline w-3 h-3 animate-spin"/> : introStatus}</p>
              <p>Outro {outroStatus === 'pending' ? <Loader2 className="inline w-3 h-3 animate-spin"/> : outroStatus}</p>
              <p>Stitching {stitchStatus === 'pending' ? <Loader2 className="inline w-3 h-3 animate-spin"/> : stitchStatus}</p>
            </div>
          </motion.div>
        )}

        {phase === 'ready' && finalVideoUrl && (
          <motion.div key="ready" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full pb-20">
            <div className="aspect-video w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black mb-8 border border-gray-200">
              <video src={finalVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{classData.title}</h1>
              <p className="text-xl text-gray-600 mb-8">{classData.description}</p>
              <div className="bg-monster-blue/5 border border-monster-blue/10 rounded-2xl p-6 text-monster-blue">
                <p className="font-semibold text-lg">✨ Have fun creating, {childName}! Remember to share your art to the gallery when you're done!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
