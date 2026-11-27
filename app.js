const drills = [
  {
    category: "Intake & quoting",
    source: "The client must approve the quote before translation starts.",
    context: "A clear boundary for starting a new job.",
    reference: "Khách hàng phải duyệt báo giá trước khi bắt đầu dịch.",
    tip: "“Duyệt báo giá” is a natural way to express approving a quote."
  },
  {
    category: "Intake & quoting",
    source: "Rush jobs with a deadline under 24 hours must be confirmed in writing.",
    context: "A rule for urgent requests.",
    reference: "Các công việc gấp có thời hạn dưới 24 giờ phải được xác nhận bằng văn bản.",
    tip: "“Bằng văn bản” keeps the written-confirmation requirement explicit."
  },
  {
    category: "Files & confidentiality",
    source: "Client files are stored only in the approved project folder.",
    context: "Explaining where a client's files may be kept.",
    reference: "Chỉ lưu trữ tệp của khách hàng trong thư mục dự án đã được phê duyệt.",
    tip: "“Chỉ ... trong” emphasizes that the approved project folder is the only allowed location."
  },
  {
    category: "Files & confidentiality",
    source: "Working copies are kept for 90 days after a job is complete.",
    context: "A retention rule for completed jobs.",
    reference: "Các bản sao làm việc được lưu giữ trong 90 ngày sau khi hoàn thành công việc.",
    tip: "“Bản sao làm việc” distinguishes working copies from the final files."
  },
  {
    category: "Quality & delivery",
    source: "If a source sentence is unclear, add a short translator note instead of guessing.",
    context: "A practical quality guideline.",
    reference: "Nếu câu gốc chưa rõ, hãy thêm ghi chú ngắn của người dịch thay vì đoán.",
    tip: "“Câu gốc” means the source sentence; “thay vì đoán” preserves the instruction not to guess."
  },
  {
    category: "Quality & delivery",
    source: "Late delivery must be flagged as soon as the delay is known.",
    context: "When to tell a client about a delay.",
    reference: "Phải báo ngay khi biết sẽ giao hàng trễ.",
    tip: "“Báo ngay khi biết” captures the urgency of flagging a delay as soon as it is known."
  },
  {
    category: "Billing & revisions",
    source: "One round of small revisions is included if the request arrives within 10 days.",
    context: "Describing what is included after delivery.",
    reference: "Được bao gồm một lượt chỉnh sửa nhỏ nếu yêu cầu được gửi trong vòng 10 ngày.",
    tip: "“Trong vòng 10 ngày” makes the time limit clear."
  },
  {
    category: "Client communication",
    source: "If a client asks for a service this practice does not offer, explain that it is unavailable.",
    context: "A courteous response to a request outside the service offering.",
    reference: "Nếu khách hàng yêu cầu dịch vụ mà chúng tôi không cung cấp, hãy giải thích rằng chúng tôi không có dịch vụ đó.",
    tip: "“Không cung cấp” states that the service isn't offered without sounding abrupt."
  }
];

const STORAGE_KEY = "lingualab-translation-practice-v1";
const elements = {
  answer: document.querySelector("#translation-input"),
  category: document.querySelector("#drill-category"),
  count: document.querySelector("#progress-count"),
  feedback: document.querySelector("#feedback-panel"),
  fill: document.querySelector("#progress-fill"),
  form: document.querySelector("#translation-form"),
  mastered: document.querySelector("#mastered-status"),
  next: document.querySelector("#next-drill"),
  note: document.querySelector("#progress-note"),
  notice: document.querySelector("#app-notice"),
  number: document.querySelector("#drill-number"),
  previous: document.querySelector("#previous-drill"),
  progressBar: document.querySelector("#progress-bar"),
  reference: document.querySelector("#reference-translation"),
  reset: document.querySelector("#reset-progress"),
  source: document.querySelector("#drill-title"),
  context: document.querySelector("#drill-context"),
  tip: document.querySelector("#feedback-tip")
};

let currentIndex = 0;
let masteredDrills = new Set();
let hasReviewed = false;

function showNotice(message) {
  elements.notice.textContent = message;
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...masteredDrills]));
    showNotice("");
  } catch {
    showNotice("Progress could not be saved in this browser. You can still practice this session.");
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved) || saved.some((index) => !Number.isInteger(index) || index < 0 || index >= drills.length)) {
      throw new Error("Saved progress has an unexpected format.");
    }
    masteredDrills = new Set(saved);
  } catch {
    masteredDrills = new Set();
    showNotice("Saved progress could not be read, so this practice starts fresh.");
  }
}

function updateProgress() {
  const completed = masteredDrills.size;
  const percentage = (completed / drills.length) * 100;
  elements.count.innerHTML = `${completed}<span> / ${drills.length}</span>`;
  elements.fill.style.width = `${percentage}%`;
  elements.progressBar.setAttribute("aria-valuemax", String(drills.length));
  elements.progressBar.setAttribute("aria-valuenow", String(completed));
  elements.note.textContent = completed === drills.length
    ? "Beautiful work. You have practiced every phrase."
    : completed === 0
      ? "Every phrase is a chance to get a little better."
      : `${drills.length - completed} ${drills.length - completed === 1 ? "phrase" : "phrases"} left in this set.`;
}

function renderDrill() {
  const drill = drills[currentIndex];
  elements.number.innerHTML = `DRILL ${String(currentIndex + 1).padStart(2, "0")} <span>/ ${String(drills.length).padStart(2, "0")}</span>`;
  elements.category.textContent = drill.category.toUpperCase();
  elements.source.textContent = drill.source;
  elements.context.textContent = drill.context;
  elements.answer.value = "";
  elements.feedback.hidden = true;
  elements.mastered.textContent = masteredDrills.has(currentIndex) ? "Phrase mastered ✓" : "";
  elements.previous.disabled = currentIndex === 0;
  elements.next.disabled = currentIndex === drills.length - 1;
  hasReviewed = false;
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!elements.answer.value.trim()) {
    elements.answer.focus();
    return;
  }
  const drill = drills[currentIndex];
  elements.reference.textContent = drill.reference;
  elements.tip.textContent = drill.tip;
  elements.feedback.hidden = false;
  hasReviewed = true;
  document.querySelector("#got-it").focus();
});

document.querySelector("#got-it").addEventListener("click", () => {
  if (!hasReviewed) return;
  masteredDrills.add(currentIndex);
  saveProgress();
  updateProgress();
  elements.mastered.textContent = "Phrase mastered ✓";
  elements.note.textContent = currentIndex === drills.length - 1
    ? "Nice work. You have reached the end of this set."
    : "Nice work. Keep building your collection of phrases.";
});

document.querySelector("#try-again").addEventListener("click", () => {
  if (!hasReviewed) return;
  masteredDrills.delete(currentIndex);
  saveProgress();
  updateProgress();
  elements.mastered.textContent = "Saved for another practice";
  elements.answer.focus();
});

elements.previous.addEventListener("click", () => {
  if (currentIndex === 0) return;
  currentIndex -= 1;
  renderDrill();
});

elements.next.addEventListener("click", () => {
  if (currentIndex === drills.length - 1) return;
  currentIndex += 1;
  renderDrill();
});

elements.reset.addEventListener("click", () => {
  masteredDrills.clear();
  saveProgress();
  updateProgress();
  renderDrill();
  elements.answer.focus();
});

loadProgress();
updateProgress();
renderDrill();
