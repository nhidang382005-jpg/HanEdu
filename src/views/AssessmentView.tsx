/**
 * [MVC ARCHITECTURE - VIEW LAYER]
 * File: src/views/AssessmentView.tsx
 * Vai trò: Giao diện Bài kiểm tra năng lực Hán ngữ (HSK Placement & Competency Assessment).
 * Hỗ trợ chọn cấp độ đề thi, bấm giờ tự động, phát âm câu hỏi nghe, chấm điểm kèm giải thích ngữ pháp
 * và đồng bộ kết quả trực tiếp vào Nhật ký học tập hàng ngày thông qua LearningController.
 */

import React, { useEffect, useState } from 'react';
import { Volume2, CheckCircle2, AlertCircle, RotateCcw, Award, Clock } from 'lucide-react';
import {
  AssessmentQuestion,
  AssessmentSubmissionRecord,
} from '../models/AssessmentModel';
import { LearningController } from '../controllers/LearningController';

interface AssessmentViewProps {
  controller: LearningController;
  history: AssessmentSubmissionRecord[];
  onNavigateToProgress: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  controller,
  history,
  onNavigateToProgress,
}) => {
  const [testMode, setTestMode] = useState<'all' | 'beginner' | 'intermediate'>('all');
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(() =>
    controller.getAssessmentQuestions('all')
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittedRecord, setSubmittedRecord] = useState<AssessmentSubmissionRecord | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const list = controller.getAssessmentQuestions(testMode);
    setQuestions(list);
    setSelectedAnswers({});
    setSubmittedRecord(null);
    setElapsedSeconds(0);
  }, [testMode, controller]);

  useEffect(() => {
    if (submittedRecord) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submittedRecord]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submittedRecord) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitTest = () => {
    const modeLabel =
      testMode === 'all'
        ? 'Đánh giá tổng hợp HSK 1–4'
        : testMode === 'beginner'
        ? 'Đề sơ cấp HSK 1–2'
        : 'Đề trung cấp HSK 3–4';

    const record = controller.actionSubmitAssessment(
      questions,
      selectedAnswers,
      elapsedSeconds,
      modeLabel
    );
    setSubmittedRecord(record);
  };

  const handleResetTest = () => {
    setSelectedAnswers({});
    setSubmittedRecord(null);
    setElapsedSeconds(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-10">
      {/* Header & Test Mode Selector */}
      <section className="bg-[#FFFDF9] border border-[#E6DEC8] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E6DEC8] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-600 font-semibold">
              <span>Trung tâm khảo thí Hán ngữ quốc tế HanEdu</span>
              <span aria-hidden="true">·</span>
              <span>Chấm điểm tự động chuẩn HSK 3.0</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1"
              style={{ textWrap: 'balance' }}
            >
              Luyện Thi & Kiểm Tra Năng Lực HSK HanEdu
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Đánh giá toàn diện 4 kỹ năng: Ngữ âm Pinyin, Nhận diện Bộ thủ Hán tự, Cấu trúc Ngữ pháp
              và Đọc hiểu ngữ cảnh. Kết quả tự động lưu vào tiến độ học tập trong ngày.
            </p>
          </div>

          {/* Segmented Test Filter */}
          <div className="flex items-center gap-1 p-1 bg-[#F2ECE1] rounded-xl self-start">
            {(
              [
                { id: 'all', label: 'Tổng hợp HSK 1–4 (7 câu)' },
                { id: 'beginner', label: 'Sơ cấp HSK 1–2' },
                { id: 'intermediate', label: 'Trung cấp HSK 3–4' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTestMode(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  testMode === tab.id
                    ? 'bg-[#FFFDF9] text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar (Tabular Numerals) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F5EFE6] px-4 py-3 rounded-xl border border-[#E6DEC8]">
          <div className="flex items-center gap-6 text-xs text-slate-600 tabular-nums">
            <div>
              Đã trả lời:{' '}
              <span className="font-semibold text-slate-900">
                {answeredCount}/{questions.length} câu hỏi
              </span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Thời gian làm bài:</span>
              <span className="font-mono-tabular font-semibold text-sky-700">
                {formatTime(elapsedSeconds)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {submittedRecord ? (
              <button
                onClick={handleResetTest}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại đề thi này</span>
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap"
              >
                Nộp bài & Chấm điểm ngay ({answeredCount}/{questions.length})
              </button>
            )}
          </div>
        </div>

        {/* Evaluation Result Banner (When Submitted) */}
        {submittedRecord && (
          <div className="p-6 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Kết quả phân loại năng lực Hán ngữ chính thức</span>
                </div>
                <h2 className="text-2xl font-semibold">
                  Trình độ đề xuất: {submittedRecord.evaluatedLevel}
                </h2>
                <p className="text-xs text-slate-300">
                  Kết quả bài thi đã được Controller đồng bộ tự động vào Nhật ký tiến độ học tập ngày{' '}
                  {submittedRecord.submittedAt}.
                </p>
              </div>

              <div className="flex items-center gap-6 font-mono-tabular">
                <div>
                  <div className="text-xs text-slate-400">Tổng điểm</div>
                  <div className="text-2xl font-semibold text-amber-300">
                    {submittedRecord.score}/{submittedRecord.maxScore}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Độ chính xác</div>
                  <div className="text-2xl font-semibold text-white">
                    {submittedRecord.accuracyPercent}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Số câu đúng</div>
                  <div className="text-2xl font-semibold text-emerald-400">
                    {submittedRecord.correctCount}/{submittedRecord.totalQuestions}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-300">
                Xem giải thích chi tiết từng câu hỏi bên dưới để nắm vững cấu trúc ngữ pháp.
              </span>
              <button
                onClick={onNavigateToProgress}
                className="px-3.5 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
              >
                Xem Nhật ký Tiến độ đã cập nhật →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Question List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          {questions.map((q, index) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctOptionId;

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 tabular-nums">
                  <div>
                    <span className="font-semibold text-slate-900">Câu 0{index + 1}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{q.section}</span>
                    <span aria-hidden="true"> · </span>
                    <span>Mục tiêu {q.hskTarget}</span>
                  </div>
                  <div className="font-mono-tabular font-medium text-slate-700">
                    {q.points} điểm
                  </div>
                </div>

                {q.promptHanzi && (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-hanzi text-xl font-medium text-slate-900">
                        {q.promptHanzi}
                      </div>
                      {q.promptPinyin && (
                        <div className="text-xs text-red-800 font-mono-tabular mt-1">
                          {q.promptPinyin}
                        </div>
                      )}
                    </div>
                    {q.audioText && (
                      <button
                        type="button"
                        onClick={() => controller.actionSpeakMandarin(q.audioText!)}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-800 flex items-center gap-1.5 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-red-700" />
                        <span>Nghe phát âm</span>
                      </button>
                    )}
                  </div>
                )}

                <p className="text-sm font-medium text-slate-900">{q.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt) => {
                    const isSelected = userChoice === opt.id;
                    let optionStyle =
                      'bg-white border-slate-200 text-slate-800 hover:border-slate-300';

                    if (submittedRecord) {
                      if (opt.id === q.correctOptionId) {
                        optionStyle =
                          'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium';
                      } else if (isSelected && opt.id !== q.correctOptionId) {
                        optionStyle = 'bg-red-50 border-red-400 text-red-900';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-slate-900 border-slate-900 text-white font-medium';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        className={`p-3 rounded-lg border text-left text-xs transition-colors flex items-center justify-between gap-2 ${optionStyle}`}
                      >
                        <span>
                          <strong className="uppercase mr-1.5">{opt.id}.</strong>
                          {opt.label}
                        </span>
                        {submittedRecord && opt.id === q.correctOptionId && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {submittedRecord && isSelected && opt.id !== q.correctOptionId && (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Grammar & Vocabulary Explanation after submission */}
                {submittedRecord && (
                  <div
                    className={`p-4 rounded-lg border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-slate-800'
                    }`}
                  >
                    <div className="font-semibold mb-1">
                      {isCorrect
                        ? '✓ Chính xác (+' + q.points + ' điểm)'
                        : `✕ Chưa chính xác (Đáp án đúng: ${q.correctOptionId.toUpperCase()})`}
                    </div>
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Assessment History & Rubric Matrix */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-900">
              Thang Quy Đổi Trình Độ HSK Chuẩn
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">85% – 100% số điểm</span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  ● HSK 4 (Trung – Cao cấp)
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">65% – 84% số điểm</span>
                <span className="font-semibold text-sky-700 tabular-nums">
                  ● HSK 3 (Trung cấp)
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">45% – 64% số điểm</span>
                <span className="font-semibold text-amber-700 tabular-nums">
                  ▲ HSK 2 (Sơ – Trung cấp)
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-600">Dưới 45% số điểm</span>
                <span className="font-semibold text-slate-700 tabular-nums">
                  ○ HSK 1 (Nhập môn)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Lịch Sử Khảo Thí Gần Đây</h3>
              <span className="text-xs text-slate-500 tabular-nums">{history.length} lượt thi</span>
            </div>

            <div className="divide-y divide-slate-100">
              {history.map((item) => (
                <div key={item.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-900">{item.testMode}</span>
                    <span className="font-mono-tabular font-semibold text-red-800">
                      {item.score}/{item.maxScore} ({item.accuracyPercent}%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                    <span>Đánh giá: {item.evaluatedLevel}</span>
                    <span>Ngày: {item.submittedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
