/**
 * [MVC ARCHITECTURE - VIEW LAYER]
 * File: src/views/ProgressView.tsx
 * Vai trò: Bảng điều khiển Theo dõi tiến độ học tập hàng ngày (Daily Study Progress Tracker).
 * Bao gồm biểu đồ cột thời lượng 7 ngày, thanh điều chỉnh mục tiêu phút học/ngày,
 * biểu mẫu ghi nhận phiên học mới, sổ tay từ vựng Hán tự đã thuộc và bảng nhật ký chi tiết.
 */

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
} from 'lucide-react';
import { DailyStudyLog, LearnerProfileState } from '../models/ProgressModel';
import { VocabularyItem } from '../models/CourseModel';
import { LearningController } from '../controllers/LearningController';

interface ProgressViewProps {
  progress: LearnerProfileState;
  allVocabulary: VocabularyItem[];
  controller: LearningController;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  allVocabulary,
  controller,
}) => {
  const [dateInput, setDateInput] = useState<string>('2026-10-01');
  const [minutesInput, setMinutesInput] = useState<number>(35);
  const [wordsInput, setWordsInput] = useState<number>(15);
  const [lessonsInput, setLessonsInput] = useState<number>(1);
  const [activityInput, setActivityInput] =
    useState<DailyStudyLog['activityType']>('Học bài khóa');
  const [noteInput, setNoteInput] = useState<string>('');

  const [activityFilter, setActivityFilter] = useState<'ALL' | DailyStudyLog['activityType']>(
    'ALL'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    controller.actionLogStudySession({
      date: dateInput,
      minutesStudied: minutesInput,
      wordsReviewed: wordsInput,
      lessonsCompleted: lessonsInput,
      activityType: activityInput,
      note:
        noteInput.trim() ||
        `Hoàn thành ${minutesInput} phút (${activityInput}) và ôn tập ${wordsInput} từ vựng HSK.`,
    });
    setNoteInput('');
  };

  const totalMinutesWeek = progress.dailyLogs.reduce((sum, l) => sum + l.minutesStudied, 0);
  const totalWordsReviewed = progress.dailyLogs.reduce((sum, l) => sum + l.wordsReviewed, 0);
  const daysGoalMet = progress.dailyLogs.filter((l) => l.goalMet).length;

  const filteredLogs = progress.dailyLogs.filter((log) => {
    const matchesType = activityFilter === 'ALL' || log.activityType === activityFilter;
    const matchesQuery =
      !searchQuery.trim() ||
      log.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.date.includes(searchQuery) ||
      log.activityType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // 7-day chart sorted chronologically
  const recent7Logs = [...progress.dailyLogs]
    .slice(0, 7)
    .reverse();

  const masteredVocabObjects = allVocabulary.filter((v) =>
    progress.masteredVocabIds.includes(v.id)
  );

  return (
    <div className="space-y-10">
      {/* Top KPI Summary Bar (Tabular Numerals, Zero Nested Cards) */}
      <section className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6DEC8] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold">
              <span>Học viên HanEdu: {progress.studentName}</span>
              <span aria-hidden="true">·</span>
              <span>Mục tiêu: {progress.targetHsk}</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
              style={{ textWrap: 'balance' }}
            >
              Theo Dõi Tiến Độ Học Tập Hàng Ngày
            </h1>
          </div>

          <button
            type="button"
            onClick={() => controller.actionResetDemoData()}
            className="px-3.5 py-2 rounded-xl border border-[#E2D9C5] bg-[#F5EFE6] hover:bg-[#EBE2D3] text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục dữ liệu mẫu</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
          <div className="border-r border-[#F0E9D8] pr-4">
            <div className="text-xs text-slate-500">Chuỗi ngày học liên tục (Streak)</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-tabular mt-1">
              {progress.streakDays} ngày
            </div>
            <div className="text-xs text-sky-600 font-semibold mt-1">
              ● Duy trì đều đặn hàng ngày
            </div>
          </div>

          <div className="lg:border-r border-[#F0E9D8] pr-4">
            <div className="text-xs text-slate-500">Tổng thời lượng tích lũy</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-tabular mt-1">
              {totalMinutesWeek} phút
            </div>
            <div className="text-xs text-slate-600 mt-1 tabular-nums">
              Đạt chỉ tiêu {daysGoalMet}/{progress.dailyLogs.length} phiên học
            </div>
          </div>

          <div className="border-r border-[#F0E9D8] pr-4">
            <div className="text-xs text-slate-500">Từ vựng Hán tự đã ôn & thuộc</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono-tabular mt-1">
              {totalWordsReviewed} lượt từ
            </div>
            <div className="text-xs text-slate-600 mt-1 tabular-nums">
              {progress.masteredVocabIds.length} từ cốt lõi trong sổ tay
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label htmlFor="daily-goal-range">Định mức mục tiêu mỗi ngày:</label>
              <span className="font-mono-tabular font-semibold text-sky-700">
                {progress.dailyGoalMinutes} phút/ngày
              </span>
            </div>
            <input
              id="daily-goal-range"
              type="range"
              min={15}
              max={90}
              step={5}
              value={progress.dailyGoalMinutes}
              onChange={(e) =>
                controller.actionSetDailyGoalMinutes(parseInt(e.target.value, 10))
              }
              className="w-full accent-sky-600 mt-3 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono-tabular mt-1">
              <span>15 phút</span>
              <span>45 phút</span>
              <span>90 phút</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Grid: Left 7-Day Visual Chart & Log Form / Right Mastered Hanzi Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: 7-Day Study Duration Chart + New Log Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Biểu đồ thời lượng học tập 7 phiên gần nhất */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Biểu Đồ Thời Lượng Học Tập Hàng Ngày
                </h2>
                <p className="text-xs text-slate-500">
                  So sánh số phút học thực tế với định mức mục tiêu ({progress.dailyGoalMinutes}{' '}
                  phút/ngày)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span>● Đạt mục tiêu (Xanh ngọc)</span>
                <span>▲ Chưa đủ định mức (Cam)</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3 pt-4 items-end h-52 border-b border-slate-200 pb-3 px-2">
              {recent7Logs.map((item) => {
                const maxScale = Math.max(60, progress.dailyGoalMinutes + 15);
                const heightPct = Math.min(100, Math.max(12, Math.round((item.minutesStudied / maxScale) * 100)));
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center justify-end h-full gap-2"
                  >
                    <div className="text-[11px] font-mono-tabular font-semibold text-slate-700">
                      {item.minutesStudied}p
                    </div>
                    <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md h-36 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          item.goalMet ? 'bg-emerald-600' : 'bg-amber-500'
                        }`}
                        title={`${item.date}: ${item.minutesStudied} phút (${item.activityType})`}
                      />
                    </div>
                    <div className="text-[11px] font-mono-tabular text-slate-500">
                      {item.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Ghi Nhận Phiên Học Hàng Ngày */}
          <form
            onSubmit={handleAddSession}
            className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Ghi Nhận Phiên Học Tập Mới Trong Ngày
              </h2>
              <p className="text-xs text-slate-500">
                Dữ liệu nhập vào sẽ được Controller gửi tới ProgressModel để tính lại chuỗi ngày học
                (Streak) và lưu trữ bền vững.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Ngày học (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono-tabular focus:outline-none focus:border-red-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Hình thức rèn luyện
                </label>
                <select
                  value={activityInput}
                  onChange={(e) =>
                    setActivityInput(e.target.value as DailyStudyLog['activityType'])
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-red-700"
                >
                  <option value="Học bài khóa">Học bài khóa</option>
                  <option value="Luyện viết Hán tự">Luyện viết Hán tự</option>
                  <option value="Nghe & Hội thoại">Nghe & Hội thoại</option>
                  <option value="Kiểm tra HSK">Kiểm tra HSK</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Thời lượng học (Phút): <span className="font-mono-tabular">{minutesInput} phút</span>
                </label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono-tabular focus:outline-none focus:border-red-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Số từ vựng Hán tự đã ôn tập
                </label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={wordsInput}
                  onChange={(e) => setWordsInput(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono-tabular focus:outline-none focus:border-red-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Ghi chú nội dung bài học / từ vựng tâm đắc
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Luyện viết 15 chữ Hán bài 2, nắm vững cách dùng câu chữ 把 (bǎ)..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-red-700"
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Lưu vào Nhật ký Tiến độ Hàng ngày</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 5 cols: Mastered Hanzi Notebook */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Sổ Tay Hán Tự Đã Thuộc Lòng
              </h2>
              <p className="text-xs text-slate-500">
                Các từ vựng bạn đã đánh dấu thuộc trong Phòng học Hán tự
              </p>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-red-800">
              {masteredVocabObjects.length}/{allVocabulary.length} từ
            </span>
          </div>

          {masteredVocabObjects.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="text-sm font-medium text-slate-700">
                Chưa có từ vựng nào được đánh dấu thuộc lòng
              </div>
              <p className="text-xs text-slate-500">
                Hãy bấm nút "+ Lưu vào sổ từ" tại Phòng học Hán tự để thêm từ vào danh sách ôn tập.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {masteredVocabObjects.map((vocab) => (
                <div
                  key={vocab.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hanzi text-2xl font-semibold text-slate-900 w-14">
                      {vocab.hanzi}
                    </span>
                    <div>
                      <div className="text-xs font-mono-tabular text-red-800">
                        {vocab.pinyin} · {vocab.sinoVietnamese}
                      </div>
                      <div className="text-sm font-medium text-slate-800">{vocab.meaning}</div>
                      <div className="text-[11px] text-slate-500">
                        {vocab.hskLevel} · Bộ thủ: {vocab.radical}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => controller.actionSpeakMandarin(vocab.hanzi)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => controller.actionToggleVocabularyMastery(vocab.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 whitespace-nowrap"
                    >
                      Bỏ lưu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* High-Density Daily Study Ledger Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Bảng Kê Chi Tiết Nhật Ký Học Tập Hàng Ngày
            </h2>
            <p className="text-xs text-slate-500">
              Lọc theo loại hoạt động hoặc tìm kiếm theo ghi chú bài học
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm nhật ký..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-red-700"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(
                [
                  'ALL',
                  'Học bài khóa',
                  'Luyện viết Hán tự',
                  'Nghe & Hội thoại',
                  'Kiểm tra HSK',
                ] as const
              ).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityFilter(type)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activityFilter === type
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type === 'ALL' ? 'Tất cả' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th className="py-3 px-3 font-medium">Ngày học</th>
                <th className="py-3 px-3 font-medium">Hoạt động</th>
                <th className="py-3 px-3 font-medium">Nội dung ghi chú</th>
                <th className="py-3 px-3 font-medium text-right">Thời lượng</th>
                <th className="py-3 px-3 font-medium text-right">Từ vựng</th>
                <th className="py-3 px-3 font-medium">Trạng thái mục tiêu</th>
                <th className="py-3 px-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-mono-tabular text-xs text-slate-700 whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="py-3 px-3 text-xs font-medium text-slate-900 whitespace-nowrap">
                    {log.activityType}
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-600 max-w-md">{log.note}</td>
                  <td className="py-3 px-3 font-mono-tabular text-xs font-semibold text-slate-900 text-right whitespace-nowrap">
                    {log.minutesStudied} phút
                  </td>
                  <td className="py-3 px-3 font-mono-tabular text-xs text-slate-700 text-right whitespace-nowrap">
                    {log.wordsReviewed} từ
                  </td>
                  <td className="py-3 px-3 text-xs whitespace-nowrap">
                    {log.goalMet ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đạt định mức</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Dưới {progress.dailyGoalMinutes}p</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => controller.actionDeleteStudyLog(log.id)}
                      className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
