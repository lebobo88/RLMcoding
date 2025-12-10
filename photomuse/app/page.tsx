'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-charcoal-900 via-charcoal-950 to-charcoal-950" />

        {/* Subtle Animated Circles (decorative) */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-copper-primary/5 blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-gold-gallery/5 blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Brand */}
          <motion.p
            className="text-label tracking-[0.3em] text-copper-primary mb-6"
            {...fadeIn}
          >
            PHOTOMUSE
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="font-display text-display-l md:text-display-xl text-slate-100 mb-6"
            {...fadeIn}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            One click.
            <br />
            <span className="text-copper-primary">One vision.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-body-l md:text-heading-m text-slate-300 mb-10 max-w-2xl mx-auto"
            {...fadeIn}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            AI-powered photography ideas for fine art photographers
            who refuse to run dry.
          </motion.p>

          {/* CTA */}
          <motion.div
            {...fadeIn}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link href="/generate">
              <Button size="lg" className="group">
                <span>Start Creating</span>
                <motion.span
                  className="ml-2 inline-block"
                  animate={prefersReducedMotion ? {} : { x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-charcoal-700 flex items-start justify-center p-2"
              animate={prefersReducedMotion ? {} : { opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-copper-primary"
                animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-display-m text-slate-100 mb-4">
              How It Works
            </h2>
            <p className="text-body-l text-slate-400 max-w-2xl mx-auto">
              Get instant, actionable photography concepts with rich details
              and visual references.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Click',
                description:
                  'Press the button. Optionally add mood, style, or technique preferences.',
              },
              {
                step: '02',
                title: 'AI Creates',
                description:
                  'Our AI crafts a unique shoot concept with technique guidance and references.',
              },
              {
                step: '03',
                title: 'Get Inspired',
                description:
                  'Receive a complete "shoot card" ready to execute. Never run out of ideas.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="bg-charcoal-900 rounded-xl p-8 border border-charcoal-800"
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <span className="text-label font-mono text-copper-primary mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-heading-m text-slate-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-body-m text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gradient-to-b from-charcoal-950 to-charcoal-900">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-display-m text-slate-100 mb-6">
            Ready to create something{' '}
            <span className="text-copper-primary">extraordinary</span>?
          </h2>
          <Link href="/generate">
            <Button size="lg">Begin Your Creative Journey</Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-charcoal-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-s text-slate-400">
            PhotoMuse — AI Photography Ideas Generator
          </p>
          <p className="text-body-s text-slate-500">
            Built with creativity and Claude AI
          </p>
        </div>
      </footer>
    </main>
  );
}
