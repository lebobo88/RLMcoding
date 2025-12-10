'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { ShootCard } from '@/components/generator';
import { useGeneratorStore } from '@/stores/generator';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function GeneratePage() {
  const {
    currentCard,
    isGenerating,
    error,
    generate,
    clearError,
  } = useGeneratorStore();

  const prefersReducedMotion = useReducedMotion();

  const handleGenerate = async () => {
    clearError();
    await generate();
  };

  return (
    <main id="main-content" className="min-h-screen bg-charcoal-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-label tracking-[0.2em] text-copper-primary hover:text-copper-light transition-colors"
          >
            PHOTOMUSE
          </Link>
          <Button variant="ghost" size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {currentCard ? 'New Idea' : 'Generate'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero / Empty State */}
          <AnimatePresence mode="wait">
            {!currentCard && !isGenerating && (
              <motion.div
                key="empty"
                className="text-center py-32"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="font-display text-display-m md:text-display-l text-slate-100 mb-4">
                  Ready for inspiration?
                </h1>
                <p className="text-body-l text-slate-400 mb-10 max-w-lg mx-auto">
                  Click the button below to generate a unique photography shoot concept.
                </p>

                <Button
                  size="lg"
                  onClick={handleGenerate}
                  className="group"
                >
                  <span className="mr-2">✨</span>
                  <span>Inspire Me</span>
                </Button>

                {/* Error Display */}
                {error && (
                  <motion.div
                    className="mt-8 p-4 bg-semantic-error/10 border border-semantic-error/20 rounded-lg text-semantic-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-body-m">{error}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-semantic-error hover:text-semantic-error/80"
                      onClick={handleGenerate}
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {isGenerating && (
              <motion.div
                key="loading"
                className="text-center py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingOrb prefersReducedMotion={prefersReducedMotion} />
                <p className="text-body-l text-slate-400 mt-8">
                  Crafting your vision...
                </p>
              </motion.div>
            )}

            {/* Card Display */}
            {currentCard && !isGenerating && (
              <motion.div
                key="card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ShootCard card={currentCard} />

                {/* Generate Another */}
                <div className="mt-8 text-center">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    Generate Another Idea
                  </Button>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    className="mt-8 p-4 bg-semantic-error/10 border border-semantic-error/20 rounded-lg text-semantic-error text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-body-m">{error}</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

/**
 * Loading animation component
 */
function LoadingOrb({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  if (prefersReducedMotion) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-2 border-copper-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Outer rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-copper-primary/20"
          style={{ scale: 1 - i * 0.15 }}
          animate={{
            scale: [1 - i * 0.15, 1.1 - i * 0.1, 1 - i * 0.15],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-copper-primary"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
