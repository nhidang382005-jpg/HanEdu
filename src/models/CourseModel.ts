/**
 * [MVC ARCHITECTURE - MODEL LAYER]
 * File: src/models/CourseModel.ts
 * Vai trò: Quản lý cấu trúc dữ liệu Khóa học (Courses), Bài học (Lessons),
 * Từ vựng Hán tự (Vocabulary), Ngữ pháp (Grammar) và Hội thoại (Dialogues).
 */

import heroAcademyImg from '../assets/images/hero_chinese_academy_1790923416031.jpg';
import courseHsk1Img from '../assets/images/course_hsk1_beginner_1790923429512.jpg';
import courseHsk3Img from '../assets/images/course_hsk3_intermediate_1790923451095.jpg';
import courseBusinessImg from '../assets/images/course_business_mandarin_1790923464718.jpg';

export interface VocabularyItem {
  id: string;
  hanzi: string;
  pinyin: string;
  toneNumber: string;
  sinoVietnamese: string; // Âm Hán Việt
  meaning: string;
  radical: string; // Bộ thủ
  strokeCount: number;
  strokeOrderBreakdown: string[]; // Các nét cơ bản theo thứ tự
  exampleHanzi: string;
  examplePinyin: string;
  exampleMeaning: string;
  hskLevel: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'Thương mại';
}

export interface GrammarPoint {
  id: string;
  title: string;
  structure: string;
  explanation: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleMeaning: string;
}

export interface DialogueLine {
  speaker: string;
  role: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  chineseTitle: string;
  pinyinTitle: string;
  durationMinutes: number;
  summary: string;
  vocabulary: VocabularyItem[];
  grammarPoints: GrammarPoint[];
  dialogue: DialogueLine[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  chineseSubtitle: string;
  level: 'Sơ cấp (HSK 1–2)' | 'Trung cấp (HSK 3–4)' | 'Cao cấp & Thương mại';
  hskBadge: string;
  totalHours: number;
  vocabularyCount: number;
  instructor: string;
  description: string;
  imageUrl: string;
  lessons: Lesson[];
}

export const HERO_IMAGE_URL = heroAcademyImg;

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-hsk12',
    code: 'CHN-101',
    title: 'Nền Tảng Hán Ngữ & Giao Tiếp Sơ Cấp',
    chineseSubtitle: '初阶汉语与日常交际',
    level: 'Sơ cấp (HSK 1–2)',
    hskBadge: 'HSK 1–2',
    totalHours: 36,
    vocabularyCount: 300,
    instructor: 'ThS. Lâm Nhã Kỳ (ĐH Ngôn ngữ Bắc Kinh)',
    description:
      'Làm chủ hệ thống ngữ âm Pinyin, quy tắc bút thuận 214 bộ thủ và 300 từ vựng cốt lõi phục vụ giao tiếp đời sống hàng ngày.',
    imageUrl: courseHsk1Img,
    lessons: [
      {
        id: 'les-101-1',
        courseId: 'course-hsk12',
        order: 1,
        title: 'Chào hỏi & Giới thiệu bản thân',
        chineseTitle: '你好，认识你很高兴',
        pinyinTitle: 'Nǐ hǎo, rènshi nǐ hěn gāoxìng',
        durationMinutes: 25,
        summary: 'Quy tắc biến điệu thanh 3 trong tiếng Trung, cách hỏi thăm sức khỏe, tên tuổi và quốc tịch lịch sự.',
        vocabulary: [
          {
            id: 'voc-1',
            hanzi: '你好',
            pinyin: 'nǐ hǎo',
            toneNumber: 'Thanh 3 + Thanh 3 (biến điệu thành 2 + 3)',
            sinoVietnamese: 'NHĨ HẢO',
            meaning: 'Xin chào',
            radical: '亻(Nhân đứng) & 女 (Nữ)',
            strokeCount: 13,
            strokeOrderBreakdown: ['丿 Phiệt', '丨 Sổ', '乚 Móc', '丶 Chấm', '女 Bộ Nữ', '子 Bộ Tử'],
            exampleHanzi: '老师您好，请问您贵姓？',
            examplePinyin: 'Lǎoshī nín hǎo, qǐngwèn nín guìxìng?',
            exampleMeaning: 'Em chào thầy/cô ạ, xin hỏi quý danh của thầy/cô là gì?',
            hskLevel: 'HSK 1',
          },
          {
            id: 'voc-2',
            hanzi: '认识',
            pinyin: 'rènshi',
            toneNumber: 'Thanh 4 + Thanh nhẹ',
            sinoVietnamese: 'NHẬN THỨC',
            meaning: 'Quen biết, làm quen',
            radical: '讠(Ngôn)',
            strokeCount: 11,
            strokeOrderBreakdown: ['丶 Chấm', '𠃍 Ngang gập móc', '丿 Phiệt', '㇏ Mác', '口 Bộ Khẩu', '八 Bộ Bát'],
            exampleHanzi: '认识你我也很高兴。',
            examplePinyin: 'Rènshi nǐ wǒ yě hěn gāoxìng.',
            exampleMeaning: 'Quen biết bạn tôi cũng rất vui.',
            hskLevel: 'HSK 1',
          },
          {
            id: 'voc-3',
            hanzi: '学习',
            pinyin: 'xuéxí',
            toneNumber: 'Thanh 2 + Thanh 2',
            sinoVietnamese: 'HỌC TẬP',
            meaning: 'Học, học tập',
            radical: '子 (Tử) & 羽 (Vũ)',
            strokeCount: 11,
            strokeOrderBreakdown: ['丶 Chấm', '丶 Chấm', '丿 Phiệt', '冖 Mịch', '子 Tử', '𠃌 Ngang gập móc', '丶 Chấm'],
            exampleHanzi: '我每天都努力学习汉语。',
            examplePinyin: 'Wǒ měitiān dōu nǔlì xuéxí Hànyǔ.',
            exampleMeaning: 'Mỗi ngày tôi đều nỗ lực học tiếng Hán.',
            hskLevel: 'HSK 1',
          },
          {
            id: 'voc-4',
            hanzi: '朋友',
            pinyin: 'péngyou',
            toneNumber: 'Thanh 2 + Thanh nhẹ',
            sinoVietnamese: 'BẰNG HỮU',
            meaning: 'Bạn bè, người bạn',
            radical: '月 (Nguyệt) & 又 (Hựu)',
            strokeCount: 12,
            strokeOrderBreakdown: ['丿 Phiệt', '𠃌 Ngang gập móc', '一 Ngang', '一 Ngang', '一 Ngang', '丿 Phiệt', '又 Hựu'],
            exampleHanzi: '他是我的中国好朋友。',
            examplePinyin: 'Tā shì wǒ de Zhōngguó hǎo péngyou.',
            exampleMeaning: 'Anh ấy là người bạn tốt Trung Quốc của tôi.',
            hskLevel: 'HSK 1',
          },
        ],
        grammarPoints: [
          {
            id: 'gram-1',
            title: 'Câu chữ "是" (shì) biểu thị sự đồng nhất',
            structure: 'Chủ ngữ + 是 (shì) + Tân ngữ (Danh từ)',
            explanation: 'Dùng để giới thiệu tên tuổi, nghề nghiệp, quốc tịch. Phủ định dùng "不是" (bú shì) đứng trước động từ.',
            exampleHanzi: '我是越南留学生，不是老师。',
            examplePinyin: 'Wǒ shì Yuènán liúxuéshēng, bú shì lǎoshī.',
            exampleMeaning: 'Tôi là du học sinh Việt Nam, không phải là giáo viên.',
          },
          {
            id: 'gram-2',
            title: 'Phó từ chỉ mức độ "很" (hěn) trong câu vị ngữ tính từ',
            structure: 'Chủ ngữ + 很 (hěn) + Tính từ',
            explanation: 'Trong tiếng Trung, tính từ làm vị ngữ thường đi kèm phó từ "很" (rất) để câu cân đối về mặt ngữ âm mà không cần dùng động từ "是".',
            exampleHanzi: '今天天气很好，工作不忙。',
            examplePinyin: 'Jīntiān tiānqì hěn hǎo, gōngzuò bù máng.',
            exampleMeaning: 'Hôm nay thời tiết rất đẹp, công việc không bận.',
          },
        ],
        dialogue: [
          {
            speaker: 'Minh Khôi (明魁)',
            role: 'Học viên',
            hanzi: '你好！请问你是林老师吗？',
            pinyin: 'Nǐ hǎo! Qǐngwèn nǐ shì Lín lǎoshī ma?',
            meaning: 'Xin chào! Xin hỏi cô có phải là cô Lâm không ạ?',
          },
          {
            speaker: 'Lâm Nhã Kỳ (林雅琪)',
            role: 'Giảng viên',
            hanzi: '是的，我是林雅琪。你叫什么名字？',
            pinyin: 'Shì de, wǒ shì Lín Yǎqí. Nǐ jiào shénme míngzi?',
            meaning: 'Đúng vậy, cô là Lâm Nhã Kỳ. Em tên là gì?',
          },
          {
            speaker: 'Minh Khôi (明魁)',
            role: 'Học viên',
            hanzi: '我叫明魁，是河内大学的学生。认识您很高兴！',
            pinyin: 'Wǒ jiào Míng Kuí, shì Hénèi Dàxué de xuésheng. Rènshi nín hěn gāoxìng!',
            meaning: 'Em tên là Minh Khôi, là sinh viên Đại học Hà Nội. Rất vui được biết cô ạ!',
          },
        ],
      },
      {
        id: 'les-101-2',
        courseId: 'course-hsk12',
        order: 2,
        title: 'Thời gian, Lịch trình & Mua sắm',
        chineseTitle: '现在几点？多少钱？',
        pinyinTitle: 'Xiànzài jǐ diǎn? Duōshao qián?',
        durationMinutes: 30,
        summary: 'Cách đọc giờ giấc, ngày tháng năm theo thứ tự từ lớn đến nhỏ trong tiếng Trung và cách hỏi giá, mặc cả.',
        vocabulary: [
          {
            id: 'voc-5',
            hanzi: '时间',
            pinyin: 'shíjiān',
            toneNumber: 'Thanh 2 + Thanh 1',
            sinoVietnamese: 'THỜI GIAN',
            meaning: 'Thời gian, thì giờ',
            radical: '日 (Nhật) & 门 (Môn)',
            strokeCount: 14,
            strokeOrderBreakdown: ['日 Bộ Nhật', '寸 Bộ Thốn', '门 Bộ Môn', '日 Bộ Nhật trong'],
            exampleHanzi: '周末你有时间去喝茶吗？',
            examplePinyin: 'Zhōumò nǐ yǒu shíjiān qù hē chá ma?',
            exampleMeaning: 'Cuối tuần bạn có thời gian đi uống trà không?',
            hskLevel: 'HSK 2',
          },
          {
            id: 'voc-6',
            hanzi: '准备',
            pinyin: 'zhǔnbèi',
            toneNumber: 'Thanh 3 + Thanh 4',
            sinoVietnamese: 'CHUẨN BỊ',
            meaning: 'Chuẩn bị, dự định',
            radical: '冫(Băng) & 夂 (Trĩ)',
            strokeCount: 18,
            strokeOrderBreakdown: ['冫 Hai chấm băng', '隹 Bộ Chuy', '夂 Bộ Trĩ', '田 Bộ Điền'],
            exampleHanzi: '我已经准备好参加汉语考试了。',
            examplePinyin: 'Wǒ yǐjīng zhǔnbèi hǎo cānjiā Hànyǔ kǎoshì le.',
            exampleMeaning: 'Tôi đã chuẩn bị xong xuôi để tham gia kỳ thi tiếng Trung rồi.',
            hskLevel: 'HSK 2',
          },
        ],
        grammarPoints: [
          {
            id: 'gram-3',
            title: 'Nguyên tắc biểu đạt thời gian và không gian từ Lớn đến Nhỏ',
            structure: 'Năm + Tháng + Ngày + Buổi + Giờ + Phút + Chủ ngữ + Động từ',
            explanation: 'Trong tiếng Trung, trạng ngữ chỉ thời gian luôn sắp xếp từ đơn vị lớn nhất đến đơn vị nhỏ nhất và đứng trước động từ chính.',
            exampleHanzi: '我们明天上午八点半在图书馆见面。',
            examplePinyin: 'Wǒmen míngtiān shàngwǔ bā diǎn bàn zài túshūguǎn jiànmiàn.',
            exampleMeaning: 'Chúng ta 8 giờ rưỡi sáng mai gặp nhau tại thư viện.',
          },
        ],
        dialogue: [
          {
            speaker: 'Lan Anh (兰英)',
            role: 'Khách hàng',
            hanzi: '老板，请问这本汉语词典多少钱？',
            pinyin: 'Lǎobǎn, qǐngwèn zhè běn Hànyǔ cídiǎn duōshao qián?',
            meaning: 'Ông chủ ơi, xin hỏi cuốn từ điển tiếng Trung này bao nhiêu tiền?',
          },
          {
            speaker: 'Ông chủ (书店老板)',
            role: 'Chủ hiệu sách',
            hanzi: '这本词典原价八十块，今天打八折，六十四块钱。',
            pinyin: 'Zhè běn cídiǎn yuánjià bāshí kuài, jīntiān dǎ bā zhé, liùshísì kuài qián.',
            meaning: 'Cuốn từ điển này giá gốc 80 tệ, hôm nay giảm 20% (còn 8 phần), là 64 tệ.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-hsk34',
    code: 'CHN-202',
    title: 'Ngữ Pháp Trọng Điểm & Đọc Hiểu HSK 3–4',
    chineseSubtitle: '中级汉语语法与篇章阅读',
    level: 'Trung cấp (HSK 3–4)',
    hskBadge: 'HSK 3–4',
    totalHours: 48,
    vocabularyCount: 900,
    instructor: 'TS. Trần Khải Minh (ĐH Phúc Đán Thượng Hải)',
    description:
      'Chinh phục câu chữ 把 (bǎ), câu bị động chữ 被 (bèi), bổ ngữ xu hướng phức hợp và kỹ năng lập luận đoạn văn chuẩn HSK 4.',
    imageUrl: courseHsk3Img,
    lessons: [
      {
        id: 'les-202-1',
        courseId: 'course-hsk34',
        order: 1,
        title: 'Cấu trúc câu chữ 把 (Bǎ) & Bổ ngữ kết quả',
        chineseTitle: '请把这份报告放在桌子上',
        pinyinTitle: 'Qǐng bǎ zhè fèn bàogào fàng zài zhuōzi shàng',
        durationMinutes: 35,
        summary: 'Nắm vững cách tác động làm thay đổi vị trí hoặc trạng thái của sự vật bằng giới từ 把 kết hợp bổ ngữ kết quả.',
        vocabulary: [
          {
            id: 'voc-7',
            hanzi: '影响',
            pinyin: 'yǐngxiǎng',
            toneNumber: 'Thanh 3 + Thanh 3',
            sinoVietnamese: 'ẢNH HƯỞNG',
            meaning: 'Ảnh hưởng, tác động',
            radical: '彡 (Sam) & 口 (Khẩu)',
            strokeCount: 24,
            strokeOrderBreakdown: ['日 Nhật', '京 Kinh', '彡 Ba nét phiệt', '口 Khẩu', '向 Hướng'],
            exampleHanzi: '环境对一个人的习惯有很大的影响。',
            examplePinyin: 'Huánjìng duì yí gè rén de xíguàn yǒu hěn dà de yǐngxiǎng.',
            exampleMeaning: 'Môi trường có ảnh hưởng rất lớn đối với thói quen của một người.',
            hskLevel: 'HSK 3',
          },
          {
            id: 'voc-8',
            hanzi: '坚持',
            pinyin: 'jiānchí',
            toneNumber: 'Thanh 1 + Thanh 2',
            sinoVietnamese: 'KIÊN TRÌ',
            meaning: 'Kiên trì, bền bỉ duy trì',
            radical: '土 (Thổ) & 扌(Tài gảy)',
            strokeCount: 16,
            strokeOrderBreakdown: ['竖 Sổ', '又 Hựu', '土 Thổ', '扌Tay gảy', '寺 Tự'],
            exampleHanzi: '只要每天坚持复习，你的汉语水平一定会提高。',
            examplePinyin: 'Zhǐyào měitiān jiānchí fùxí, nǐ de Hànyǔ shuǐpíng yídìng huì tígāo.',
            exampleMeaning: 'Chỉ cần mỗi ngày kiên trì ôn tập, trình độ tiếng Trung của bạn nhất định sẽ nâng cao.',
            hskLevel: 'HSK 4',
          },
          {
            id: 'voc-9',
            hanzi: '经验',
            pinyin: 'jīngyàn',
            toneNumber: 'Thanh 1 + Thanh 4',
            sinoVietnamese: 'KINH NGHIỆM',
            meaning: 'Kinh nghiệm, trải nghiệm thực tế',
            radical: '纟(Mịch) & 马 (Mã)',
            strokeCount: 18,
            strokeOrderBreakdown: ['纟 Bộ Mịch', '𢀖 Kinh', '马 Bộ Mã', '佥 Thiêm'],
            exampleHanzi: '她在国际贸易方面积累了丰富的经验。',
            examplePinyin: 'Tā zài guójì màoyì fāngmiàn jīlěi le fēngfù de jīngyàn.',
            exampleMeaning: 'Cô ấy đã tích lũy được kinh nghiệm phong phú trong lĩnh vực thương mại quốc tế.',
            hskLevel: 'HSK 4',
          },
        ],
        grammarPoints: [
          {
            id: 'gram-4',
            title: 'Câu chữ 把 (bǎ) biểu thị sự xử lý, sắp đặt',
            structure: 'Chủ ngữ + 把 + Tân ngữ xác định + Động từ + Thành phần khác (在/到/给/เล/Bổ ngữ)',
            explanation: 'Tân ngữ sau 把 phải là sự vật đã xác định. Động từ chính không được đứng trơ trọi mà bắt buộc phải có thành phần bổ sung phía sau thể hiện kết quả của hành động.',
            exampleHanzi: '我已经把今天的生词全部记住了。',
            examplePinyin: 'Wǒ yǐjīng bǎ jīntiān de shēngcí quánbù jìzhù le.',
            exampleMeaning: 'Tôi đã ghi nhớ toàn bộ từ mới của ngày hôm nay rồi.',
          },
        ],
        dialogue: [
          {
            speaker: 'Trưởng phòng (王经理)',
            role: 'Quản lý',
            hanzi: '小陈，你把那份市场调查报告翻译成中文了吗？',
            pinyin: 'Xiǎo Chén, nǐ bǎ nà fèn shìchǎng diàochá bàogào fānyì chéng Zhōngwén le ma?',
            meaning: 'Tiểu Trần, cậu đã dịch bản báo cáo khảo sát thị trường đó sang tiếng Trung chưa?',
          },
          {
            speaker: 'Tiểu Trần (小陈)',
            role: 'Chuyên viên',
            hanzi: '我已经翻译好了，而且把重要的数字都发到您的邮箱里了。',
            pinyin: 'Wǒ yǐjīng fānyì hǎo le, érqiě bǎ zhòngyào de shùzì dōu fā dào nín de yóuxiāng lǐ le.',
            meaning: 'Tôi đã dịch xong rồi ạ, hơn nữa còn gửi các số liệu quan trọng vào hộp thư của ngài rồi.',
          },
        ],
      },
    ],
  },
  {
    id: 'course-business',
    code: 'CHN-305',
    title: 'Hán Ngữ Thương Mại & Đàm Phán Doanh Nghiệp',
    chineseSubtitle: '高级商务汉语与跨文化谈判',
    level: 'Cao cấp & Thương mại',
    hskBadge: 'HSK 5–6 · BCT',
    totalHours: 54,
    vocabularyCount: 1500,
    instructor: 'PGS. Chu Văn Hạo (Học viện Kinh tế Thượng Hải)',
    description:
      'Thuật ngữ hợp đồng ngoại thương, thư tín thương mại chuẩn mực (商务信函) và nghệ thuật đàm phán đối tác Trung Hoa.',
    imageUrl: courseBusinessImg,
    lessons: [
      {
        id: 'les-305-1',
        courseId: 'course-business',
        order: 1,
        title: 'Đàm phán Hợp đồng & Chuỗi cung ứng',
        chineseTitle: '战略合作与供应链协议',
        pinyinTitle: 'Zhànlüè hézuò yǔ gōngyìngliàn xiéyì',
        durationMinutes: 45,
        summary: 'Các cấu trúc văn viết trang trọng (书面语) trong ký kết biên bản ghi nhớ (MOU), điều khoản thanh toán và giao nhận.',
        vocabulary: [
          {
            id: 'voc-10',
            hanzi: '合作',
            pinyin: 'hézuò',
            toneNumber: 'Thanh 2 + Thanh 4',
            sinoVietnamese: 'HỢP TÁC',
            meaning: 'Hợp tác, cộng tác kinh doanh',
            radical: '人 (Nhân) & 亻(Nhân đứng)',
            strokeCount: 13,
            strokeOrderBreakdown: ['人 Nhân', '一 Ngang', '口 Khẩu', '亻Nhân đứng', '乍 Sạ'],
            exampleHanzi: '希望我们双方能够建立长期稳定的合作关系。',
            examplePinyin: 'Xīwàng wǒmen shuāngfāng nénggòu jiànlì chángqī wěndìng de hézuò guānxi.',
            exampleMeaning: 'Hy vọng hai bên chúng ta có thể thiết lập mối quan hệ hợp tác ổn định lâu dài.',
            hskLevel: 'Thương mại',
          },
          {
            id: 'voc-11',
            hanzi: '效率',
            pinyin: 'xiàolǜ',
            toneNumber: 'Thanh 4 + Thanh 4',
            sinoVietnamese: 'HIỆU SUẤT',
            meaning: 'Hiệu suất, năng suất làm việc',
            radical: '攵 (Phộc) & 玄 (Huyền)',
            strokeCount: 21,
            strokeOrderBreakdown: ['交 Giao', '攵 Phộc', '玄 Huyền', '十 Thập'],
            exampleHanzi: '采用数字化管理系统显著提高了生产效率。',
            examplePinyin: 'Cǎiyòng shùzìhuà guǎnlǐ xìtǒng xiǎnzhù tígāo le shēngchǎn xiàolǜ.',
            exampleMeaning: 'Việc áp dụng hệ thống quản lý số hóa đã nâng cao rõ rệt hiệu suất sản xuất.',
            hskLevel: 'Thương mại',
          },
        ],
        grammarPoints: [
          {
            id: 'gram-5',
            title: 'Cấu trúc văn viết trang trọng "鉴于...，特此..." (Xét thấy..., nay đặc biệt...)',
            structure: '鉴于 + [Lý do/Bối cảnh thực tế]，双方同意 / 特此...',
            explanation: 'Thường dùng ở phần mở đầu hợp đồng hoặc thông báo thương mại chính thức để nêu căn cứ pháp lý hoặc bối cảnh hợp tác.',
            exampleHanzi: '鉴于双方在东南亚市场的共同利益，特签署本合作备忘录。',
            examplePinyin: 'Jiànyú shuāngfāng zài Dōngnányà shìchǎng de gòngtóng lìyì, tè qiānshǔ běn hézuò bèiwànglù.',
            exampleMeaning: 'Xét thấy lợi ích chung của hai bên tại thị trường Đông Nam Á, nay ký kết biên bản ghi nhớ hợp tác này.',
          },
        ],
        dialogue: [
          {
            speaker: 'Giám đốc Trương (张总监)',
            role: 'Đối tác Thượng Hải',
            hanzi: '关于第三季度的交货期限，贵公司能否提前两周完成？',
            pinyin: 'Guānyú dì-sān jìdù de jiāohuò qīxiàn, guì gōngsī néngfǒu tíqián liǎng zhōu wánchéng?',
            meaning: 'Về thời hạn giao hàng quý 3, quý công ty có thể hoàn thành sớm hơn 2 tuần được không?',
          },
          {
            speaker: 'Bà Hoàng (黄代表)',
            role: 'Đại diện Việt Nam',
            hanzi: '只要原材料按时到位，我们完全可以保证按期交付。',
            pinyin: 'Zhǐyào yuáncáiliào ànshí dàowèi, wǒmen wánquán kěyǐ bǎozhèng ànqī jiāofù.',
            meaning: 'Chỉ cần nguyên vật liệu về đúng hạn, chúng tôi hoàn toàn có thể đảm bảo bàn giao đúng kỳ hạn.',
          },
        ],
      },
    ],
  },
];

export class CourseModel {
  private courses: Course[] = INITIAL_COURSES;

  public getAllCourses(): Course[] {
    return this.courses;
  }

  public getCourseById(courseId: string): Course | undefined {
    return this.courses.find((c) => c.id === courseId);
  }

  public getAllVocabulary(): VocabularyItem[] {
    const list: VocabularyItem[] = [];
    for (const course of this.courses) {
      for (const lesson of course.lessons) {
        list.push(...lesson.vocabulary);
      }
    }
    return list;
  }
}
