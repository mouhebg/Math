'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'students' | 'parents'>('students');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Simple Static Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">M</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MathNest</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#programme" className="hover:text-indigo-600 transition-colors">Programme</a>
            <a href="#parent-guide" className="hover:text-indigo-600 transition-colors">Parent Guide</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600">Log In</button>
            <button className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 mb-8">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                New Adaptive Learning Engine Available
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
                Master Math with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Confidence & Clarity
                </span>
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600 mb-10">
                Personalized learning paths that adapt to your child's pace. Real-time insights for parents. 
                A seamless experience across all devices.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#programme" className="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 hover:scale-105 transition-all duration-200">
                  View Programme
                </a>
                <a href="#how-it-works" className="w-full sm:w-auto rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:scale-105 transition-all duration-200">
                  How It Works
                </a>
              </div>
            </div>
          </div>
          
          {/* Background Decor */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-full w-full opacity-30 pointer-events-none">
            <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-200 blur-3xl mix-blend-multiply filter animate-blob"></div>
            <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-violet-200 blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 h-72 w-72 rounded-full bg-pink-200 blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000"></div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A complete ecosystem for math success
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Adaptive Learning',
                  desc: 'AI-driven paths that adjust difficulty in real-time based on student performance.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  )
                },
                {
                  title: 'Parent Dashboard',
                  desc: 'Clear, actionable insights into progress, strengths, and areas needing support.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  )
                },
                {
                  title: 'Seamless Sync',
                  desc: 'Start on tablet, finish on desktop. Progress saves instantly across all devices.',
                  icon: (
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  )
                }
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-8 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-md group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Simple steps to math mastery
              </h2>
            </div>
            <div className="relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                {[
                  { step: '01', title: 'Assess', desc: 'Take a quick diagnostic to find the perfect starting level.' },
                  { step: '02', title: 'Learn', desc: 'Engage with interactive lessons tailored to your learning style.' },
                  { step: '03', title: 'Master', desc: 'Practice with adaptive problems until concepts stick.' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center bg-slate-50 md:bg-transparent p-4 rounded-xl">
                    <div className="h-16 w-16 rounded-full bg-white border-2 border-indigo-600 text-indigo-600 font-bold text-xl flex items-center justify-center shadow-sm mb-6">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pattern-dots"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Ready to transform your math journey?
            </h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of students who are building confidence and achieving better grades today.
            </p>
            <button className="rounded-full bg-white px-8 py-4 text-base font-semibold text-indigo-900 shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-200">
              Start Your Free Trial
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">M</div>
            <span className="text-lg font-bold text-white">MathNest</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm">© 2024 MathNest Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
