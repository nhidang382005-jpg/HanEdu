/**
 * [MVC ARCHITECTURE - VIEW LAYER]
 * File: src/views/MvcGuideView.tsx
 * Vai trò: Trung tâm Kịch bản Cơ sở dữ liệu Microsoft SQL Server (T-SQL / SSMS),
 * Kiến trúc Model-View-Controller (MVC) và Hướng dẫn tích hợp Visual Studio.
 */

import React, { useState } from 'react';
import {
  Copy,
  Check,
  FolderTree,
  Terminal,
  Database,
  Download,
  Play,
  Table as TableIcon,
} from 'lucide-react';
import { LearningController } from '../controllers/LearningController';

interface MvcGuideViewProps {
  controller?: LearningController;
}

export const FULL_SQL_SERVER_SCRIPT = `/* ============================================================================
 * HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU: MICROSOFT SQL SERVER (T-SQL / SSMS)
 * Dự án: Hoa Văn Học Viện - Hệ Thống Học Tiếng Trung Theo Mô Hình MVC
 * Tương thích: SQL Server 2019 / 2022 / SQL Express / LocalDB (Visual Studio)
 * Lưu ý quan trọng: Sử dụng kiểu dữ liệu NVARCHAR và tiền tố N'...' để lưu trữ
 * chính xác chữ Hán (Hanzi), phiên âm Pinyin có dấu thanh và tiếng Việt.
 * ============================================================================ */

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'HoaVanAcademyDB')
BEGIN
    ALTER DATABASE HoaVanAcademyDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE HoaVanAcademyDB;
END
GO

CREATE DATABASE HoaVanAcademyDB;
GO

USE HoaVanAcademyDB;
GO

-- 1. BẢNG HỌC VIÊN (Students)
CREATE TABLE dbo.Students (
    StudentId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    TargetHskLevel NVARCHAR(50) NOT NULL DEFAULT N'HSK 4 (Trung – Cao cấp)',
    DailyGoalMinutes INT NOT NULL DEFAULT 30 CHECK (DailyGoalMinutes BETWEEN 10 AND 240),
    StreakDays INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- 2. BẢNG KHÓA HỌC HÁN NGỮ (Courses)
CREATE TABLE dbo.Courses (
    CourseId VARCHAR(30) PRIMARY KEY,
    CourseCode VARCHAR(20) NOT NULL UNIQUE,
    Title NVARCHAR(200) NOT NULL,
    ChineseSubtitle NVARCHAR(200) NOT NULL,
    LevelCategory NVARCHAR(100) NOT NULL,
    HskBadge NVARCHAR(50) NOT NULL,
    TotalHours INT NOT NULL CHECK (TotalHours > 0),
    VocabularyCount INT NOT NULL DEFAULT 0,
    InstructorName NVARCHAR(120) NOT NULL,
    Description NVARCHAR(1000) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- 3. BẢNG BÀI GIẢNG TRONG KHÓA HỌC (Lessons)
CREATE TABLE dbo.Lessons (
    LessonId VARCHAR(30) PRIMARY KEY,
    CourseId VARCHAR(30) NOT NULL,
    LessonOrder INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    ChineseTitle NVARCHAR(200) NOT NULL,
    PinyinTitle NVARCHAR(200) NOT NULL,
    DurationMinutes INT NOT NULL DEFAULT 25,
    Summary NVARCHAR(1000) NULL,
    CONSTRAINT FK_Lessons_Courses FOREIGN KEY (CourseId)
        REFERENCES dbo.Courses(CourseId) ON DELETE CASCADE
);
GO

-- 4. BẢNG TỪ VỰNG HÁN TỰ & CHIẾT TỰ BỘ THỦ (Vocabulary)
CREATE TABLE dbo.Vocabulary (
    VocabId VARCHAR(30) PRIMARY KEY,
    LessonId VARCHAR(30) NOT NULL,
    Hanzi NVARCHAR(50) NOT NULL,
    Pinyin NVARCHAR(100) NOT NULL,
    ToneNote NVARCHAR(150) NULL,
    SinoVietnamese NVARCHAR(100) NOT NULL, -- Âm Hán Việt
    VietnameseMeaning NVARCHAR(250) NOT NULL,
    RadicalInfo NVARCHAR(100) NOT NULL,    -- Bộ thủ
    StrokeCount INT NOT NULL CHECK (StrokeCount > 0),
    ExampleHanzi NVARCHAR(300) NULL,
    ExamplePinyin NVARCHAR(300) NULL,
    ExampleMeaning NVARCHAR(300) NULL,
    HskLevel NVARCHAR(30) NOT NULL,
    CONSTRAINT FK_Vocabulary_Lessons FOREIGN KEY (LessonId)
        REFERENCES dbo.Lessons(LessonId) ON DELETE CASCADE
);
GO

-- 5. BẢNG NGỮ PHÁP TRỌNG ĐIỂM (GrammarPoints)
CREATE TABLE dbo.GrammarPoints (
    GrammarId VARCHAR(30) PRIMARY KEY,
    LessonId VARCHAR(30) NOT NULL,
    Title NVARCHAR(250) NOT NULL,
    StructureFormula NVARCHAR(300) NOT NULL,
    Explanation NVARCHAR(1000) NOT NULL,
    ExampleHanzi NVARCHAR(300) NOT NULL,
    ExamplePinyin NVARCHAR(300) NOT NULL,
    ExampleMeaning NVARCHAR(300) NOT NULL,
    CONSTRAINT FK_Grammar_Lessons FOREIGN KEY (LessonId)
        REFERENCES dbo.Lessons(LessonId) ON DELETE CASCADE
);
GO

-- 6. BẢNG GHI DANH & SỔ TAY TỪ VỰNG ĐÃ THUỘC
CREATE TABLE dbo.Enrollments (
    EnrollmentId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    CourseId VARCHAR(30) NOT NULL,
    EnrolledAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_Student_Course UNIQUE (StudentId, CourseId),
    CONSTRAINT FK_Enrollments_Students FOREIGN KEY (StudentId) REFERENCES dbo.Students(StudentId) ON DELETE CASCADE,
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(CourseId) ON DELETE CASCADE
);

CREATE TABLE dbo.StudentVocabularyMastery (
    MasteryId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    VocabId VARCHAR(30) NOT NULL,
    MasteredAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_Student_Vocab UNIQUE (StudentId, VocabId),
    CONSTRAINT FK_Mastery_Students FOREIGN KEY (StudentId) REFERENCES dbo.Students(StudentId) ON DELETE CASCADE,
    CONSTRAINT FK_Mastery_Vocabulary FOREIGN KEY (VocabId) REFERENCES dbo.Vocabulary(VocabId) ON DELETE CASCADE
);
GO

-- 7. BẢNG CÂU HỎI & KẾT QUẢ BÀI KIỂM TRA NĂNG LỰC HSK
CREATE TABLE dbo.AssessmentQuestions (
    QuestionId VARCHAR(30) PRIMARY KEY,
    SectionName NVARCHAR(100) NOT NULL,
    HskTarget NVARCHAR(20) NOT NULL,
    Points INT NOT NULL DEFAULT 10,
    PromptHanzi NVARCHAR(300) NULL,
    PromptPinyin NVARCHAR(300) NULL,
    QuestionText NVARCHAR(500) NOT NULL,
    OptionA NVARCHAR(200) NOT NULL,
    OptionB NVARCHAR(200) NOT NULL,
    OptionC NVARCHAR(200) NOT NULL,
    OptionD NVARCHAR(200) NOT NULL,
    CorrectOption CHAR(1) NOT NULL CHECK (CorrectOption IN ('a', 'b', 'c', 'd')),
    Explanation NVARCHAR(1000) NOT NULL
);

CREATE TABLE dbo.AssessmentSubmissions (
    SubmissionId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    SubmittedDate DATE NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    TestMode NVARCHAR(150) NOT NULL,
    Score INT NOT NULL,
    MaxScore INT NOT NULL,
    AccuracyPercent INT NOT NULL,
    EvaluatedLevel NVARCHAR(100) NOT NULL,
    TimeSpentSeconds INT NOT NULL,
    CorrectCount INT NOT NULL,
    TotalQuestions INT NOT NULL,
    CONSTRAINT FK_Submissions_Students FOREIGN KEY (StudentId)
        REFERENCES dbo.Students(StudentId) ON DELETE CASCADE
);
GO

-- 8. BẢNG NHẬT KÝ TIẾN ĐỘ HỌC TẬP HÀNG NGÀY (DailyStudyLogs)
CREATE TABLE dbo.DailyStudyLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    StudyDate DATE NOT NULL,
    MinutesStudied INT NOT NULL CHECK (MinutesStudied > 0),
    WordsReviewed INT NOT NULL DEFAULT 0,
    LessonsCompleted INT NOT NULL DEFAULT 0,
    ActivityType NVARCHAR(100) NOT NULL,
    StudyNote NVARCHAR(500) NOT NULL,
    GoalMet BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DailyLogs_Students FOREIGN KEY (StudentId)
        REFERENCES dbo.Students(StudentId) ON DELETE CASCADE
);

CREATE INDEX IX_DailyStudyLogs_StudentDate ON dbo.DailyStudyLogs(StudentId, StudyDate DESC);
GO

-- 9. STORED PROCEDURE: GHI NHẬN PHIÊN HỌC HÀNG NGÀY & CẬP NHẬT STREAK
CREATE OR ALTER PROCEDURE dbo.sp_LogDailyStudySession
    @StudentId INT,
    @StudyDate DATE,
    @MinutesStudied INT,
    @WordsReviewed INT,
    @LessonsCompleted INT,
    @ActivityType NVARCHAR(100),
    @StudyNote NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @DailyGoal INT = 30;
    SELECT @DailyGoal = DailyGoalMinutes FROM dbo.Students WHERE StudentId = @StudentId;

    DECLARE @GoalMet BIT = CASE WHEN @MinutesStudied >= @DailyGoal THEN 1 ELSE 0 END;
    DECLARE @ActualDate DATE = ISNULL(@StudyDate, CAST(SYSDATETIME() AS DATE));

    INSERT INTO dbo.DailyStudyLogs (
        StudentId, StudyDate, MinutesStudied, WordsReviewed, LessonsCompleted, ActivityType, StudyNote, GoalMet
    )
    VALUES (
        @StudentId, @ActualDate, @MinutesStudied, @WordsReviewed, @LessonsCompleted, @ActivityType, @StudyNote, @GoalMet
    );

    UPDATE dbo.Students
    SET StreakDays = (SELECT COUNT(DISTINCT StudyDate) FROM dbo.DailyStudyLogs WHERE StudentId = @StudentId)
    WHERE StudentId = @StudentId;
END;
GO

-- 10. STORED PROCEDURE: NỘP BÀI THI HSK & TỰ ĐỘNG ĐỒNG BỘ TIẾN ĐỘ NGÀY
CREATE OR ALTER PROCEDURE dbo.sp_SubmitHskAssessment
    @StudentId INT,
    @TestMode NVARCHAR(150),
    @Score INT,
    @MaxScore INT,
    @TimeSpentSeconds INT,
    @CorrectCount INT,
    @TotalQuestions INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Accuracy INT = CASE WHEN @MaxScore > 0 THEN ROUND((CAST(@Score AS FLOAT) / @MaxScore) * 100, 0) ELSE 0 END;
    DECLARE @EvaluatedLevel NVARCHAR(100) = N'HSK 1 (Nhập môn)';

    IF @Accuracy >= 85 SET @EvaluatedLevel = N'HSK 4 (Trung – Cao cấp)';
    ELSE IF @Accuracy >= 65 SET @EvaluatedLevel = N'HSK 3 (Trung cấp)';
    ELSE IF @Accuracy >= 45 SET @EvaluatedLevel = N'HSK 2 (Sơ – Trung cấp)';

    INSERT INTO dbo.AssessmentSubmissions (
        StudentId, SubmittedDate, TestMode, Score, MaxScore, AccuracyPercent, EvaluatedLevel, TimeSpentSeconds, CorrectCount, TotalQuestions
    )
    VALUES (
        @StudentId, CAST(SYSDATETIME() AS DATE), @TestMode, @Score, @MaxScore, @Accuracy, @EvaluatedLevel, @TimeSpentSeconds, @CorrectCount, @TotalQuestions
    );

    DECLARE @StudyMinutes INT = CASE WHEN @TimeSpentSeconds / 60 < 5 THEN 5 ELSE @TimeSpentSeconds / 60 END;
    DECLARE @AutoNote NVARCHAR(500) = CONCAT(N'Hoàn thành bài thi [', @TestMode, N']: đạt ', @Score, N'/', @MaxScore, N' điểm (', @EvaluatedLevel, N').');

    EXEC dbo.sp_LogDailyStudySession
        @StudentId = @StudentId,
        @StudyDate = NULL,
        @MinutesStudied = @StudyMinutes,
        @WordsReviewed = 14,
        @LessonsCompleted = 0,
        @ActivityType = N'Kiểm tra HSK',
        @StudyNote = @AutoNote;
END;
GO

-- 11. DỮ LIỆU MẪU (SEED DATA UNICODE HÁN TỰ)
INSERT INTO dbo.Students (FullName, Email, PasswordHash, TargetHskLevel, DailyGoalMinutes, StreakDays)
VALUES (N'Nguyễn Minh Khôi', 'minhkhoi.hsk@hoavan.edu.vn', 'AQAAAAEAACcQAAAAE...', N'HSK 4 (Trung – Cao cấp)', 30, 7);

INSERT INTO dbo.Courses (CourseId, CourseCode, Title, ChineseSubtitle, LevelCategory, HskBadge, TotalHours, VocabularyCount, InstructorName, Description)
VALUES
('course-hsk12', 'CHN-101', N'Nền Tảng Hán Ngữ & Giao Tiếp Sơ Cấp', N'初阶汉语与日常交际', N'Sơ cấp (HSK 1–2)', N'HSK 1–2', 36, 300, N'ThS. Lâm Nhã Kỳ (ĐH Ngôn ngữ Bắc Kinh)', N'Làm chủ ngữ âm Pinyin, quy tắc bút thuận 214 bộ thủ và 300 từ vựng cốt lõi.'),
('course-hsk34', 'CHN-202', N'Ngữ Pháp Trọng Điểm & Đọc Hiểu HSK 3–4', N'中级汉语语法与篇章阅读', N'Trung cấp (HSK 3–4)', N'HSK 3–4', 48, 900, N'TS. Trần Khải Minh (ĐH Phúc Đán Thượng Hải)', N'Chinh phục câu chữ 把 (bǎ), câu bị động chữ 被 (bèi) và bổ ngữ xu hướng phức hợp.'),
('course-business', 'CHN-305', N'Hán Ngữ Thương Mại & Đàm Phán Doanh Nghiệp', N'高级商务汉语与跨文化谈判', N'Cao cấp & Thương mại', N'HSK 5–6 · BCT', 54, 1500, N'PGS. Chu Văn Hạo (Học viện Kinh tế Thượng Hải)', N'Thuật ngữ hợp đồng ngoại thương, thư tín thương mại và đàm phán đối tác Trung Hoa.');

INSERT INTO dbo.Lessons (LessonId, CourseId, LessonOrder, Title, ChineseTitle, PinyinTitle, DurationMinutes, Summary)
VALUES
('les-101-1', 'course-hsk12', 1, N'Chào hỏi & Giới thiệu bản thân', N'你好，认识你很高兴', N'Nǐ hǎo, rènshi nǐ hěn gāoxìng', 25, N'Quy tắc biến điệu thanh 3 trong tiếng Trung và cách hỏi thăm lịch sự.'),
('les-202-1', 'course-hsk34', 1, N'Cấu trúc câu chữ 把 (Bǎ) & Bổ ngữ kết quả', N'请把这份报告放在桌子上', N'Qǐng bǎ zhè fèn bàogào fàng zài zhuōzi shàng', 35, N'Cách dùng giới từ 把 kết hợp bổ ngữ kết quả.');

INSERT INTO dbo.Vocabulary (VocabId, LessonId, Hanzi, Pinyin, ToneNote, SinoVietnamese, VietnameseMeaning, RadicalInfo, StrokeCount, ExampleHanzi, ExamplePinyin, ExampleMeaning, HskLevel)
VALUES
('voc-1', 'les-101-1', N'你好', N'nǐ hǎo', N'Thanh 3 + Thanh 3', N'NHĨ HẢO', N'Xin chào', N'亻(Nhân đứng) & 女 (Nữ)', 13, N'老师您好，请问您贵姓？', N'Lǎoshī nín hǎo, qǐngwèn nín guìxìng?', N'Em chào thầy/cô ạ, xin hỏi quý danh của thầy/cô là gì?', N'HSK 1'),
('voc-2', 'les-101-1', N'认识', N'rènshi', N'Thanh 4 + Thanh nhẹ', N'NHẬN THỨC', N'Quen biết, làm quen', N'讠(Ngôn)', 11, N'认识你我也很高兴。', N'Rènshi nǐ wǒ yě hěn gāoxìng.', N'Quen biết bạn tôi cũng rất vui.', N'HSK 1'),
('voc-3', 'les-101-1', N'学习', N'xuéxí', N'Thanh 2 + Thanh 2', N'HỌC TẬP', N'Học, học tập', N'子 (Tử) & 羽 (Vũ)', 11, N'我每天都努力学习汉语。', N'Wǒ měitiān dōu nǔlì xuéxí Hànyǔ.', N'Mỗi ngày tôi đều nỗ lực học tiếng Hán.', N'HSK 1'),
('voc-7', 'les-202-1', N'影响', N'yǐngxiǎng', N'Thanh 3 + Thanh 3', N'ẢNH HƯỞNG', N'Ảnh hưởng, tác động', N'彡 (Sam) & 口 (Khẩu)', 24, N'环境对一个人的习惯有很大的影响。', N'Huánjìng duì yí gè rén de xíguàn yǒu hěn dà de yǐngxiǎng.', N'Môi trường có ảnh hưởng rất lớn đối với thói quen của một người.', N'HSK 3'),
('voc-8', 'les-202-1', N'坚持', N'jiānchí', N'Thanh 1 + Thanh 2', N'KIÊN TRÌ', N'Kiên trì, bền bỉ', N'土 (Thổ) & 扌(Tài gảy)', 16, N'只要每天坚持复习，你的汉语水平一定会提高。', N'Zhǐyào měitiān jiānchí fùxí, nǐ de Hànyǔ shuǐpíng yídìng huì tígāo.', N'Chỉ cần mỗi ngày kiên trì ôn tập, trình độ tiếng Trung của bạn nhất định sẽ nâng cao.', N'HSK 4');

INSERT INTO dbo.DailyStudyLogs (StudentId, StudyDate, MinutesStudied, WordsReviewed, LessonsCompleted, ActivityType, StudyNote, GoalMet)
VALUES
(1, '2026-09-28', 45, 24, 1, N'Học bài khóa', N'Nắm vững cấu trúc thời gian từ lớn đến nhỏ và cách đọc giờ.', 1),
(1, '2026-09-29', 40, 22, 1, N'Kiểm tra HSK', N'Làm bài kiểm tra năng lực HSK đạt 80/100 điểm (Trình độ HSK 3).', 1),
(1, '2026-09-30', 35, 16, 1, N'Học bài khóa', N'Nghiên cứu chuyên đề câu chữ 把 (bǎ) và bổ ngữ kết quả.', 1),
(1, '2026-10-01', 25, 12, 1, N'Luyện viết Hán tự', N'Ôn tập từ vựng HSK 3: 影响 (Ảnh hưởng), 坚持 (Kiên trì).', 0);
GO`;

export const MvcGuideView: React.FC<MvcGuideViewProps> = ({ controller }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ideTab, setIdeTab] = useState<'sqlserver' | 'vs2022' | 'vscode'>('sqlserver');
  const [selectedQueryPreset, setSelectedQueryPreset] = useState<
    'vocab' | 'daily_logs' | 'courses' | 'assessments'
  >('vocab');

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSqlFile = () => {
    const blob = new Blob([FULL_SQL_SERVER_SCRIPT], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HoaVanAcademy_SQLServer.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const vsCodeCommands = `# Bước 1: Mở thư mục dự án trong Visual Studio Code
code .

# Bước 2: Cài đặt các gói thư viện phụ thuộc (Node.js >= 18)
npm install

# Bước 3: Khởi chạy máy chủ phát triển tại cổng 3000
npm run dev`;

  const aspNetControllerSnippet = `// 1. Chuỗi kết nối SQL Server trong appsettings.json (Visual Studio 2022)
{
  "ConnectionStrings": {
    "HoaVanSqlConnection": "Server=localhost\\\\SQLEXPRESS;Database=HoaVanAcademyDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

// 2. Controller C# gọi Stored Procedure SQL Server (Controllers/LearningController.cs)
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace HoaVanAcademy.Controllers
{
    public class LearningController : Controller
    {
        private readonly string _connStr;

        public LearningController(IConfiguration config)
        {
            _connStr = config.GetConnectionString("HoaVanSqlConnection")!;
        }

        [HttpPost]
        public async Task<IActionResult> LogDailyStudy(DateTime studyDate, int minutes, int words, string activity, string note)
        {
            using var conn = new SqlConnection(_connStr);
            using var cmd = new SqlCommand("dbo.sp_LogDailyStudySession", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@StudentId", 1);
            cmd.Parameters.AddWithValue("@StudyDate", studyDate);
            cmd.Parameters.AddWithValue("@MinutesStudied", minutes);
            cmd.Parameters.AddWithValue("@WordsReviewed", words);
            cmd.Parameters.AddWithValue("@LessonsCompleted", 1);
            cmd.Parameters.AddWithValue("@ActivityType", activity);
            cmd.Parameters.AddWithValue("@StudyNote", note);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            return RedirectToAction("Progress");
        }
    }
}`;

  const allVocab = controller ? controller.getAllVocabulary() : [];
  const progress = controller ? controller.getLearnerProgress() : null;
  const courses = controller ? controller.getCourses() : [];
  const assessments = controller ? controller.getAssessmentHistory() : [];

  const querySqlPreview: Record<typeof selectedQueryPreset, string> = {
    vocab: `SELECT TOP 10 VocabId, Hanzi, Pinyin, SinoVietnamese, VietnameseMeaning, RadicalInfo, StrokeCount, HskLevel
FROM HoaVanAcademyDB.dbo.Vocabulary
ORDER BY HskLevel ASC, StrokeCount ASC;`,
    daily_logs: `SELECT StudyDate, ActivityType, MinutesStudied, WordsReviewed,
       CASE WHEN GoalMet = 1 THEN N'Đạt mục tiêu' ELSE N'Chưa đủ định mức' END AS GoalStatus,
       StudyNote
FROM HoaVanAcademyDB.dbo.DailyStudyLogs
WHERE StudentId = 1
ORDER BY StudyDate DESC;`,
    courses: `SELECT CourseCode, Title, ChineseSubtitle, LevelCategory, TotalHours, VocabularyCount, InstructorName
FROM HoaVanAcademyDB.dbo.Courses;`,
    assessments: `SELECT SubmittedDate, TestMode, Score, MaxScore, AccuracyPercent, EvaluatedLevel, TimeSpentSeconds
FROM HoaVanAcademyDB.dbo.AssessmentSubmissions
WHERE StudentId = 1
ORDER BY SubmittedDate DESC;`,
  };

  return (
    <div className="space-y-10">
      {/* SECTION 01: MICROSOFT SQL SERVER (T-SQL / SSMS) SCRIPT & EXPLORER */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-red-700 font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Microsoft SQL Server (T-SQL / SSMS)</span>
              <span aria-hidden="true">·</span>
              <span>File: /database/HoaVanAcademy_SQLServer.sql</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1"
              style={{ textWrap: 'balance' }}
            >
              Cơ Sở Dữ Liệu SQL Server & Kiến Trúc MVC Visual Studio
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              Kịch bản T-SQL chuẩn chạy trực tiếp trên{' '}
              <strong>SQL Server Management Studio (SSMS)</strong> hoặc{' '}
              <strong>Visual Studio SQL Server Object Explorer</strong>. Sử dụng kiểu{' '}
              <code className="font-mono text-red-800">NVARCHAR</code> và tiền tố{' '}
              <code className="font-mono text-red-800">N&apos;...&apos;</code> để không bị lỗi
              font chữ Hán (Hanzi) và tiếng Việt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={() => copyText('full-sql', FULL_SQL_SERVER_SCRIPT)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {copiedId === 'full-sql' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Đã sao chép toàn bộ T-SQL</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép toàn bộ Script SQL Server</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadSqlFile}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file HoaVanAcademy_SQLServer.sql</span>
            </button>
          </div>
        </div>

        {/* Sơ đồ 8 Bảng Quan Hệ SQL Server */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-red-800">
              dbo.Courses & dbo.Lessons
            </div>
            <div className="text-sm font-semibold text-slate-900">Khóa Học & Bài Giảng</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quan hệ <code className="font-mono">1-N</code> (<code className="font-mono">CourseId</code>). Lưu mã khóa học, tiêu đề chữ Hán (<code className="font-mono">NVARCHAR</code>), cấp độ HSK và thời lượng.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-red-800">
              dbo.Vocabulary & dbo.GrammarPoints
            </div>
            <div className="text-sm font-semibold text-slate-900">Hán Tự & Ngữ Pháp</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lưu chữ Hán, phiên âm Pinyin, âm Hán Việt, bộ thủ (<code className="font-mono">RadicalInfo</code>), số nét (<code className="font-mono">StrokeCount</code>) và câu mẫu.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-red-800">
              dbo.AssessmentSubmissions
            </div>
            <div className="text-sm font-semibold text-slate-900">Khảo Thí Năng Lực HSK</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ghi nhận điểm thi, tỷ lệ chính xác, trình độ phân loại HSK và tự động kích hoạt Stored Procedure <code className="font-mono">sp_SubmitHskAssessment</code>.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5">
            <div className="text-xs font-mono-tabular font-semibold text-red-800">
              dbo.DailyStudyLogs
            </div>
            <div className="text-sm font-semibold text-slate-900">Tiến Độ Hàng Ngày</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Đánh chỉ mục <code className="font-mono">IX_DailyStudyLogs_StudentDate</code>, lưu số phút học, từ đã ôn và tự động tính <code className="font-mono">StreakDays</code>.
            </p>
          </div>
        </div>

        {/* Trình mô phỏng truy vấn SQL Server (SSMS Result Grid Preview) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <TableIcon className="w-4 h-4 text-amber-400" />
              <span>Trình Kiểm Thử Truy Vấn T-SQL Trực Tiếp (Đồng bộ dữ liệu thực từ Models)</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'vocab', label: 'SELECT dbo.Vocabulary' },
                  { id: 'daily_logs', label: 'SELECT dbo.DailyStudyLogs' },
                  { id: 'courses', label: 'SELECT dbo.Courses' },
                  { id: 'assessments', label: 'SELECT dbo.AssessmentSubmissions' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedQueryPreset(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-tabular transition-colors flex items-center gap-1 ${
                    selectedQueryPreset === tab.id
                      ? 'bg-red-700 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-950 text-emerald-300 font-mono-tabular text-xs border-b border-slate-800 overflow-x-auto">
            <pre>{querySqlPreview[selectedQueryPreset]}</pre>
          </div>

          <div className="overflow-x-auto bg-white max-h-72">
            {selectedQueryPreset === 'vocab' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono-tabular">
                    <th className="py-2.5 px-3">VocabId</th>
                    <th className="py-2.5 px-3">Hanzi (NVARCHAR)</th>
                    <th className="py-2.5 px-3">Pinyin</th>
                    <th className="py-2.5 px-3">SinoVietnamese</th>
                    <th className="py-2.5 px-3">VietnameseMeaning</th>
                    <th className="py-2.5 px-3">RadicalInfo</th>
                    <th className="py-2.5 px-3 text-right">StrokeCount</th>
                    <th className="py-2.5 px-3">HskLevel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {allVocab.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-500">{v.id}</td>
                      <td className="py-2 px-3 font-hanzi text-base font-semibold text-slate-900">
                        {v.hanzi}
                      </td>
                      <td className="py-2 px-3 text-red-800">{v.pinyin}</td>
                      <td className="py-2 px-3 text-slate-800">{v.sinoVietnamese}</td>
                      <td className="py-2 px-3 font-sans text-slate-700">{v.meaning}</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{v.radical}</td>
                      <td className="py-2 px-3 text-right font-semibold">{v.strokeCount}</td>
                      <td className="py-2 px-3 text-slate-700">{v.hskLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedQueryPreset === 'daily_logs' && progress && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono-tabular">
                    <th className="py-2.5 px-3">StudyDate</th>
                    <th className="py-2.5 px-3">ActivityType</th>
                    <th className="py-2.5 px-3 text-right">MinutesStudied</th>
                    <th className="py-2.5 px-3 text-right">WordsReviewed</th>
                    <th className="py-2.5 px-3">GoalStatus</th>
                    <th className="py-2.5 px-3">StudyNote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {progress.dailyLogs.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700">{l.date}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">
                        {l.activityType}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-900">
                        {l.minutesStudied}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-700">{l.wordsReviewed}</td>
                      <td className="py-2 px-3 font-sans">
                        {l.goalMet ? (
                          <span className="text-emerald-700 font-medium">● Đạt mục tiêu</span>
                        ) : (
                          <span className="text-amber-700 font-medium">▲ Chưa đủ định mức</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-600">{l.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedQueryPreset === 'courses' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono-tabular">
                    <th className="py-2.5 px-3">CourseCode</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">ChineseSubtitle</th>
                    <th className="py-2.5 px-3">LevelCategory</th>
                    <th className="py-2.5 px-3 text-right">TotalHours</th>
                    <th className="py-2.5 px-3 text-right">VocabularyCount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-red-800">{c.code}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">{c.title}</td>
                      <td className="py-2 px-3 font-hanzi text-sm text-slate-800">
                        {c.chineseSubtitle}
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-600">{c.level}</td>
                      <td className="py-2 px-3 text-right">{c.totalHours}</td>
                      <td className="py-2 px-3 text-right">{c.vocabularyCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {selectedQueryPreset === 'assessments' && (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-mono-tabular">
                    <th className="py-2.5 px-3">SubmittedDate</th>
                    <th className="py-2.5 px-3">TestMode</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 px-3 text-right">MaxScore</th>
                    <th className="py-2.5 px-3 text-right">AccuracyPercent</th>
                    <th className="py-2.5 px-3">EvaluatedLevel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono-tabular">
                  {assessments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-700">{a.submittedAt}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900">
                        {a.testMode}
                      </td>
                      <td className="py-2 px-3 text-right font-semibold text-red-800">{a.score}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{a.maxScore}</td>
                      <td className="py-2 px-3 text-right text-emerald-700 font-semibold">
                        {a.accuracyPercent}%
                      </td>
                      <td className="py-2 px-3 font-sans text-slate-800">{a.evaluatedLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 02: FULL T-SQL CODE VIEWER & VISUAL STUDIO SETUP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-red-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Cấu Trúc Thư Mục Dự Án MVC + SQL Server
            </h2>
          </div>

          <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs leading-relaxed overflow-x-auto">
{`hoa-van-hoc-vien-mvc/
├── database/
│   └── HoaVanAcademy_SQLServer.sql  # Script T-SQL chạy trên SSMS
├── src/
│   ├── models/                      # [M] Tầng Dữ liệu & Nghiệp vụ
│   │   ├── CourseModel.ts           # Khóa học, Bài giảng, Hán tự
│   │   ├── AssessmentModel.ts       # Đề thi HSK & Chấm điểm
│   │   └── ProgressModel.ts         # Tiến độ học tập hàng ngày
│   │
│   ├── controllers/                 # [C] Tầng Điều khiển trung gian
│   │   └── LearningController.ts
│   │
│   ├── views/                       # [V] Tầng Giao diện hiển thị
│   │   ├── CoursesView.tsx          # View Khóa học & Phòng Hán tự
│   │   ├── AssessmentView.tsx       # View Kiểm tra năng lực HSK
│   │   ├── ProgressView.tsx         # View Theo dõi tiến độ ngày
│   │   └── MvcGuideView.tsx         # View SQL Server & Hướng dẫn VS
│   │
│   └── App.tsx                      # Bộ định tuyến MVC`}
          </pre>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-semibold text-slate-900">
              Cách chạy file SQL trên SQL Server Management Studio (SSMS):
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>
                Mở <strong>SQL Server Management Studio (SSMS)</strong> và kết nối tới{' '}
                <code className="font-mono">localhost</code> hoặc{' '}
                <code className="font-mono">.\SQLEXPRESS</code>.
              </li>
              <li>
                Nhấn <strong>New Query</strong> (hoặc mở file{' '}
                <code className="font-mono">database/HoaVanAcademy_SQLServer.sql</code>).
              </li>
              <li>
                Nhấn phím <strong>F5 (Execute)</strong> để tự động tạo Database{' '}
                <code className="font-mono">HoaVanAcademyDB</code>, 8 bảng dữ liệu, 2 Stored
                Procedures và dữ liệu mẫu tiếng Trung.
              </li>
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-700" />
              <h2 className="text-base font-semibold text-slate-900">
                Mã Nguồn T-SQL & Kết Nối Visual Studio
              </h2>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setIdeTab('sqlserver')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  ideTab === 'sqlserver'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Script SQL Server (T-SQL)
              </button>
              <button
                type="button"
                onClick={() => setIdeTab('vs2022')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  ideTab === 'vs2022'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Visual Studio 2022 (C# SqlConnection)
              </button>
              <button
                type="button"
                onClick={() => setIdeTab('vscode')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  ideTab === 'vscode'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                VS Code (Node/Vite)
              </button>
            </div>
          </div>

          {ideTab === 'sqlserver' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Nội dung đầy đủ của file{' '}
                  <code className="font-mono font-semibold text-slate-900">
                    /database/HoaVanAcademy_SQLServer.sql
                  </code>
                </span>
                <button
                  type="button"
                  onClick={() => copyText('tab-sql', FULL_SQL_SERVER_SCRIPT)}
                  className="text-red-700 hover:underline font-medium flex items-center gap-1"
                >
                  {copiedId === 'tab-sql' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép T-SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs leading-relaxed overflow-x-auto max-h-[440px]">
                {FULL_SQL_SERVER_SCRIPT}
              </pre>
            </div>
          )}

          {ideTab === 'vs2022' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Cấu hình chuỗi kết nối SQL Server trong <code className="font-mono">appsettings.json</code> và cách gọi Stored Procedure <code className="font-mono">dbo.sp_LogDailyStudySession</code> từ <code className="font-mono">LearningController.cs</code> trong Visual Studio 2022:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs leading-relaxed overflow-x-auto">
                  {aspNetControllerSnippet}
                </pre>
                <button
                  type="button"
                  onClick={() => copyText('vs2022-code', aspNetControllerSnippet)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
                >
                  {copiedId === 'vs2022-code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép C# MVC</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {ideTab === 'vscode' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Để chạy ứng dụng web trong <strong>Visual Studio Code</strong>, mở Terminal (<code className="font-mono">Ctrl + `</code>) và thực thi:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono-tabular text-xs leading-relaxed overflow-x-auto">
                  {vsCodeCommands}
                </pre>
                <button
                  type="button"
                  onClick={() => copyText('vscode-cmd', vsCodeCommands)}
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
                >
                  {copiedId === 'vscode-cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép lệnh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
