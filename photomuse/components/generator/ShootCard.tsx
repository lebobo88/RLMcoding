'use client';

import { type FC } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { ShootCard as ShootCardType } from '@/types/shoot-card';
import { CHALLENGE_DESCRIPTIONS } from '@/types/shoot-card';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils/cn';

interface ShootCardProps {
  card: ShootCardType;
  className?: string;
}

/**
 * Main shoot card display component
 */
export const ShootCard: FC<ShootCardProps> = ({ card, className }) => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants | undefined = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const itemVariants: Variants | undefined = prefersReducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: 'easeOut' },
        },
      };

  return (
    <motion.article
      className={cn(
        'bg-charcoal-900 rounded-2xl p-8 md:p-10 border border-charcoal-800',
        'shadow-elevation-3',
        className
      )}
      role="article"
      aria-label={`Shoot concept: ${card.title}`}
      initial={prefersReducedMotion ? undefined : 'hidden'}
      animate={prefersReducedMotion ? undefined : 'visible'}
      variants={containerVariants}
    >
      {/* Title */}
      <motion.h2
        className="font-display text-display-m md:text-display-l text-slate-100 mb-4"
        variants={itemVariants}
      >
        {card.title}
      </motion.h2>

      {/* Description */}
      <motion.p
        className="text-body-l text-slate-300 mb-8 leading-relaxed"
        variants={itemVariants}
      >
        {card.description}
      </motion.p>

      {/* AI Generated Concept Image */}
      {card.generatedImage && (
        <motion.div className="mb-8" variants={itemVariants}>
          <h3 className="text-heading-s text-slate-100 mb-4 flex items-center gap-2">
            <span>AI Concept Visualization</span>
            <span className="text-label text-copper-primary bg-copper-primary/10 px-2 py-0.5 rounded">
              Generated
            </span>
          </h3>
          <div className="relative rounded-xl overflow-hidden border border-charcoal-700 shadow-elevation-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.generatedImage.dataUrl}
              alt={`AI-generated concept visualization for: ${card.title}`}
              className="w-full h-auto max-h-[500px] object-contain bg-charcoal-950"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal-950/90 to-transparent p-4">
              <p className="text-label text-slate-400">
                AI-generated concept based on your photography idea
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Info Grid */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        variants={itemVariants}
      >
        <InfoCard label="Subject" value={card.subject} />
        <InfoCard label="Mood" value={card.mood} />
        <InfoCard label="Location" value={card.location} />
        <InfoCard
          label="Challenge"
          value={<ChallengeRating level={card.challengeLevel} />}
        />
      </motion.div>

      {/* Technique Guide */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="text-heading-s text-slate-100 mb-4">Technique Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TechniqueItem label="Aperture" value={card.technique.aperture} />
          <TechniqueItem label="Shutter" value={card.technique.shutter} />
          <TechniqueItem label="Lighting" value={card.technique.lighting} />
          <TechniqueItem label="Composition" value={card.technique.composition} />
        </div>
      </motion.div>

      {/* Color Palette */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="text-heading-s text-slate-100 mb-4">Color Palette</h3>
        <ColorPalette colors={card.colorPalette} />
      </motion.div>

      {/* Pro Tips */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="text-heading-s text-slate-100 mb-4">Pro Tips</h3>
        <ul className="space-y-2">
          {card.proTips.map((tip, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-slate-300"
            >
              <span className="text-copper-primary mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Reference Images */}
      {card.referenceImages.length > 0 && (
        <motion.div variants={itemVariants}>
          <h3 className="text-heading-s text-slate-100 mb-4">Reference Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {card.referenceImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumbnailUrl}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-fast" />
                <a
                  href={image.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 left-2 right-2 text-label text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-fast truncate"
                >
                  Photo by {image.photographer}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.article>
  );
};

/**
 * Info card sub-component
 */
function InfoCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-charcoal-800 rounded-lg p-4">
      <p className="text-label text-slate-400 mb-1">{label}</p>
      <p className="text-body-m text-slate-100">{value}</p>
    </div>
  );
}

/**
 * Technique item sub-component
 */
function TechniqueItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-charcoal-800/50 rounded-lg p-4 border border-charcoal-700">
      <p className="text-label text-copper-primary mb-1 font-mono">{label}</p>
      <p className="text-body-s text-slate-300">{value}</p>
    </div>
  );
}

/**
 * Challenge rating display
 */
function ChallengeRating({ level }: { level: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div
      className="flex items-center gap-1"
      title={CHALLENGE_DESCRIPTIONS[level]}
      role="img"
      aria-label={`Difficulty: ${level} out of 5 stars. ${CHALLENGE_DESCRIPTIONS[level]}`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={cn(
            'text-lg',
            star <= level ? 'text-copper-primary' : 'text-charcoal-600'
          )}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * Color palette display with click-to-copy
 */
function ColorPalette({ colors }: { colors: string[] }) {
  const handleCopy = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <button
          key={index}
          onClick={() => handleCopy(color)}
          className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-charcoal-800 transition-colors duration-fast"
          title={`Click to copy ${color}`}
          aria-label={`Color ${color}. Click to copy.`}
        >
          <div
            className="w-12 h-12 rounded-lg shadow-elevation-1 group-hover:shadow-elevation-2 transition-shadow duration-fast"
            style={{ backgroundColor: color }}
          />
          <span className="text-label font-mono text-slate-400 group-hover:text-slate-100 transition-colors duration-fast">
            {color}
          </span>
        </button>
      ))}
    </div>
  );
}
