"use client";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="relative w-32 h-8">
            <Image src="/images/logo.png" alt="Logo" className="object-contain" sizes="100%" fill/>
          </div>

          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-white transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-white transition-colors">
              联系我们
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2025 包头分行金融科技中心</p>
        </div>
      </div>
    </footer>
  );
}
