/**
 * [MVC ARCHITECTURE - MODEL LAYER]
 * File: src/models/ProgressModel.ts
 * Vai trò: Quản lý dữ liệu Tiến độ học tập hàng ngày (Daily Study Logs),
 * Chuỗi ngày học liên tiếp (Streak), Mục tiêu phút học/ngày và Danh sách Hán tự đã thuộc.
 */

export interface DailyStudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  minutesStudied: number;
  wordsReviewed: number;
  lessonsCompleted: number;
  activityType: 'Học bài khóa' | 'Luyện viết Hán tự' | 'Kiểm tra HSK' | 'Nghe & Hội thoại';
  note: string;
  goalMet: boolean;
}

export interface LearnerProfileState {
  studentName: string;
  targetHsk: string;
  dailyGoalMinutes: number;
  streakDays: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  masteredVocabIds: string[];
  dailyLogs: DailyStudyLog[];
}

const STORAGE_KEY_PROGRESS = 'hoavan_mvc_progress_v1';

const DEFAULT_LOGS: DailyStudyLog[] = [
  {
    id: 'log-1',
    date: '2026-09-25',
    minutesStudied: 35,
    wordsReviewed: 18,
    lessonsCompleted: 1,
    activityType: 'Học bài khóa',
    note: 'Hoàn thành Bài 1: Biến điệu thanh 3 và câu chữ 是 (shì).',
    goalMet: true,
  },
  {
    id: 'log-2',
    date: '2026-09-26',
    minutesStudied: 30,
    wordsReviewed: 14,
    lessonsCompleted: 1,
    activityType: 'Luyện viết Hán tự',
    note: 'Tập viết quy tắc bút thuận 8 bộ thủ cơ bản: Nhân, Nữ, Khẩu, Ngôn.',
    goalMet: true,
  },
  {
    id: 'log-3',
    date: '2026-09-27',
    minutesStudied: 20,
    wordsReviewed: 10,
    lessonsCompleted: 0,
    activityType: 'Nghe & Hội thoại',
    note: 'Luyện nghe hội thoại mua sắm tại hiệu sách Bắc Kinh.',
    goalMet: false,
  },
  {
    id: 'log-4',
    date: '2026-09-28',
    minutesStudied: 45,
    wordsReviewed: 24,
    lessonsCompleted: 1,
    activityType: 'Học bài khóa',
    note: 'Nắm vững cấu trúc thời gian từ lớn đến nhỏ và cách đọc giờ.',
    goalMet: true,
  },
  {
    id: 'log-5',
    date: '2026-09-29',
    minutesStudied: 40,
    wordsReviewed: 22,
    lessonsCompleted: 1,
    activityType: 'Kiểm tra HSK',
    note: 'Làm bài kiểm tra năng lực HSK đạt 80/100 điểm (Trình độ HSK 3).',
    goalMet: true,
  },
  {
    id: 'log-6',
    date: '2026-09-30',
    minutesStudied: 35,
    wordsReviewed: 16,
    lessonsCompleted: 1,
    activityType: 'Học bài khóa',
    note: 'Nghiên cứu chuyên đề câu chữ 把 (bǎ) và bổ ngữ kết quả.',
    goalMet: true,
  },
  {
    id: 'log-7',
    date: '2026-10-01',
    minutesStudied: 25,
    wordsReviewed: 12,
    lessonsCompleted: 1,
    activityType: 'Luyện viết Hán tự',
    note: 'Ôn tập từ vựng HSK 3: 影响 (Ảnh hưởng), 坚持 (Kiên trì), 经验 (Kinh nghiệm).',
    goalMet: false,
  },
];

const INITIAL_STATE: LearnerProfileState = {
  studentName: 'Nguyễn Minh Khôi',
  targetHsk: 'HSK 4 (Trung – Cao cấp)',
  dailyGoalMinutes: 30,
  streakDays: 7,
  enrolledCourseIds: ['course-hsk12', 'course-hsk34'],
  completedLessonIds: ['les-101-1'],
  masteredVocabIds: ['voc-1', 'voc-2', 'voc-3'],
  dailyLogs: DEFAULT_LOGS,
};

export class ProgressModel {
  private state: LearnerProfileState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): LearnerProfileState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(INITIAL_STATE));
        return INITIAL_STATE;
      }
      return JSON.parse(saved);
    } catch {
      return INITIAL_STATE;
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(this.state));
    } catch {
      // Ignore storage quota issues
    }
  }

  public getState(): LearnerProfileState {
    return { ...this.state };
  }

  public setDailyGoalMinutes(minutes: number): LearnerProfileState {
    const clamped = Math.max(10, Math.min(120, minutes));
    const updatedLogs = this.state.dailyLogs.map((log) => ({
      ...log,
      goalMet: log.minutesStudied >= clamped,
    }));
    this.state = {
      ...this.state,
      dailyGoalMinutes: clamped,
      dailyLogs: updatedLogs,
    };
    this.persist();
    return this.getState();
  }

  public toggleVocabularyMastery(vocabId: string): LearnerProfileState {
    const exists = this.state.masteredVocabIds.includes(vocabId);
    const masteredVocabIds = exists
      ? this.state.masteredVocabIds.filter((id) => id !== vocabId)
      : [...this.state.masteredVocabIds, vocabId];

    this.state = {
      ...this.state,
      masteredVocabIds,
    };
    this.persist();
    return this.getState();
  }

  public toggleLessonCompleted(lessonId: string, durationMinutes: number, lessonTitle: string): LearnerProfileState {
    const alreadyDone = this.state.completedLessonIds.includes(lessonId);
    const completedLessonIds = alreadyDone
      ? this.state.completedLessonIds.filter((id) => id !== lessonId)
      : [...this.state.completedLessonIds, lessonId];

    this.state = {
      ...this.state,
      completedLessonIds,
    };

    if (!alreadyDone) {
      this.addStudyLog({
        date: '2026-10-01',
        minutesStudied: durationMinutes,
        wordsReviewed: 6,
        lessonsCompleted: 1,
        activityType: 'Học bài khóa',
        note: `Hoàn thành bài khóa: ${lessonTitle}`,
      });
    } else {
      this.persist();
    }

    return this.getState();
  }

  public enrollCourse(courseId: string): LearnerProfileState {
    if (!this.state.enrolledCourseIds.includes(courseId)) {
      this.state = {
        ...this.state,
        enrolledCourseIds: [...this.state.enrolledCourseIds, courseId],
      };
      this.persist();
    }
    return this.getState();
  }

  public addStudyLog(entry: {
    date: string;
    minutesStudied: number;
    wordsReviewed: number;
    lessonsCompleted: number;
    activityType: DailyStudyLog['activityType'];
    note: string;
  }): LearnerProfileState {
    const existingIndex = this.state.dailyLogs.findIndex(
      (l) => l.date === entry.date && l.activityType === entry.activityType && l.note === entry.note
    );

    const newLog: DailyStudyLog = {
      id: `log-${Date.now()}`,
      date: entry.date,
      minutesStudied: Number(entry.minutesStudied),
      wordsReviewed: Number(entry.wordsReviewed),
      lessonsCompleted: Number(entry.lessonsCompleted),
      activityType: entry.activityType,
      note: entry.note.trim() || 'Ôn tập từ vựng và ngữ pháp Hán ngữ hàng ngày.',
      goalMet: Number(entry.minutesStudied) >= this.state.dailyGoalMinutes,
    };

    let updatedLogs = [...this.state.dailyLogs];
    if (existingIndex >= 0) {
      updatedLogs[existingIndex] = newLog;
    } else {
      updatedLogs = [newLog, ...updatedLogs];
    }

    // Sort descending by date for history table
    updatedLogs.sort((a, b) => (a.date < b.date ? 1 : -1));

    // Recalculate distinct dates studied
    const uniqueDates = new Set(updatedLogs.map((l) => l.date));

    this.state = {
      ...this.state,
      streakDays: Math.max(this.state.streakDays, uniqueDates.size),
      dailyLogs: updatedLogs,
    };
    this.persist();
    return this.getState();
  }

  public deleteStudyLog(logId: string): LearnerProfileState {
    this.state = {
      ...this.state,
      dailyLogs: this.state.dailyLogs.filter((l) => l.id !== logId),
    };
    this.persist();
    return this.getState();
  }

  public resetToDefault(): LearnerProfileState {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(INITIAL_STATE));
    this.state = INITIAL_STATE;
    return this.getState();
  }
}
