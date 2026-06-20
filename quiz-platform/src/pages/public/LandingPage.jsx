import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, BarChart2, Shield, CheckCircle2, BookOpen } from 'lucide-react';

const features = [
  { icon: Zap, title: 'Instant Feedback', desc: 'Get results immediately after completing a quiz.' },
  { icon: BarChart2, title: 'Performance Analytics', desc: 'Track progress with detailed charts and insights.' },
  { icon: Trophy, title: 'Leaderboards', desc: 'Compete globally and see where you rank.' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'JWT-secured accounts with data you can trust.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-200/30 dark:bg-accent-900/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full text-primary-700 dark:text-primary-400 text-sm font-medium mb-6">
              <BookOpen size={14} />
              The modern quiz platform
            </span>

            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-dark-900 dark:text-white leading-tight mb-6">
              Learn smarter,{' '}
              <span className="gradient-text">quiz faster</span>
            </h1>

            <p className="text-xl text-dark-500 dark:text-dark-400 max-w-2xl mx-auto mb-10">
              Create, take, and master quizzes on any topic. Track your progress,
              compete with peers, and level up your knowledge.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary !px-8 !py-4 text-base">
                Start for free <ArrowRight size={20} />
              </Link>
              <Link to="/quizzes" className="btn-secondary !px-8 !py-4 text-base">
                Browse quizzes
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-dark-400">
              {['No credit card required', 'Free forever plan', '500+ quizzes'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-500" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-dark-50/50 dark:bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-dark-900 dark:text-white mb-4">
              Everything you need to excel
            </h2>
            <p className="text-dark-500 dark:text-dark-400 max-w-lg mx-auto">
              A complete toolkit for learning through testing.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="card p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <h3 className="font-display font-semibold text-dark-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-dark-500 dark:text-dark-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-primary-600 to-accent-600 border-0 text-white">
            <h2 className="font-display font-bold text-3xl mb-4">Ready to get started?</h2>
            <p className="text-white/80 mb-8">Join thousands of learners improving their skills daily.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg">
              Create free account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
