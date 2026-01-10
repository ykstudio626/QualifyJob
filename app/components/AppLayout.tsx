'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activePage?: string;
}

export default function AppLayout({ children, activePage = "jobs" }: AppLayoutProps) {
  const [currentPage, setCurrentPage] = useState(activePage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { key: "jobs", label: "案件一覧表示" },
    { key: "members", label: "要員一覧表示" },
    { key: "stats", label: "統計情報" },
    { key: "quickmatch", label: "クイックマッチ" }
  ];

  const handleMenuClick = (key: string) => {
    if (key === "jobs") {
      router.push('/jobs');
    } else {
      router.push('/');
      // Note: これらのページは現在トップページ内で管理されています
    }
    setCurrentPage(key);
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-root flex min-h-screen bg-slate-100">
      <Sidebar activePage={currentPage} onChangePage={handleMenuClick} />

      <div className="flex-1 flex flex-col">
        {/* Mobile menu button and dropdown */}
        <div className="mobile-menu-container md:hidden bg-slate-900 text-white p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white font-bold text-lg"
          >
            ☰ メニュー
          </button>
          {mobileMenuOpen && (
            <div className="mobile-dropdown mt-2 bg-slate-800 rounded">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleMenuClick(item.key)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentPage === item.key
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}