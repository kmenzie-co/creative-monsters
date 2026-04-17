'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Film, CheckCircle2, Loader2, X } from 'lucide-react';
import { createClass, deleteClass, getClasses } from '@/app/actions/classes';
import { supabase } from '@/lib/supabase';

export function AdminClassManager() {
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [introText, setIntroText] = useState('Hello [name]! It\'s great to see you! Today, we\'re going to learn how to draw a dinosaur together. All you need is some paper and something to draw with like a pencil, marker, or crayons. Let\'s get going!');
  const [outroText, setOutroText] = useState('I had so much fun drawing with you today, [name]! I hope to see you again soon!');
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    const data = await getClasses();
    setClasses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class? Assets will remain in storage but the class will be unlisted.')) return;
    const res = await deleteClass(id);
    if (!res.error) {
      setClasses(classes.filter(c => c.id !== id));
    } else {
      alert(res.error);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `class_assets/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('Classes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('Classes')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverArtFile || !videoFile) {
      setError('Please upload both cover art and a core video file.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const coverArtUrl = await uploadToSupabase(coverArtFile);
      const coreVideoUrl = await uploadToSupabase(videoFile);

      const res = await createClass({
        title,
        description,
        intro_text: introText,
        outro_text: outroText,
        cover_art_url: coverArtUrl,
        core_video_url: coreVideoUrl
      });

      if (res.error) throw new Error(res.error);

      // Reset and refresh
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setCoverArtFile(null);
      setVideoFile(null);
      await fetchClasses();

    } catch (err: any) {
      console.error(err);
      setError(`Failed to save class: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCreating) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Class</h2>
          <button onClick={() => setIsCreating(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X className="w-5 h-5"/></button>
        </div>

        <form onSubmit={handleCreateSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border-2 rounded-xl px-4 py-2" placeholder="e.g. Draw a Dinosaur!"/>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border-2 rounded-xl px-4 py-2 min-h-[100px]" placeholder="Brief explanation of the lesson..."/>
          </div>

          <div className="bg-gray-50 p-4 border rounded-xl space-y-4">
            <h4 className="font-semibold text-gray-700">Dynamic Script Layout</h4>
            <p className="text-xs text-gray-500 mb-2">Use <code className="bg-white px-1">{"[name]"}</code> to inject the child's name into the Avatar voice generation!</p>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500">Intro AI Text</label>
              <textarea required value={introText} onChange={e => setIntroText(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm h-20"/>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500">Outro AI Text</label>
              <textarea required value={outroText} onChange={e => setOutroText(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm h-12"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Cover Art Image</label>
              <input required type="file" accept="image/*" onChange={e => setCoverArtFile(e.target.files?.[0] || null)} className="w-full text-sm block"/>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Core Lesson Video</label>
              <input required type="file" accept="video/mp4,video/quicktime" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="w-full text-sm block"/>
            </div>
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <button disabled={isSubmitting} type="submit" className="w-full bg-monster-blue text-white font-bold py-3 rounded-xl hover:bg-opacity-90 flex justify-center items-center gap-2">
            {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Save Class'}
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Classes</h2>
          <p className="text-gray-500 text-sm mt-1">Add, remove, and define generative scripts.</p>
        </div>
        <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 bg-monster-blue text-white px-4 py-2 rounded-full font-bold shadow hover:scale-105 transition">
          <Plus className="w-4 h-4"/> New Class
        </button>
      </div>

      {isLoading ? <p>Loading classes...</p> : classes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
          <Film className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-600">No classes yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {classes.map(c => (
              <motion.div key={c.id} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, scale: 0.9}} className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col">
                <div className="aspect-video bg-gray-200 relative">
                  <img src={c.cover_art_url} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 flex-1">{c.description}</p>
                  <button onClick={() => handleDelete(c.id)} className="mt-4 flex justify-center items-center gap-2 w-full py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
