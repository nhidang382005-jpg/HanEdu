/* ============================================================================
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

CREATE DATABASE HoaVanAcademyDB
COLLATE Vietnamese_100_CI_AS_SC_UTF8;
GO

USE HoaVanAcademyDB;
GO

/* ============================================================================
 * 1. BẢNG HỌC VIÊN (Students)
 * ============================================================================ */
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

/* ============================================================================
 * 2. BẢNG KHÓA HỌC HÁN NGỮ (Courses)
 * ============================================================================ */
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

/* ============================================================================
 * 3. BẢNG BÀI GIẢNG TRONG KHÓA HỌC (Lessons)
 * ============================================================================ */
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

/* ============================================================================
 * 4. BẢNG TỪ VỰNG HÁN TỰ & CHIẾT TỰ BỘ THỦ (Vocabulary)
 * ============================================================================ */
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

/* ============================================================================
 * 5. BẢNG NGỮ PHÁP TRỌNG ĐIỂM (GrammarPoints)
 * ============================================================================ */
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

/* ============================================================================
 * 6. BẢNG GHI DANH & HOÀN THÀNH BÀI HỌC (Enrollments & LessonCompletions)
 * ============================================================================ */
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

/* ============================================================================
 * 7. BẢNG NGÂN HÀNG CÂU HỎI & KẾT QUẢ THI NĂNG LỰC HSK (Assessments)
 * ============================================================================ */
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

/* ============================================================================
 * 8. BẢNG NHẬT KÝ TIẾN ĐỘ HỌC TẬP HÀNG NGÀY (DailyStudyLogs)
 * ============================================================================ */
CREATE TABLE dbo.DailyStudyLogs (
    LogId INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    StudyDate DATE NOT NULL,
    MinutesStudied INT NOT NULL CHECK (MinutesStudied > 0),
    WordsReviewed INT NOT NULL DEFAULT 0,
    LessonsCompleted INT NOT NULL DEFAULT 0,
    ActivityType NVARCHAR(100) NOT NULL, -- N'Học bài khóa', N'Luyện viết Hán tự', N'Kiểm tra HSK', N'Nghe & Hội thoại'
    StudyNote NVARCHAR(500) NOT NULL,
    GoalMet BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_DailyLogs_Students FOREIGN KEY (StudentId)
        REFERENCES dbo.Students(StudentId) ON DELETE CASCADE
);

CREATE INDEX IX_DailyStudyLogs_StudentDate ON dbo.DailyStudyLogs(StudentId, StudyDate DESC);
GO

/* ============================================================================
 * 9. STORED PROCEDURES (THỦ TỤC LƯU TRỮ CHO CONTROLLER MVC GỌI)
 * ============================================================================ */

-- 9.1. Thủ tục ghi nhận phiên học hàng ngày và tự động kiểm tra định mức mục tiêu
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

    INSERT INTO dbo.DailyStudyLogs (
        StudentId, StudyDate, MinutesStudied, WordsReviewed, LessonsCompleted, ActivityType, StudyNote, GoalMet
    )
    VALUES (
        @StudentId, @StudyDate, @MinutesStudied, @WordsReviewed, @LessonsCompleted, @ActivityType, @StudyNote, @GoalMet
    );

    -- Cập nhật tổng số ngày học tích lũy vào bảng Students
    UPDATE dbo.Students
    SET StreakDays = (
        SELECT COUNT(DISTINCT StudyDate)
        FROM dbo.DailyStudyLogs
        WHERE StudentId = @StudentId
    )
    WHERE StudentId = @StudentId;
END;
GO

-- 9.2. Thủ tục lưu kết quả bài kiểm tra năng lực HSK và đồng bộ sang Nhật ký học tập
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

    -- Tự động ghi nhận phiên học vào DailyStudyLogs
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

    SELECT TOP 1 * FROM dbo.AssessmentSubmissions WHERE StudentId = @StudentId ORDER BY SubmissionId DESC;
END;
GO

/* ============================================================================
 * 10. CHÈN DỮ LIỆU MẪU (SEED DATA CHUẨN HÁN TỰ UNICODE)
 * ============================================================================ */
INSERT INTO dbo.Students (FullName, Email, PasswordHash, TargetHskLevel, DailyGoalMinutes, StreakDays)
VALUES (N'Nguyễn Minh Khôi', 'minhkhoi.hsk@hoavan.edu.vn', 'AQAAAAEAACcQAAAAE...', N'HSK 4 (Trung – Cao cấp)', 30, 7);

INSERT INTO dbo.Courses (CourseId, CourseCode, Title, ChineseSubtitle, LevelCategory, HskBadge, TotalHours, VocabularyCount, InstructorName, Description)
VALUES
('course-hsk12', 'CHN-101', N'Nền Tảng Hán Ngữ & Giao Tiếp Sơ Cấp', N'初阶汉语与日常交际', N'Sơ cấp (HSK 1–2)', N'HSK 1–2', 36, 300, N'ThS. Lâm Nhã Kỳ (ĐH Ngôn ngữ Bắc Kinh)', N'Làm chủ hệ thống ngữ âm Pinyin, quy tắc bút thuận 214 bộ thủ và 300 từ vựng cốt lõi.'),
('course-hsk34', 'CHN-202', N'Ngữ Pháp Trọng Điểm & Đọc Hiểu HSK 3–4', N'中级汉语语法与篇章阅读', N'Trung cấp (HSK 3–4)', N'HSK 3–4', 48, 900, N'TS. Trần Khải Minh (ĐH Phúc Đán Thượng Hải)', N'Chinh phục câu chữ 把 (bǎ), câu bị động chữ 被 (bèi) và bổ ngữ xu hướng phức hợp.'),
('course-business', 'CHN-305', N'Hán Ngữ Thương Mại & Đàm Phán Doanh Nghiệp', N'高级商务汉语与跨文化谈判', N'Cao cấp & Thương mại', N'HSK 5–6 · BCT', 54, 1500, N'PGS. Chu Văn Hạo (Học viện Kinh tế Thượng Hải)', N'Thuật ngữ hợp đồng ngoại thương, thư tín thương mại và đàm phán đối tác Trung Hoa.');

INSERT INTO dbo.Lessons (LessonId, CourseId, LessonOrder, Title, ChineseTitle, PinyinTitle, DurationMinutes, Summary)
VALUES
('les-101-1', 'course-hsk12', 1, N'Chào hỏi & Giới thiệu bản thân', N'你好，认识你很高兴', N'Nǐ hǎo, rènshi nǐ hěn gāoxìng', 25, N'Quy tắc biến điệu thanh 3 trong tiếng Trung và cách hỏi thăm lịch sự.'),
('les-101-2', 'course-hsk12', 2, N'Thời gian, Lịch trình & Mua sắm', N'现在几点？多少钱？', N'Xiànzài jǐ diǎn? Duōshao qián?', 30, N'Cách đọc giờ giấc, ngày tháng năm từ lớn đến nhỏ và mặc cả.'),
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
(1, '2026-09-25', 35, 18, 1, N'Học bài khóa', N'Hoàn thành Bài 1: Biến điệu thanh 3 và câu chữ 是 (shì).', 1),
(1, '2026-09-26', 30, 14, 1, N'Luyện viết Hán tự', N'Tập viết quy tắc bút thuận 8 bộ thủ cơ bản: Nhân, Nữ, Khẩu, Ngôn.', 1),
(1, '2026-09-27', 20, 10, 0, N'Nghe & Hội thoại', N'Luyện nghe hội thoại mua sắm tại hiệu sách Bắc Kinh.', 0),
(1, '2026-09-28', 45, 24, 1, N'Học bài khóa', N'Nắm vững cấu trúc thời gian từ lớn đến nhỏ và cách đọc giờ.', 1),
(1, '2026-09-29', 40, 22, 1, N'Kiểm tra HSK', N'Làm bài kiểm tra năng lực HSK đạt 80/100 điểm (Trình độ HSK 3).', 1),
(1, '2026-09-30', 35, 16, 1, N'Học bài khóa', N'Nghiên cứu chuyên đề câu chữ 把 (bǎ) và bổ ngữ kết quả.', 1),
(1, '2026-10-01', 25, 12, 1, N'Luyện viết Hán tự', N'Ôn tập từ vựng HSK 3: 影响 (Ảnh hưởng), 坚持 (Kiên trì).', 0);
GO

-- Truy vấn kiểm tra kết quả sau khi khởi tạo:
SELECT * FROM dbo.Courses;
SELECT * FROM dbo.Vocabulary;
SELECT * FROM dbo.DailyStudyLogs ORDER BY StudyDate DESC;
GO
