/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Search,
  Home,
  BookOpen,
  Award,
  PenTool,
  MessageSquare,
  FileText,
  GraduationCap,
  CalendarCheck,
  Database,
  LogIn,
  UserPlus,
  Settings,
  Bookmark,
  Volume2,
  X,
  Crown,
  Sparkles,
  Mail,
} from 'lucide-react';
import { appController } from './controllers/LearningController';
import { CoursesView } from './views/CoursesView';
import { AssessmentView } from './views/AssessmentView';
import { ProgressView } from './views/ProgressView';
import { MvcGuideView } from './views/MvcGuideView';

type ActiveRoute = 'courses' | 'assessment' | 'progress' | 'mvc-guide';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('courses');
  const [activeNavKey, setActiveNavKey] = useState<string>('home');
  const [courses, setCourses] = useState(() => appController.getCourses());
  const [progress, setProgress] = useState(() => appController.getLearnerProgress());
  const [assessmentHistory, setAssessmentHistory] = useState(() =>
    appController.getAssessmentHistory()
  );

  // Interactive Modals (Tra từ / Đăng nhập - Đăng ký / Cài đặt)
  const [isDictOpen, setIsDictOpen] = useState<boolean>(false);
  const [dictQuery, setDictQuery] = useState<string>('');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [authNameInput, setAuthNameInput] = useState<string>(progress.studentName);
  const [authEmailInput, setAuthEmailInput] = useState<string>('hocvien@hanedu.vn');

  // Đăng ký lắng nghe sự kiện thay đổi từ LearningController (Mô hình Observer trong MVC)
  useEffect(() => {
    const unsubscribe = appController.subscribe(() => {
      setCourses(appController.getCourses());
      setProgress(appController.getLearnerProgress());
      setAssessmentHistory(appController.getAssessmentHistory());
    });
    return unsubscribe;
  }, []);

  const allVocabulary = appController.getAllVocabulary();

  const filteredDictVocab = allVocabulary.filter((v) => {
    if (!dictQuery.trim()) return true;
    const q = dictQuery.toLowerCase();
    return (
      v.hanzi.includes(q) ||
      v.pinyin.toLowerCase().includes(q) ||
      v.sinoVietnamese.toLowerCase().includes(q) ||
      v.meaning.toLowerCase().includes(q)
    );
  });

  const handleCategoryNav = (
    key: string,
    targetRoute: ActiveRoute,
    scrollTargetId?: string
  ) => {
    setActiveNavKey(key);
    setActiveRoute(targetRoute);
    if (scrollTargetId) {
      setTimeout(() => {
        const el = document.getElementById(scrollTargetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3] text-slate-900">
      {/* =====================================================================
       * HEADER 2 TẦNG CHUẨN MẪU (Tone màu: Be ấm #FFFDF9 / #F5EFE6 & Xanh dương nhạt #0EA5E9)
       * ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E6DEC8] shadow-2xs">
        {/* Tầng 1: Thương hiệu HanEdu + Thanh công cụ nhanh + Đăng nhập/Đăng ký */}
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-[#F0E9D8]">
          {/* Logo HanEdu */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleCategoryNav('home', 'courses');
            }}
            className="flex flex-col shrink-0 group"
          >
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent leading-none">
              HanEdu
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              Học Tiếng Trung
            </span>
          </a>

          {/* Cụm tiện ích bên phải (Chép chính tả, Tìm kiếm, Liên hệ, VN VI, Đăng nhập, Đăng ký) */}
          <div className="flex items-center gap-2.5 flex-wrap justify-end">
            <button
              type="button"
              onClick={() => handleCategoryNav('writing', 'courses', 'hanzi-sandbox')}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-semibold text-sky-700 transition-colors whitespace-nowrap"
            >
              <PenTool className="w-3.5 h-3.5 text-sky-600" />
              <span>Chép chính tả</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-md">
                NEW
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsDictOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5EFE6] hover:bg-[#EBE2D3] border border-[#E2D9C5] text-xs font-semibold text-slate-700 transition-colors whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5 text-sky-600" />
              <span>Tìm kiếm</span>
            </button>

            <a
              href="#hanedu-footer"
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-sky-700 transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Liên hệ</span>
            </a>

            <div className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#E2D9C5] text-xs font-bold text-slate-700">
              <span>VN</span>
              <span className="text-sky-600">VI</span>
            </div>

            <button
              type="button"
              onClick={() => setAuthModalMode('login')}
              className="px-3.5 py-1.5 rounded-full bg-[#FFFDF9] hover:bg-sky-50 border border-sky-300 text-xs font-semibold text-sky-700 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthModalMode('register')}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Đăng ký</span>
            </button>
          </div>
        </div>

        {/* Tầng 2: Thanh Menu Chuyên Mục Học Tập (Giống hệt bố cục ảnh mẫu) */}
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
          <nav
            className="flex items-center gap-1.5 sm:gap-2 min-w-max text-xs font-semibold"
            aria-label="Menu chuyên mục HanEdu"
          >
            <button
              type="button"
              onClick={() => handleCategoryNav('home', 'courses')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeNavKey === 'home' && activeRoute === 'courses'
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : 'text-slate-700 hover:bg-[#F5EFE6]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-sky-600" />
              <span>Trang chủ</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('hanzi', 'courses', 'hanzi-sandbox')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeNavKey === 'hanzi'
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : 'text-slate-700 hover:bg-[#F5EFE6]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>Hán ngữ</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('hsk30', 'courses', 'chuyen-muc-hoc-tap')}
              className="px-3 py-1.5 rounded-full bg-[#F3E8D2] hover:bg-[#E9DABF] text-amber-900 border border-amber-300/80 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>HSK 3.0</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('vocab', 'courses', 'hanzi-sandbox')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeNavKey === 'vocab'
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : 'text-slate-700 hover:bg-[#F5EFE6]'
              }`}
            >
              <span>Từ vựng ▾</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('dialogue', 'courses', 'hanzi-sandbox')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeNavKey === 'dialogue'
                  ? 'bg-sky-100 text-sky-700 border border-sky-200'
                  : 'text-slate-700 hover:bg-[#F5EFE6]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>Hội thoại ▾</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('reading', 'courses', 'chuyen-muc-hoc-tap')}
              className="px-3 py-1.5 rounded-full text-slate-700 hover:bg-[#F5EFE6] flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Đọc hiểu ▾</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('radicals', 'courses', 'hanzi-sandbox')}
              className="px-3 py-1.5 rounded-full text-slate-700 hover:bg-[#F5EFE6] flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>Bộ thủ</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('test', 'assessment')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeRoute === 'assessment'
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Thi HSK 3.0 ▾</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('progress', 'progress')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeRoute === 'progress'
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-[#F5EFE6]'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Tiến độ ngày ({progress.streakDays}🔥)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDictOpen(true)}
              className="px-3 py-1.5 rounded-full text-slate-700 hover:bg-[#F5EFE6] flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <span>Dịch & Tra từ</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryNav('mvc', 'mvc-guide')}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeRoute === 'mvc-guide'
                  ? 'bg-sky-600 text-white'
                  : 'bg-[#F3E8D2] hover:bg-[#E9DABF] text-amber-900 border border-amber-300/80'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>SQL Server & MVC</span>
            </button>
          </nav>
        </div>
      </header>

      {/* =====================================================================
       * MAIN VIEWPORT CONTAINER
       * ===================================================================== */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
        {activeRoute === 'courses' && (
          <CoursesView
            courses={courses}
            progress={progress}
            controller={appController}
            onNavigateToTest={() => handleCategoryNav('test', 'assessment')}
            onNavigateToProgress={() => handleCategoryNav('progress', 'progress')}
            onOpenRegisterModal={() => setAuthModalMode('register')}
            onOpenDictionaryModal={() => setIsDictOpen(true)}
          />
        )}

        {activeRoute === 'assessment' && (
          <AssessmentView
            controller={appController}
            history={assessmentHistory}
            onNavigateToProgress={() => handleCategoryNav('progress', 'progress')}
          />
        )}

        {activeRoute === 'progress' && (
          <ProgressView
            progress={progress}
            allVocabulary={allVocabulary}
            controller={appController}
          />
        )}

        {activeRoute === 'mvc-guide' && <MvcGuideView controller={appController} />}
      </main>

      {/* =====================================================================
       * FLOATING RIGHT QUICK-TOOLS DOCK (Giống hệt 3 nút bên phải ảnh mẫu: Tra từ, Sổ tay, Cài đặt)
       * ===================================================================== */}
      <aside
        className="hidden md:flex fixed right-4 bottom-8 z-30 flex-col gap-2.5"
        aria-label="Công cụ nhanh HanEdu"
      >
        <button
          type="button"
          onClick={() => setIsDictOpen(true)}
          className="w-14 h-14 rounded-2xl bg-[#FFFDF9]/95 hover:bg-sky-50 border border-[#E2D9C5] shadow-md flex flex-col items-center justify-center gap-1 text-sky-600 transition-all"
          title="Tra từ điển Hán - Việt nhanh"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-semibold text-slate-700">Tra từ</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryNav('progress', 'progress')}
          className="w-14 h-14 rounded-2xl bg-[#FFFDF9]/95 hover:bg-sky-50 border border-[#E2D9C5] shadow-md flex flex-col items-center justify-center gap-1 text-sky-600 transition-all"
          title="Sổ tay từ vựng & Tiến độ hàng ngày"
        >
          <Bookmark className="w-4 h-4" />
          <span className="text-[10px] font-semibold text-slate-700">Sổ tay</span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryNav('mvc', 'mvc-guide')}
          className="w-14 h-14 rounded-2xl bg-[#FFFDF9]/95 hover:bg-sky-50 border border-[#E2D9C5] shadow-md flex flex-col items-center justify-center gap-1 text-emerald-600 transition-all"
          title="Cấu hình SQL Server & Visual Studio MVC"
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] font-semibold text-slate-700">Cài đặt</span>
        </button>
      </aside>

      {/* =====================================================================
       * MODAL TRA TỪ ĐIỂN HÁN - VIỆT NHANH
       * ===================================================================== */}
      {isDictOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#E2D9C5] rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E9D8] pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Từ Điển Hán Ngữ Thông Minh HanEdu
                </h3>
                <p className="text-xs text-slate-500">
                  Tra cứu theo chữ Hán, Pinyin, âm Hán Việt hoặc nghĩa tiếng Việt
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDictOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#F5EFE6] text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={dictQuery}
                onChange={(e) => setDictQuery(e.target.value)}
                placeholder="Nhập chữ Hán (你好), Pinyin (ni hao) hoặc nghĩa tiếng Việt..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FBF8F3] border border-[#E2D9C5] text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#F0E9D8]">
              {filteredDictVocab.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hanzi text-2xl font-bold text-slate-900 w-16">
                      {item.hanzi}
                    </span>
                    <div>
                      <div className="text-xs font-mono-tabular text-sky-700 font-semibold">
                        /{item.pinyin}/ · {item.sinoVietnamese} ({item.hskLevel})
                      </div>
                      <div className="text-sm font-bold text-slate-800">{item.meaning}</div>
                      <div className="text-xs text-slate-500">
                        Bộ thủ: {item.radical} · {item.strokeCount} nét
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => appController.actionSpeakMandarin(item.hanzi)}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
       * MODAL ĐĂNG NHẬP / ĐĂNG KÝ HỌC VIÊN HANEDU
       * ===================================================================== */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#E2D9C5] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E9D8] pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {authModalMode === 'login'
                    ? 'Đăng nhập tài khoản HanEdu'
                    : 'Đăng ký học viên HanEdu miễn phí'}
                </h3>
                <p className="text-xs text-slate-500">
                  Đồng bộ lộ trình HSK và chuỗi ngày học tập liên tục
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAuthModalMode(null)}
                className="p-1.5 rounded-lg hover:bg-[#F5EFE6] text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAuthModalMode(null);
              }}
              className="space-y-3"
            >
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên học viên
                  </label>
                  <input
                    type="text"
                    value={authNameInput}
                    onChange={(e) => setAuthNameInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FBF8F3] border border-[#E2D9C5] text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={authEmailInput}
                  onChange={(e) => setAuthEmailInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF8F3] border border-[#E2D9C5] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  defaultValue="12345678"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FBF8F3] border border-[#E2D9C5] text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm shadow-sm mt-2"
              >
                {authModalMode === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản miễn phí'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
       * 5-COLUMN FOOTER CHUẨN ẢNH MẪU 5 (HanEdu | Khóa học | Công cụ | Chính sách | Liên hệ)
       * ===================================================================== */}
      <footer
        id="hanedu-footer"
        className="border-t border-[#E6DEC8] bg-[#F5EFE6] pt-12 pb-8 px-6 mt-16"
      >
        <div className="max-w-[1280px] mx-auto space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: HanEdu Brand */}
            <div className="space-y-3">
              <div className="text-2xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                HanEdu
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nền tảng học tiếng Trung trực tuyến hàng đầu theo chuẩn HSK quốc tế.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCategoryNav('home', 'courses')}
                  className="px-3 py-1.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold transition-colors"
                >
                  Nhóm Học Viên HanEdu
                </button>
              </div>
            </div>

            {/* Col 2: Khóa học */}
            <div className="space-y-2.5">
              <div className="text-sm font-bold text-slate-900">Khóa học</div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('vocab', 'courses', 'hanzi-sandbox')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Từ vựng HSK 1 - 6
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('vocab', 'courses', 'chuyen-muc-hoc-tap')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Từ vựng chuyên ngành
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('dialogue', 'courses', 'hanzi-sandbox')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Hội thoại
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('test', 'assessment')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Luyện thi HSK
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Công cụ */}
            <div className="space-y-2.5">
              <div className="text-sm font-bold text-slate-900">Công cụ</div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('radicals', 'courses', 'hanzi-sandbox')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    214 Bộ thủ
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsDictOpen(true)}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Công cụ dịch
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('hanzi', 'courses', 'hanzi-sandbox')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Lộ trình Pinyin
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('progress', 'progress')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Theo dõi tiến độ ngày
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav('mvc', 'mvc-guide')}
                    className="hover:text-sky-700 transition-colors"
                  >
                    Cơ sở dữ liệu SQL Server
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Chính sách */}
            <div className="space-y-2.5">
              <div className="text-sm font-bold text-slate-900">Chính sách</div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>Quy chế đào tạo trực tuyến</li>
                <li>Chính sách bảo mật thông tin</li>
                <li>Quyền và nghĩa vụ học viên</li>
                <li>Đổi trả & Hoàn tiền khóa học</li>
              </ul>
            </div>

            {/* Col 5: Liên hệ */}
            <div className="space-y-2.5">
              <div className="text-sm font-bold text-slate-900">Liên hệ</div>
              <div className="text-xs text-sky-700 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>hanedu.com@gmail.com</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trung tâm đào tạo Hán ngữ trực tuyến HanEdu — Phát triển theo kiến trúc MVC & SQL
                Server.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E2D9C5] text-center text-xs text-slate-500">
            © 2026 HanEdu. Bản quyền thuộc về Trung tâm Hán ngữ HanEdu. Phát triển phục vụ cộng
            đồng học tiếng Trung.
          </div>
        </div>
      </footer>
    </div>
  );
}
