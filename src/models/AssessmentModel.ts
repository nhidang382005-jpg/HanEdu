/**
 * [MVC ARCHITECTURE - MODEL LAYER]
 * File: src/models/AssessmentModel.ts
 * Vai trò: Quản lý ngân hàng đề thi năng lực Hán ngữ (HSK Placement & Competency Test),
 * thuật toán chấm điểm phân loại trình độ và lưu trữ lịch sử bài thi.
 */

export interface AssessmentQuestion {
  id: string;
  section: 'Nghe & Ngữ âm Pinyin' | 'Từ vựng & Hán tự' | 'Cấu trúc Ngữ pháp' | 'Đọc hiểu Ngữ cảnh';
  hskTarget: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4';
  points: number;
  promptHanzi?: string;
  promptPinyin?: string;
  questionText: string;
  audioText?: string; // Chuỗi tiếng Trung phát âm qua Web Speech API
  options: {
    id: string;
    label: string;
    hanzi?: string;
    pinyin?: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface AssessmentSubmissionRecord {
  id: string;
  submittedAt: string;
  testMode: string;
  score: number;
  maxScore: number;
  accuracyPercent: number;
  evaluatedLevel: string;
  timeSpentSeconds: number;
  correctCount: number;
  totalQuestions: number;
}

export const HSK_QUESTION_BANK: AssessmentQuestion[] = [
  {
    id: 'q-1',
    section: 'Nghe & Ngữ âm Pinyin',
    hskTarget: 'HSK 1',
    points: 10,
    promptHanzi: '你好，请问图书馆怎么走？',
    promptPinyin: 'Nǐ hǎo, qǐngwèn túshūguǎn zěnme zǒu?',
    audioText: '你好，请问图书馆怎么走？',
    questionText: 'Nghe phát âm hoặc đọc câu trên và cho biết người nói đang hỏi điều gì?',
    options: [
      { id: 'a', label: 'Hỏi giá sách trong thư viện bao nhiêu tiền' },
      { id: 'b', label: 'Hỏi đường đi đến thư viện như thế nào' },
      { id: 'c', label: 'Hỏi mấy giờ thư viện mở cửa đón sinh viên' },
      { id: 'd', label: 'Hỏi mượn thẻ thư viện của bạn cùng lớp' },
    ],
    correctOptionId: 'b',
    explanation: 'Cấu trúc "请问 + [Địa điểm] + 怎么走？" (Qǐngwèn ... zěnme zǒu?) dùng để hỏi cách đi / đường đi tới một địa điểm. "图书馆" (túshūguǎn) nghĩa là thư viện.',
  },
  {
    id: 'q-2',
    section: 'Từ vựng & Hán tự',
    hskTarget: 'HSK 1',
    points: 10,
    promptHanzi: '我喜欢喝中国___。',
    promptPinyin: 'Wǒ xǐhuan hē Zhōngguó ___.',
    questionText: 'Chọn chữ Hán có bộ Thảo đầu (艹) phù hợp nhất để điền vào chỗ trống ("Tôi thích uống trà Trung Quốc"):',
    options: [
      { id: 'a', label: '茶 (chá - Trà)', hanzi: '茶' },
      { id: 'b', label: '饭 (fàn - Cơm)', hanzi: '饭' },
      { id: 'c', label: '书 (shū - Sách)', hanzi: '书' },
      { id: 'd', label: '车 (chē - Xe)', hanzi: '车' },
    ],
    correctOptionId: 'a',
    explanation: '"茶" (chá - âm Hán Việt: Trà) gồm bộ Thảo đầu (艹) phía trên, bộ Nhân (人) ở giữa và bộ Mộc (木) phía dưới, đi với động từ "喝" (hē - uống).',
  },
  {
    id: 'q-3',
    section: 'Cấu trúc Ngữ pháp',
    hskTarget: 'HSK 2',
    points: 15,
    promptHanzi: '妹妹比我___两岁，但是她比我高。',
    promptPinyin: 'Mèimei bǐ wǒ ___ liǎng suì, dànshì tā bǐ wǒ gāo.',
    questionText: 'Chọn tính từ đúng trong câu so sánh hơn với giới từ "比" (bǐ):',
    options: [
      { id: 'a', label: '很更小 (hěn gèng xiǎo)' },
      { id: 'b', label: '小 (xiǎo)' },
      { id: 'c', label: '非常小 (fēicháng xiǎo)' },
      { id: 'd', label: '最下 (zuì xià)' },
    ],
    correctOptionId: 'b',
    explanation: 'Trong câu so sánh chữ "比" (A 比 B + Tính từ + Số lượng bổ ngữ), tuyệt đối KHÔNG dùng các phó từ chỉ mức độ như 很 (hěn), 非常 (fēicháng) đứng trước tính từ. Do đó chỉ dùng "小" (xiǎo).',
  },
  {
    id: 'q-4',
    section: 'Từ vựng & Hán tự',
    hskTarget: 'HSK 2',
    points: 15,
    promptHanzi: '因为今天下大雨，___我们决定留在家里学习。',
    promptPinyin: 'Yīnwèi jīntiān xià dàyǔ, ___ wǒmen juédìng liú zài jiālǐ xuéxí.',
    questionText: 'Chọn liên từ phù hợp để hoàn thành cặp cấu trúc Nhân – Quả:',
    options: [
      { id: 'a', label: '虽然 (suīrán - Mặc dù)' },
      { id: 'b', label: '所以 (suǒyǐ - Cho nên)' },
      { id: 'c', label: '不但 (búdàn - Không những)' },
      { id: 'd', label: '或者 (huòzhě - Hoặc là)' },
    ],
    correctOptionId: 'b',
    explanation: 'Cặp liên từ chỉ nguyên nhân - kết quả kinh điển trong tiếng Trung là "因为...，所以..." (Yīnwèi..., suǒyǐ... - Bởi vì..., cho nên...).',
  },
  {
    id: 'q-5',
    section: 'Cấu trúc Ngữ pháp',
    hskTarget: 'HSK 3',
    points: 15,
    promptHanzi: '出门以前，请___房间的灯和空调关掉。',
    promptPinyin: 'Chūmén yǐqián, qǐng ___ fángjiān de dēng hé kōngtiáo guāndiào.',
    audioText: '出门以前，请把房间的灯和空调关掉。',
    questionText: 'Chọn giới từ phù hợp để tạo câu xử lý tác động lên tân ngữ xác định ("đèn và điều hòa"):',
    options: [
      { id: 'a', label: '被 (bèi)' },
      { id: 'b', label: '把 (bǎ)' },
      { id: 'c', label: '对 (duì)' },
      { id: 'd', label: '向 (xiàng)' },
    ],
    correctOptionId: 'b',
    explanation: 'Câu chữ "把" (Chủ ngữ + 把 + Tân ngữ + Động từ + Bổ ngữ kết quả "掉") nhấn mạnh việc xử lý, làm thay đổi trạng thái của sự vật ("tắt đèn và điều hòa đi").',
  },
  {
    id: 'q-6',
    section: 'Đọc hiểu Ngữ cảnh',
    hskTarget: 'HSK 3',
    points: 15,
    promptHanzi: '“学习外语不能着急，只有每天坚持练习听和说，才能慢慢提高水平。”',
    promptPinyin: '“Xuéxí wàiyǔ bù néng zháojí, zhǐyǒu měitiān jiānchí liànxí tīng hé shuō, cái néng mànmàn tígāo shuǐpíng.”',
    questionText: 'Theo đoạn văn trên, điều kiện cần thiết để nâng cao trình độ ngoại ngữ là gì?',
    options: [
      { id: 'a', label: 'Học thật nhanh trong thời gian ngắn nhất có thể' },
      { id: 'b', label: 'Chỉ cần đọc sách ngữ pháp mà không cần luyện nói' },
      { id: 'c', label: 'Kiên trì luyện nghe và nói mỗi ngày một cách bền bỉ' },
      { id: 'd', label: 'Chỉ học khi sắp có kỳ thi năng lực ngoại ngữ' },
    ],
    correctOptionId: 'c',
    explanation: 'Cấu trúc "只有...，才..." (Zhǐyǒu..., cái... - Chỉ có..., thì mới...) nhấn mạnh điều kiện duy nhất: "每天坚持练习听和说" (kiên trì luyện nghe và nói mỗi ngày).',
  },
  {
    id: 'q-7',
    section: 'Từ vựng & Hán tự',
    hskTarget: 'HSK 4',
    points: 20,
    promptHanzi: '不管遇到多大的困难，我们都不应该轻易___自己的理想。',
    promptPinyin: 'Bùguǎn yùdào duō dà de kùnnan, wǒmen dōu bù yīnggāi qīngyì ___ zìjǐ de lǐxiǎng.',
    audioText: '不管遇到多大的困难，我们都不应该轻易放弃自己的理想。',
    questionText: 'Chọn động từ HSK 4 phù hợp nhất về ngữ nghĩa ("Cho dù gặp khó khăn lớn đến đâu, chúng ta cũng không nên dễ dàng ___ lý tưởng của mình"):',
    options: [
      { id: 'a', label: '放弃 (fàngqì - Từ bỏ)' },
      { id: 'b', label: '原谅 (yuánliàng - Tha thứ)' },
      { id: 'c', label: '怀疑 (huáiyí - Nghi ngờ)' },
      { id: 'd', label: '羡慕 (xiànmù - Ngưỡng mộ)' },
    ],
    correctOptionId: 'a',
    explanation: '"放弃" (fàngqì - Phóng khí: từ bỏ, bỏ cuộc) thường kết hợp với "理想" (lý tưởng), "机会" (cơ hội), "目标" (mục tiêu).',
  },
];

const STORAGE_KEY_ASSESSMENTS = 'hoavan_mvc_assessments_v1';

export class AssessmentModel {
  public getQuestions(filterLevel: 'all' | 'beginner' | 'intermediate'): AssessmentQuestion[] {
    if (filterLevel === 'beginner') {
      return HSK_QUESTION_BANK.filter((q) => q.hskTarget === 'HSK 1' || q.hskTarget === 'HSK 2');
    }
    if (filterLevel === 'intermediate') {
      return HSK_QUESTION_BANK.filter((q) => q.hskTarget === 'HSK 3' || q.hskTarget === 'HSK 4');
    }
    return HSK_QUESTION_BANK;
  }

  public evaluateSubmission(
    questions: AssessmentQuestion[],
    selectedAnswers: Record<string, string>,
    timeSpentSeconds: number,
    testModeLabel: string
  ): AssessmentSubmissionRecord {
    let score = 0;
    let maxScore = 0;
    let correctCount = 0;

    for (const q of questions) {
      maxScore += q.points;
      if (selectedAnswers[q.id] === q.correctOptionId) {
        score += q.points;
        correctCount += 1;
      }
    }

    const accuracyPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

    let evaluatedLevel = 'HSK 1 (Nhập môn)';
    if (accuracyPercent >= 85) {
      evaluatedLevel = 'HSK 4 (Trung – Cao cấp)';
    } else if (accuracyPercent >= 65) {
      evaluatedLevel = 'HSK 3 (Trung cấp)';
    } else if (accuracyPercent >= 45) {
      evaluatedLevel = 'HSK 2 (Sơ – Trung cấp)';
    }

    const record: AssessmentSubmissionRecord = {
      id: `test-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
      testMode: testModeLabel,
      score,
      maxScore,
      accuracyPercent,
      evaluatedLevel,
      timeSpentSeconds,
      correctCount,
      totalQuestions: questions.length,
    };

    this.saveRecord(record);
    return record;
  }

  public getHistory(): AssessmentSubmissionRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      if (!raw) {
        const seed: AssessmentSubmissionRecord[] = [
          {
            id: 'test-seed-1',
            submittedAt: '2026-09-25',
            testMode: 'Đánh giá đầu vào tổng hợp',
            score: 60,
            maxScore: 100,
            accuracyPercent: 60,
            evaluatedLevel: 'HSK 2 (Sơ – Trung cấp)',
            timeSpentSeconds: 215,
            correctCount: 4,
            totalQuestions: 7,
          },
          {
            id: 'test-seed-2',
            submittedAt: '2026-09-29',
            testMode: 'Đánh giá đầu vào tổng hợp',
            score: 80,
            maxScore: 100,
            accuracyPercent: 80,
            evaluatedLevel: 'HSK 3 (Trung cấp)',
            timeSpentSeconds: 184,
            correctCount: 6,
            totalQuestions: 7,
          },
        ];
        localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(seed));
        return seed;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private saveRecord(record: AssessmentSubmissionRecord): void {
    const current = this.getHistory();
    const updated = [record, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
  }
}
