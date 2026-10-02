/**
 * [MVC ARCHITECTURE - CONTROLLER LAYER]
 * File: src/controllers/LearningController.ts
 * Vai trò: Điều phối luồng dữ liệu trung gian giữa Models (CourseModel, AssessmentModel, ProgressModel)
 * và các Views (CoursesView, AssessmentView, ProgressView, MvcGuideView).
 * Mọi thao tác từ người dùng trên View đều gọi qua các Action của Controller này.
 */

import { Course, CourseModel, VocabularyItem } from '../models/CourseModel';
import {
  AssessmentModel,
  AssessmentQuestion,
  AssessmentSubmissionRecord,
} from '../models/AssessmentModel';
import { DailyStudyLog, LearnerProfileState, ProgressModel } from '../models/ProgressModel';

type StateChangeListener = () => void;

export class LearningController {
  private courseModel: CourseModel;
  private assessmentModel: AssessmentModel;
  private progressModel: ProgressModel;
  private listeners: Set<StateChangeListener> = new Set();

  constructor() {
    this.courseModel = new CourseModel();
    this.assessmentModel = new AssessmentModel();
    this.progressModel = new ProgressModel();
  }

  public subscribe(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyViews(): void {
    this.listeners.forEach((listener) => listener());
  }

  // --- READ QUERIES CHO VIEWS ---
  public getCourses(): Course[] {
    return this.courseModel.getAllCourses();
  }

  public getAllVocabulary(): VocabularyItem[] {
    return this.courseModel.getAllVocabulary();
  }

  public getAssessmentQuestions(
    filter: 'all' | 'beginner' | 'intermediate'
  ): AssessmentQuestion[] {
    return this.assessmentModel.getQuestions(filter);
  }

  public getAssessmentHistory(): AssessmentSubmissionRecord[] {
    return this.assessmentModel.getHistory();
  }

  public getLearnerProgress(): LearnerProfileState {
    return this.progressModel.getState();
  }

  // --- CONTROLLER ACTIONS (NHẬN SỰ KIỆN TỪ VIEW -> CẬP NHẬT MODEL -> THÔNG BÁO VIEW) ---
  public actionEnrollCourse(courseId: string): void {
    this.progressModel.enrollCourse(courseId);
    this.notifyViews();
  }

  public actionToggleLessonCompleted(
    lessonId: string,
    durationMinutes: number,
    lessonTitle: string
  ): void {
    this.progressModel.toggleLessonCompleted(lessonId, durationMinutes, lessonTitle);
    this.notifyViews();
  }

  public actionToggleVocabularyMastery(vocabId: string): void {
    this.progressModel.toggleVocabularyMastery(vocabId);
    this.notifyViews();
  }

  public actionSetDailyGoalMinutes(minutes: number): void {
    this.progressModel.setDailyGoalMinutes(minutes);
    this.notifyViews();
  }

  public actionLogStudySession(entry: {
    date: string;
    minutesStudied: number;
    wordsReviewed: number;
    lessonsCompleted: number;
    activityType: DailyStudyLog['activityType'];
    note: string;
  }): void {
    this.progressModel.addStudyLog(entry);
    this.notifyViews();
  }

  public actionDeleteStudyLog(logId: string): void {
    this.progressModel.deleteStudyLog(logId);
    this.notifyViews();
  }

  public actionSubmitAssessment(
    questions: AssessmentQuestion[],
    selectedAnswers: Record<string, string>,
    timeSpentSeconds: number,
    testModeLabel: string
  ): AssessmentSubmissionRecord {
    const result = this.assessmentModel.evaluateSubmission(
      questions,
      selectedAnswers,
      timeSpentSeconds,
      testModeLabel
    );

    // Đồng bộ tự động sang ProgressModel để ghi nhận tiến độ học tập trong ngày
    const minutesSpent = Math.max(5, Math.round(timeSpentSeconds / 60));
    this.progressModel.addStudyLog({
      date: result.submittedAt,
      minutesStudied: minutesSpent,
      wordsReviewed: questions.length * 2,
      lessonsCompleted: 0,
      activityType: 'Kiểm tra HSK',
      note: `Hoàn thành bài thi [${testModeLabel}]: đạt ${result.score}/${result.maxScore} điểm (${result.evaluatedLevel}).`,
    });

    this.notifyViews();
    return result;
  }

  public actionResetDemoData(): void {
    this.progressModel.resetToDefault();
    this.notifyViews();
  }

  public actionSpeakMandarin(text: string, rate = 0.88): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Fallback silent if browser blocks speech synthesis
    }
  }
}

export const appController = new LearningController();
