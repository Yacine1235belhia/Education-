import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X, Send, Heart, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const RatingModal = ({ isOpen, onClose, onSubmit }: RatingModalProps) => {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(rating, comment);
    }, 1500);
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
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-4 sm:p-6"
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="bg-white dark:bg-[#050505] rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              {!isSubmitted ? (
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={onClose}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white mt-4">{t('farewell')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed text-sm">
                      {t('feedback_msg')}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 py-4 shadow-inner bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="p-2 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-12 h-12 transition-all ${
                            star <= (hoveredRating || rating)
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                      <span>{t('suggestions')}</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('feedback_placeholder') as string}
                      className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-right placeholder-slate-400 text-slate-700 dark:text-slate-200"
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full p-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)]"
                  >
                    <span>{t('submit_feedback')}</span>
                    <Send className={cn("w-5 h-5", i18n.language === 'ar' ? "-scale-x-100" : "")} />
                  </button>
                </div>
              ) : (
                <div className="relative z-10 py-12 text-center space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Star className="w-12 h-12 text-emerald-500 fill-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white">{t('thanks_feedback')}</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">
                    {t('logging_out')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
