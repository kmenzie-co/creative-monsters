'use client';

import React, { useState, useEffect } from 'react';
import { 
  generateAvatarVideo, 
  pollAvatarVideoStatus, 
  stitchClassVideo, 
  pollStitchStatus,
  AvatarVideoStatus 
} from '@/app/actions/avatarVideos';

export default function TestAvatarPage() {
  const [childName, setChildName] = useState('Kevin');
  
  // Overall Pipeline State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  // Individual Stage States
  const [introStatus, setIntroStatus] = useState<AvatarVideoStatus | 'idle'>('idle');
  const [outroStatus, setOutroStatus] = useState<AvatarVideoStatus | 'idle'>('idle');
  const [stitchStatus, setStitchStatus] = useState<AvatarVideoStatus | 'idle'>('idle');

  const [introData, setIntroData] = useState<{ id?: string, url?: string }>({});
  const [outroData, setOutroData] = useState<{ id?: string, url?: string }>({});

  const handleGenerate = async () => {
    if (!childName.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setFinalVideoUrl(null);
    setIntroStatus('pending');
    setOutroStatus('pending');
    setStitchStatus('idle');

    try {
      // Launch both Intro and Outro in parallel
      const [introRes, outroRes] = await Promise.all([
        generateAvatarVideo(childName, 'intro'),
        generateAvatarVideo(childName, 'outro')
      ]);

      if (introRes.status === 'failed') throw new Error(introRes.error || 'Failed intro generation');
      if (outroRes.status === 'failed') throw new Error(outroRes.error || 'Failed outro generation');

      setIntroStatus(introRes.status);
      setOutroStatus(outroRes.status);
      
      setIntroData({ id: introRes.taskId, url: introRes.videoUrl });
      setOutroData({ id: outroRes.taskId, url: outroRes.videoUrl });

    } catch (err: any) {
      setError(err.message);
      setIsProcessing(false);
      setIntroStatus('failed');
      setOutroStatus('failed');
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
        stitchClassVideo(childName, introData.url, outroData.url)
          .then(res => {
            if (res.status === 'failed') {
              setStitchStatus('failed');
              setError(res.error || 'Failed to start stitching process');
            } else if (res.status === 'succeeded' && res.videoUrl) {
               // Fast-path if previously cached!
               setStitchStatus('succeeded');
               setFinalVideoUrl(res.videoUrl);
               setIsProcessing(false);
            }
          })
          .catch(err => {
            setStitchStatus('failed');
            setError(err.message);
          });
      }
    }
  }, [introStatus, outroStatus, stitchStatus, introData.url, outroData.url, childName]);

  // Poll Stitching
  useEffect(() => {
    if (stitchStatus === 'pending') {
      const interval = setInterval(async () => {
        const res = await pollStitchStatus(childName);
        if (res.status === 'succeeded') {
          setStitchStatus('succeeded');
          setFinalVideoUrl(res.videoUrl!);
          setIsProcessing(false);
          clearInterval(interval);
        } else if (res.status === 'failed') {
          setStitchStatus('failed');
          setError(res.error || 'FFmpeg failed to stitch videos together (Ensure core.mp4 exists in public/videos)');
          setIsProcessing(false);
          clearInterval(interval);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [stitchStatus, childName]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-100">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-white text-center">Full Class Generator</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-400 mb-2">Child Name</label>
          <input 
            type="text" 
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isProcessing}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing || !childName.trim()}
          className={`w-full py-3 rounded-lg font-semibold transition-all shadow-md ${
            isProcessing || !childName.trim()
              ? 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isProcessing ? 'Processing Pipeline...' : 'Generate Full Video'}
        </button>

        <div className="mt-6 flex flex-col gap-2">
          {introStatus !== 'idle' && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Runway Intro:</span>
              <span className={
                introStatus === 'succeeded' ? 'text-green-400' : 
                introStatus === 'failed' ? 'text-red-400 animate-pulse' : 'text-yellow-400 animate-pulse'
              }>
                {introStatus}
              </span>
            </div>
          )}
          
          {outroStatus !== 'idle' && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Runway Outro:</span>
              <span className={
                outroStatus === 'succeeded' ? 'text-green-400' : 
                outroStatus === 'failed' ? 'text-red-400 animate-pulse' : 'text-yellow-400 animate-pulse'
              }>
                {outroStatus}
              </span>
            </div>
          )}

          {stitchStatus !== 'idle' && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">FFmpeg Stitch:</span>
              <span className={
                stitchStatus === 'succeeded' ? 'text-green-400' : 
                stitchStatus === 'failed' ? 'text-red-400 animate-pulse' : 'text-blue-400 animate-pulse'
              }>
                {stitchStatus}
              </span>
            </div>
          )}
        </div>

        {finalVideoUrl && (
          <div className="mt-6">
            <p className="text-green-400 font-semibold mb-3 text-center">Video Ready!</p>
            <video 
              src={finalVideoUrl} 
              controls 
              autoPlay 
              className="w-full rounded-lg shadow-lg border border-neutral-700 aspect-video object-cover" 
            />
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
