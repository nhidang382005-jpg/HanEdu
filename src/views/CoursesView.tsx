/**
 * [MVC ARCHITECTURE - VIEW LAYER]
 * File: src/views/CoursesView.tsx
 * Vai trò: Trang chủ & Hệ thống Khóa học HanEdu theo thiết kế 11 chuyên mục HSK,
 * Hero Flashcard tương tác, Phòng học Hán tự (Ô chữ Mễ), Thống kê & CTA.
 * Tone màu chủ đạo: Xanh dương nhạt (Sky Blue) & Be ấm (Warm Beige).
 */

import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  BookOpen,
  Play,
  ChevronRight,
  Check,
  Rocket,
  Flame,
  GraduationCap,
  MessageSquare,
  FileText,
  PenTool,
  Languages,
  Compass,
  Layers,
  ListOrdered,
  Sparkles,
  ArrowRight,
  UserPlus,
} from 'lucide-react';
import { Course, Lesson, VocabularyItem } from '../models/CourseModel';
import { LearnerProfileState } from '../models/ProgressModel';
import { LearningController } from '../controllers/LearningController';

interface CoursesViewProps {
  courses: Course[];
  progress: LearnerProfileState;
  controller: LearningController;
  onNavigateToTest: () => void;
  onNavigateToProgress: () => void;
  onOpenRegisterModal: () => void;
  onOpenDictionaryModal: () => void;
}

interface LearningModuleCard {
  id: string;
  title: string;
  description: string;
  lessonCount: string;
  iconBg: string;
  iconColor: string;
  actionType: 'sandbox-vocab' | 'sandbox-dialogue' | 'sandbox-grammar' | 'test' | 'dictionary';
  icon: React.ReactNode;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  progress,
  controller,
  onNavigateToTest,
  onNavigateToProgress,
  onOpenRegisterModal,
  onOpenDictionaryModal,
}) => {
  const [heroHskLevel, setHeroHskLevel] = useState<number>(3);
  const [heroWordIndex, setHeroWordIndex] = useState<number>(0);

  const [levelFilter, setLevelFilter] = useState<'ALL' | Course['level']>('ALL');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || 'course-hsk12'
  );
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    activeCourse?.lessons[0]?.id || 'les-101-1'
  );
  const activeLesson: Lesson =
    activeCourse?.lessons.find((l) => l.id === selectedLessonId) || activeCourse.lessons[0];

  const [selectedVocabIndex, setSelectedVocabIndex] = useState<number>(0);
  const [activeStrokeStep, setActiveStrokeStep] = useState<number>(99);
  const [speechRate, setSpeechRate] = useState<number>(0.85);
  const [showPinyin, setShowPinyin] = useState<boolean>(true);
  const [showSinoViet, setShowSinoViet] = useState<boolean>(true);
  const [lessonTab, setLessonTab] = useState<'vocab' | 'grammar' | 'dialogue'>('vocab');
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string>('Giáo trình HSK');

  const allVocab = controller.getAllVocabulary();
  const heroWord = allVocab[heroWordIndex % allVocab.length] || {
    hanzi: '你好',
    pinyin: 'nǐ hǎo',
    meaning: 'Xin chào',
  };

  const filteredCourses =
    levelFilter === 'ALL' ? courses : courses.filter((c) => c.level === levelFilter);

  const currentVocab: VocabularyItem =
    activeLesson.vocabulary[selectedVocabIndex] || activeLesson.vocabulary[0];

  const handleSelectCourse = (course: Course) => {
    setSelectedCourseId(course.id);
    if (course.lessons.length > 0) {
      setSelectedLessonId(course.lessons[0].id);
      setSelectedVocabIndex(0);
      setActiveStrokeStep(99);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLessonId(lesson.id);
    setSelectedVocabIndex(0);
    setActiveStrokeStep(99);
  };

  const isLessonDone = progress.completedLessonIds.includes(activeLesson.id);
  const isVocabMastered = currentVocab
    ? progress.masteredVocabIds.includes(currentVocab.id)
    : false;

  // 11 Chuyên mục học tập chuẩn theo giao diện mẫu
  const learningModules: LearningModuleCard[] = [
    {
      id: 'mod-hsk',
      title: 'Giáo trình HSK',
      description: 'Học theo chuẩn HSK quốc tế từ cấp độ 1 đến 6, phù hợp với mọi trình độ',
      lessonCount: '150 bài',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      actionType: 'sandbox-vocab',
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      id: 'mod-vocab-topic',
      title: 'Từ vựng chủ đề',
      description: 'Hệ thống từ vựng được phân loại theo chủ đề, dễ học và ghi nhớ',
      lessonCount: '80 bài',
      iconBg: 'bg-[#F3E8D2]',
      iconColor: 'text-amber-800',
      actionType: 'sandbox-vocab',
      icon: <Layers className="w-6 h-6" />,
    },
    {
      id: 'mod-dialogue',
      title: 'Hội thoại',
      description: 'Luyện tập hội thoại thực tế với các tình huống giao tiếp hàng ngày',
      lessonCount: '120 bài',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      actionType: 'sandbox-dialogue',
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      id: 'mod-reading',
      title: 'Đọc hiểu',
      description: 'Nâng cao khả năng đọc hiểu với các bài văn từ cơ bản đến nâng cao',
      lessonCount: '90 bài',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700',
      actionType: 'sandbox-dialogue',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: 'mod-test',
      title: 'Luyện thi',
      description: 'Đề thi thử HSK với hệ thống chấm điểm tự động và phân tích chi tiết',
      lessonCount: '60 bài',
      iconBg: 'bg-[#F5E6D3]',
      iconColor: 'text-orange-700',
      actionType: 'test',
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      id: 'mod-radicals',
      title: 'Bộ thủ',
      description: 'Học 214 bộ thủ cơ bản giúp nhận biết và viết chữ Hán chính xác',
      lessonCount: '30 bài',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      actionType: 'sandbox-vocab',
      icon: <PenTool className="w-6 h-6" />,
    },
    {
      id: 'mod-translate',
      title: 'Dịch',
      description: 'Công cụ dịch thông minh với từ điển tích hợp và ví dụ minh họa',
      lessonCount: '40 bài',
      iconBg: 'bg-[#F3E8D2]',
      iconColor: 'text-amber-700',
      actionType: 'dictionary',
      icon: <Languages className="w-6 h-6" />,
    },
    {
      id: 'mod-sentences',
      title: 'Mẫu câu',
      description: 'Học mẫu câu tiếng Trung qua các chủ đề giao tiếp thực tiễn',
      lessonCount: '70 bài',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-700',
      actionType: 'sandbox-grammar',
      icon: <Volume2 className="w-6 h-6" />,
    },
    {
      id: 'mod-writing',
      title: 'Luyện viết',
      description: 'Luyện viết chữ Hán chuẩn nét, có hướng dẫn và đếm số nét sai',
      lessonCount: '50 bài',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      actionType: 'sandbox-vocab',
      icon: <PenTool className="w-6 h-6" />,
    },
    {
      id: 'mod-measure-words',
      title: 'Lượng từ',
      description: 'Học các loại lượng từ phổ biến trong tiếng Trung kèm ví dụ cụ thể',
      lessonCount: '45 bài',
      iconBg: 'bg-[#F3E8D2]',
      iconColor: 'text-amber-800',
      actionType: 'sandbox-grammar',
      icon: <ListOrdered className="w-6 h-6" />,
    },
    {
      id: 'mod-pinyin',
      title: 'Lộ trình Pinyin',
      description: 'Học phát âm tiếng Trung từ số 0 với bảng âm tiết và file âm thanh chuẩn',
      lessonCount: '35 bài',
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-700',
      actionType: 'sandbox-vocab',
      icon: <Compass className="w-6 h-6" />,
    },
  ];

  const handleModuleClick = (mod: LearningModuleCard) => {
    setActiveCategoryTitle(mod.title);
    if (mod.actionType === 'test') {
      onNavigateToTest();
      return;
    }
    if (mod.actionType === 'dictionary') {
      onOpenDictionaryModal();
      return;
    }
    if (mod.actionType === 'sandbox-dialogue') {
      setLessonTab('dialogue');
    } else if (mod.actionType === 'sandbox-grammar') {
      setLessonTab('grammar');
    } else {
      setLessonTab('vocab');
    }
    const el = document.getElementById('hanzi-sandbox');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16">
      {/* =====================================================================
       * 1. HERO SECTION (Giao diện chuẩn mẫu: Trái Tiêu đề lớn + Phải 3 Bento Cards)
       * Tone màu: Nền Be kem (#F5EFE6 / #FFFDF9) + Điểm nhấn Xanh dương nhạt (#0EA5E9 / #38BDF8)
       * ===================================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#FBF8F3] to-[#E0F2FE]/60 border border-[#E6DEC8] p-8 sm:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Cột trái (7 cols): Slogan, Tiêu đề lớn, Mô tả, 2 nút CTA & Số lượng học viên */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-sky-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>Nền tảng học tiếng Trung #1 Việt Nam · HanEdu</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Chinh phục
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-500 bg-clip-text text-transparent">
                Tiếng Trung
              </span>{' '}
              dễ dàng
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
              Hệ thống học tiếng Trung toàn diện theo chuẩn HSK quốc tế — từ vựng, ngữ pháp, hội
              thoại, luyện thi — tất cả trong một nền tảng duy nhất cùng <strong>HanEdu</strong>.
            </p>

            {/* 2 Nút CTA chính */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#hanzi-sandbox"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 flex items-center gap-2.5 transition-all whitespace-nowrap"
              >
                <Rocket className="w-4 h-4" />
                <span>Bắt đầu học ngay</span>
              </a>

              <a
                href="#chuyen-muc-hoc-tap"
                className="px-7 py-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F3ECE0] text-slate-800 font-semibold text-sm border border-[#DDD3BE] flex items-center gap-2.5 transition-colors whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Khám phá khóa học</span>
              </a>
            </div>

            {/* Social Proof Avatars: H A N E + Hơn 50,000+ Học viên đang học */}
            <div className="flex items-center gap-4 pt-3">
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-sky-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#FBF8F3]">
                  H
                </div>
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#FBF8F3]">
                  A
                </div>
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#FBF8F3]">
                  N
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#FBF8F3]">
                  E
                </div>
              </div>
              <div className="text-sm text-slate-600">
                Hơn <strong className="text-slate-900 font-bold tabular-nums">50,000+</strong> Học
                viên đang học tại HanEdu
              </div>
            </div>
          </div>

          {/* Cột phải (5 cols): Thẻ Flashcard 你好 + Thẻ HSK LEVEL + Thẻ 7 Ngày Chuỗi học */}
          <div className="lg:col-span-5 space-y-4">
            {/* Thẻ Flashcard chính */}
            <div className="rounded-2xl bg-[#FFFDF9] border border-[#E2D9C5] p-8 text-center shadow-sm space-y-3 relative">
              <button
                type="button"
                onClick={() => setHeroWordIndex((prev) => prev + 1)}
                className="absolute top-4 right-4 text-xs text-sky-600 hover:text-sky-700 font-medium px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-100 transition-colors"
                title="Đổi từ vựng khác"
              >
                Đổi từ ↻
              </button>

              <div className="font-hanzi text-6xl font-bold text-slate-900 tracking-wider pt-2">
                {heroWord.hanzi}
              </div>
              <div className="text-base font-medium text-sky-600 font-mono-tabular">
                {heroWord.pinyin}
              </div>
              <div className="text-sm text-slate-600 font-medium">{heroWord.meaning}</div>

              {/* Biểu tượng sóng âm phát âm tiếng Trung */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => controller.actionSpeakMandarin(heroWord.hanzi, speechRate)}
                  className="group px-5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200/80 flex items-center gap-1.5 transition-colors"
                  title="Bấm để nghe phát âm chuẩn"
                >
                  <span className="w-1 h-3 bg-sky-400 rounded-full group-hover:h-5 transition-all" />
                  <span className="w-1 h-5 bg-sky-500 rounded-full group-hover:h-3 transition-all" />
                  <span className="w-1 h-7 bg-sky-600 rounded-full group-hover:h-6 transition-all" />
                  <span className="w-1 h-4 bg-sky-500 rounded-full group-hover:h-7 transition-all" />
                  <span className="w-1 h-6 bg-sky-600 rounded-full group-hover:h-4 transition-all" />
                  <span className="w-1 h-3 bg-sky-400 rounded-full group-hover:h-5 transition-all" />
                  <span className="ml-2 text-xs font-semibold text-sky-700">Nghe phát âm</span>
                </button>
              </div>
            </div>

            {/* 2 Thẻ nhỏ phía dưới: HSK LEVEL & Chuỗi học liên tục */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* HSK LEVEL Selector Card */}
              <div className="rounded-2xl bg-[#FFFDF9] border border-[#E2D9C5] p-5 space-y-3 shadow-xs">
                <div className="text-xs font-bold text-slate-500 tracking-wider">HSK LEVEL</div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((lvl) => {
                    const active = lvl <= heroHskLevel;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setHeroHskLevel(lvl)}
                        className={`w-8 h-8 rounded-full text-xs font-bold tabular-nums transition-colors ${
                          active
                            ? 'bg-sky-500 text-white shadow-xs'
                            : 'bg-[#F2ECE1] text-slate-500 hover:bg-[#E6DEC8]'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFE8DA] overflow-hidden">
                  <div
                    style={{ width: `${(heroHskLevel / 5) * 100}%` }}
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all"
                  />
                </div>
              </div>

              {/* Streak Card (7 Ngày Chuỗi học liên tục) */}
              <div
                onClick={onNavigateToProgress}
                className="cursor-pointer rounded-2xl bg-[#FFFDF9] hover:border-sky-300 border border-[#E2D9C5] p-5 flex items-center gap-4 shadow-xs transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {progress.streakDays} Ngày
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Chuỗi học liên tục</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 2. LƯỚI 11 CHUYÊN MỤC HỌC TẬP (Ảnh mẫu 2 & 3: "Tất cả những gì bạn cần để thành thạo tiếng Trung")
       * ===================================================================== */}
      <section id="chuyen-muc-hoc-tap" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nội dung đa dạng</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tất cả những gì bạn cần
            <br />
            để{' '}
            <span className="bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent">
              thành thạo tiếng Trung
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            11 chuyên mục học tập được thiết kế khoa học tại HanEdu, phù hợp từ người mới bắt đầu
            đến nâng cao
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {learningModules.map((mod) => {
            const isHighlighted = activeCategoryTitle === mod.title;
            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className={`group cursor-pointer rounded-2xl bg-[#FFFDF9] p-6 border transition-all flex flex-col justify-between space-y-6 ${
                  isHighlighted
                    ? 'border-sky-400 ring-2 ring-sky-400/20 shadow-sm'
                    : 'border-[#E6DEC8] hover:border-sky-300 hover:shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${mod.iconBg} ${mod.iconColor} flex items-center justify-center`}
                  >
                    {mod.icon}
                  </div>
                  <div className="space-y-2">
                    <h3
                      className={`text-lg font-bold transition-colors ${
                        isHighlighted
                          ? 'text-sky-600'
                          : 'text-slate-900 group-hover:text-sky-600'
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0E9D8] flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-sky-600 transition-colors">
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{mod.lessonCount}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
       * 3. DANH SÁCH KHÓA HỌC & PHÒNG HỌC HÁN TỰ TƯƠNG TÁC (MVC Course & Lesson Sandbox)
       * ===================================================================== */}
      <section id="hanzi-sandbox" className="space-y-8 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6DEC8] pb-4">
          <div>
            <div className="text-xs font-semibold text-sky-600">
              Chuyên mục đang chọn: {activeCategoryTitle}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Giáo Trình Khóa Học HSK & Phòng Luyện Hán Tự HanEdu
            </h2>
          </div>

          {/* Bộ lọc cấp độ khóa học */}
          <div className="flex items-center gap-1 p-1 bg-[#EFE8DA] rounded-xl self-start">
            {(
              [
                { id: 'ALL', label: 'Tất cả cấp độ' },
                { id: 'Sơ cấp (HSK 1–2)', label: 'HSK 1–2' },
                { id: 'Trung cấp (HSK 3–4)', label: 'HSK 3–4' },
                { id: 'Cao cấp & Thương mại', label: 'HSK 5–6' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setLevelFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  levelFilter === tab.id
                    ? 'bg-[#FFFDF9] text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Thẻ Khóa Học HSK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const isSelected = course.id === activeCourse.id;
            const isEnrolled = progress.enrolledCourseIds.includes(course.id);
            const completedInCourse = course.lessons.filter((l) =>
              progress.completedLessonIds.includes(l.id)
            ).length;

            return (
              <article
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className={`cursor-pointer rounded-2xl bg-[#FFFDF9] border transition-all flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'border-sky-500 ring-2 ring-sky-400/20'
                    : 'border-[#E6DEC8] hover:border-sky-300'
                }`}
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[#F5EFE6] overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/25 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                      <div>
                        <div className="text-xs text-sky-300 font-semibold">
                          {course.code} · {course.hskBadge}
                        </div>
                        <div className="font-hanzi text-lg font-medium">
                          {course.chineseSubtitle}
                        </div>
                      </div>
                      <div className="text-xs font-mono-tabular text-slate-200">
                        {completedInCourse}/{course.lessons.length} bài
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                      <span>{course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.totalHours} giờ</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.vocabularyCount} từ</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>
                  </div>
                </div>

                <div className="px-5 py-3.5 border-t border-[#F0E9D8] bg-[#FBF8F3] flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-700">
                    {isEnrolled ? '● Đang theo học' : '○ Chưa ghi danh'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      controller.actionEnrollCourse(course.id);
                      handleSelectCourse(course);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                      isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-white border border-[#E2D9C5] text-slate-700 hover:bg-sky-50'
                    }`}
                  >
                    <span>{isSelected ? 'Đang mở bài học' : 'Học khóa này'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Khung Phòng Học Tương Tác 2 Cột (Trái: Ô chữ Mễ & Bài khóa / Phải: Danh sách từ vựng & Điều khiển) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 7 COLS */}
          <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E6DEC8] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0E9D8]">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeCourse.lessons.map((lesson) => {
                    const active = lesson.id === activeLesson.id;
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => handleSelectLesson(lesson)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-sky-600 text-white'
                            : 'bg-[#F5EFE6] text-slate-700 hover:bg-[#EBE2D3]'
                        }`}
                      >
                        Bài {lesson.order}: {lesson.title}
                      </button>
                    );
                  })}
                </div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  <span>{activeLesson.title}</span>
                  <span className="text-slate-300 font-normal">|</span>
                  <span className="font-hanzi text-sky-700">{activeLesson.chineseTitle}</span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() =>
                  controller.actionToggleLessonCompleted(
                    activeLesson.id,
                    activeLesson.durationMinutes,
                    activeLesson.title
                  )
                }
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isLessonDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isLessonDone ? 'Đã hoàn thành bài' : 'Hoàn thành (+Lưu tiến độ)'}</span>
              </button>
            </div>

            {/* Tabs Chuyển đổi Từ vựng / Ngữ pháp / Hội thoại */}
            <div className="flex items-center gap-1 p-1 bg-[#F5EFE6] rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setLessonTab('vocab')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  lessonTab === 'vocab'
                    ? 'bg-[#FFFDF9] text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Từ vựng & Bộ thủ ({activeLesson.vocabulary.length})
              </button>
              <button
                type="button"
                onClick={() => setLessonTab('grammar')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  lessonTab === 'grammar'
                    ? 'bg-[#FFFDF9] text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mẫu câu & Ngữ pháp ({activeLesson.grammarPoints.length})
              </button>
              <button
                type="button"
                onClick={() => setLessonTab('dialogue')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  lessonTab === 'dialogue'
                    ? 'bg-[#FFFDF9] text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hội thoại ({activeLesson.dialogue.length})
              </button>
            </div>

            {lessonTab === 'vocab' && currentVocab && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#FBF8F3] p-5 rounded-2xl border border-[#E6DEC8]">
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-40 h-40 bg-[#FFFDF9] border-2 border-sky-500/80 rounded-2xl flex items-center justify-center shadow-xs overflow-hidden">
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-px bg-sky-200 absolute top-1/2 -translate-y-1/2 border-t border-dashed border-sky-300" />
                        <div className="h-full w-px bg-sky-200 absolute left-1/2 -translate-x-1/2 border-l border-dashed border-sky-300" />
                      </div>
                      <span className="font-hanzi text-6xl font-bold text-slate-900 z-10">
                        {currentVocab.hanzi}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          controller.actionSpeakMandarin(currentVocab.hanzi, speechRate)
                        }
                        className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Phát âm</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => controller.actionToggleVocabularyMastery(currentVocab.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                          isVocabMastered
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-white border-[#E2D9C5] text-slate-700 hover:bg-[#F5EFE6]'
                        }`}
                      >
                        {isVocabMastered ? '✓ Đã thuộc' : '+ Lưu sổ tay'}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 tabular-nums">
                      <span className="font-semibold text-sky-700">{currentVocab.hskLevel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{currentVocab.strokeCount} nét</span>
                      <span aria-hidden="true">·</span>
                      <span>Bộ thủ: {currentVocab.radical}</span>
                    </div>

                    {showPinyin && (
                      <div className="text-xl font-bold text-sky-600 font-mono-tabular">
                        /{currentVocab.pinyin}/
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {showSinoViet && (
                        <div>
                          <div className="text-xs text-slate-500">Âm Hán Việt:</div>
                          <div className="text-sm font-bold text-slate-900">
                            {currentVocab.sinoVietnamese}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-slate-500">Nghĩa tiếng Việt:</div>
                        <div className="text-sm font-bold text-slate-900">
                          {currentVocab.meaning}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <div className="text-xs text-slate-500 mb-1.5">
                        Thứ tự nét viết (Bấm từng nét):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentVocab.strokeOrderBreakdown.map((stroke, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveStrokeStep(idx)}
                            className={`px-2 py-1 rounded-md text-xs font-mono-tabular border transition-colors ${
                              idx <= activeStrokeStep
                                ? 'bg-sky-600 text-white border-sky-600'
                                : 'bg-white text-slate-600 border-[#E2D9C5]'
                            }`}
                          >
                            {idx + 1}. {stroke}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F5EFE6]/70 border border-[#E6DEC8] flex items-center justify-between gap-4">
                  <div>
                    <div className="font-hanzi text-lg font-medium text-slate-900">
                      {currentVocab.exampleHanzi}
                    </div>
                    {showPinyin && (
                      <div className="text-xs text-sky-700 font-mono-tabular">
                        {currentVocab.examplePinyin}
                      </div>
                    )}
                    <div className="text-xs text-slate-600 mt-0.5">
                      {currentVocab.exampleMeaning}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      controller.actionSpeakMandarin(currentVocab.exampleHanzi, speechRate)
                    }
                    className="p-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 shrink-0 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {lessonTab === 'grammar' && (
              <div className="space-y-4">
                {activeLesson.grammarPoints.map((gram) => (
                  <div
                    key={gram.id}
                    className="p-5 rounded-2xl bg-[#FBF8F3] border border-[#E6DEC8] space-y-2.5"
                  >
                    <h4 className="text-base font-bold text-slate-900">{gram.title}</h4>
                    <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E2D9C5] text-xs font-mono-tabular text-sky-700 font-semibold">
                      Cấu trúc: {gram.structure}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {gram.explanation}
                    </p>
                    <div className="pt-2 flex items-center justify-between gap-4 border-t border-[#E6DEC8]">
                      <div>
                        <div className="font-hanzi text-base text-slate-900">
                          {gram.exampleHanzi}
                        </div>
                        <div className="text-xs text-sky-700 font-mono-tabular">
                          {gram.examplePinyin}
                        </div>
                        <div className="text-xs text-slate-600">{gram.exampleMeaning}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          controller.actionSpeakMandarin(gram.exampleHanzi, speechRate)
                        }
                        className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nghe</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lessonTab === 'dialogue' && (
              <div className="space-y-3">
                {activeLesson.dialogue.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FBF8F3] border border-[#E6DEC8] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-bold text-sky-700">
                        {line.speaker} ({line.role})
                      </div>
                      <div className="font-hanzi text-lg text-slate-900 mt-0.5">{line.hanzi}</div>
                      <div className="text-xs text-slate-500 font-mono-tabular">{line.pinyin}</div>
                      <div className="text-sm text-slate-700 mt-0.5">{line.meaning}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => controller.actionSpeakMandarin(line.hanzi, speechRate)}
                      className="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: Vocabulary List & Controls */}
          <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E6DEC8] rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Bảng Từ Vựng & Điều Khiển Ngữ Âm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Điều chỉnh tốc độ đọc Pinyin và chọn từ vựng trong bài học
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F5EFE6]/80 border border-[#E6DEC8] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label htmlFor="rate-control">Tốc độ phát âm (zh-CN):</label>
                <span className="font-mono-tabular text-sky-700">{speechRate.toFixed(2)}x</span>
              </div>
              <input
                id="rate-control"
                type="range"
                min="0.60"
                max="1.20"
                step="0.05"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowPinyin((v) => !v)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    showPinyin
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-600 border-[#E2D9C5]'
                  }`}
                >
                  {showPinyin ? '● Pinyin: BẬT' : '○ Pinyin: TẮT'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSinoViet((v) => !v)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                    showSinoViet
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-600 border-[#E2D9C5]'
                  }`}
                >
                  {showSinoViet ? '● Hán Việt: BẬT' : '○ Hán Việt: TẮT'}
                </button>
              </div>
            </div>

            <div className="divide-y divide-[#F0E9D8] border border-[#E6DEC8] rounded-xl overflow-hidden">
              {activeLesson.vocabulary.map((item, idx) => {
                const isCurrent = idx === selectedVocabIndex && lessonTab === 'vocab';
                const mastered = progress.masteredVocabIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setLessonTab('vocab');
                      setSelectedVocabIndex(idx);
                      setActiveStrokeStep(99);
                    }}
                    className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isCurrent ? 'bg-sky-50/90' : 'bg-[#FFFDF9] hover:bg-[#F5EFE6]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-hanzi text-xl font-bold text-slate-900 w-14 shrink-0">
                        {item.hanzi}
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-mono-tabular text-sky-700 truncate">
                          {showPinyin ? item.pinyin : '•••'} · {item.sinoVietnamese}
                        </div>
                        <div className="text-sm text-slate-800 font-semibold truncate">
                          {item.meaning}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          controller.actionSpeakMandarin(item.hanzi, speechRate);
                        }}
                        className="p-1.5 rounded-lg hover:bg-sky-100 text-sky-600"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          controller.actionToggleVocabularyMastery(item.id);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          mastered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-[#F5EFE6] text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mastered ? '✓ Đã thuộc' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
       * 4. 4 THẺ THỐNG KÊ & BANNER ĐĂNG KÝ MIỄN PHÍ (Ảnh mẫu 4)
       * ===================================================================== */}
      <section className="space-y-12 pt-4">
        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              value: '11,000+',
              label: 'Từ vựng có sẵn',
              icon: <BookOpen className="w-5 h-5 text-sky-600" />,
              iconBg: 'bg-sky-100',
            },
            {
              value: '50,000+',
              label: 'Học viên tin dùng',
              icon: <PenTool className="w-5 h-5 text-amber-700" />,
              iconBg: 'bg-[#F3E8D2]',
            },
            {
              value: '500+',
              label: 'Đề thi thử sát thực',
              icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
              iconBg: 'bg-emerald-100',
            },
            {
              value: '98%',
              label: 'Tỷ lệ đỗ HSK',
              icon: <FileText className="w-5 h-5 text-sky-700" />,
              iconBg: 'bg-sky-100',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#FFFDF9] border border-[#E6DEC8] p-7 text-center space-y-3 shadow-xs"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${stat.iconBg} mx-auto flex items-center justify-center`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner: "Sẵn sàng chinh phục tiếng Trung?" */}
        <div className="rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#FFFDF9] to-sky-100/70 border border-[#E6DEC8] p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E2D9C5] text-slate-700 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5 text-sky-600" />
            <span>Bắt đầu ngay hôm nay</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sẵn sàng chinh phục tiếng Trung?
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Tham gia cùng hơn 50,000 học viên đã và đang học tiếng Trung hiệu quả với{' '}
            <strong className="text-sky-700">HanEdu</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 flex items-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Đăng ký miễn phí</span>
            </button>

            <a
              href="#chuyen-muc-hoc-tap"
              className="px-7 py-3.5 rounded-2xl bg-[#FFFDF9] hover:bg-[#F3ECE0] text-slate-800 font-semibold text-sm border border-[#DDD3BE] flex items-center gap-2 transition-colors"
            >
              <span>Xem khóa học</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="text-xs font-medium text-emerald-700 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Miễn phí — không cần thẻ tín dụng</span>
          </div>
        </div>
      </section>
    </div>
  );
};
