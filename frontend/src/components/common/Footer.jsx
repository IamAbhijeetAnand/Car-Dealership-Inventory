import React from 'react';
import { Car, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">DrivePulse</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enterprise dealership management system with real-time stock control, ACID transaction safety, and AI recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Inventory</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/inventory?category=Sedan" className="hover:text-cyan-400 transition-colors">Luxury Sedans</a></li>
              <li><a href="/inventory?category=SUV" className="hover:text-cyan-400 transition-colors">Family SUVs</a></li>
              <li><a href="/inventory?category=Electric" className="hover:text-cyan-400 transition-colors">EV & Hybrids</a></li>
              <li><a href="/inventory?category=Truck" className="hover:text-cyan-400 transition-colors">Heavy Duty Trucks</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Technology</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> AI Vehicle Matchmaker</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-cyan-400" /> Real-time Stock Sync</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> JWT RBAC Security</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Dealership HQ</h4>
            <p className="text-sm text-slate-400">100 Enterprise Boulevard</p>
            <p className="text-sm text-slate-400">Automotive District, NY 10001</p>
            <p className="text-sm text-cyan-400 mt-2">sales@drivepulse.com</p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} DrivePulse Inc. All rights reserved. Enterprise MERN Architecture.
        </div>
      </div>
    </footer>
  );
};
