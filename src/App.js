import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Send,
  Cake,
  Camera,
  Mic,
  Gift,
} from "lucide-react";

const EMAILJS_SERVICE_ID = "service_9hqqktv";
const EMAILJS_TEMPLATE_ID = "template_zjebrms";
const EMAILJS_PUBLIC_KEY = "Q-txKxRWW07uhFe55";

const MENU_OPTIONS = [
  { id: "디저트 세트", label: "디저트 세트", desc: "답례품 및 선물용" },
  { id: "샌드위치 세트", label: "샌드위치 세트", desc: "가벼운 다과용" },
  { id: "핑거푸드 세트", label: "핑거푸드 세트", desc: "간편한 한 입 요리" },
  { id: "식사 구성", label: "식사 구성", desc: "든든한 한 끼 식사" },
];
const SERVICE_OPTIONS = [
  { id: "도시락 케이터링", label: "도시락 케이터링", desc: "개별 포장 배송" },
  {
    id: "푸드 박스 케이터링",
    label: "푸드 박스 케이터링",
    desc: "박스 단위 구성 배송",
  },
  {
    id: "출장 파티 케이터링",
    label: "출장 파티 케이터링",
    desc: "현장 세팅 포함",
  },
];
const SOURCES = [
  "인스타그램",
  "네이버 블로그",
  "네이버 & 구글 검색",
  "홈페이지",
  "지인 추천",
  "기타",
];
const CATEGORIES = [
  {
    id: "연예인 서포트",
    label: "연예인 서포트",
    icon: Mic,
    desc: "아티스트 & 스태프 서포트 도시락",
  },
  {
    id: "행사 케이터링",
    label: "행사 케이터링",
    icon: Sparkles,
    desc: "기업 행사, 세미나, 워크샵, 송년회",
  },
  {
    id: "촬영장 케이터링",
    label: "촬영장 케이터링",
    icon: Camera,
    desc: "웨딩, 광고, 드라마 등 촬영 현장",
  },
  {
    id: "답례품",
    label: "답례품",
    icon: Gift,
    desc: "백일, 돌, 칠순 등 답례 디저트",
  },
];

const inp = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1.5px solid #e2e8f0",
  fontSize: 14,
  color: "#1e293b",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  fontFamily: "inherit",
};

function Field({ label, hint, required, children }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 600,
          color: "#334155",
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "#f87171" }}> *</span>}
      </label>
      {hint && (
        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            marginBottom: 8,
            lineHeight: 1.6,
          }}
        >
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    category: "",
    managerName: "",
    managerPhone: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    artistInfo: "",
    companyInfo: "",
    shootingType: "",
    giftOccasion: "",
    artistCount: "",
    staffCount: "",
    artistBudget: "",
    staffBudget: "",
    totalPeople: "",
    totalBudget: "",
    peopleDetail: "",
    preferences: "",
    menuTypes: [],
    serviceType: [],
    additionalInfo: "",
    source: "",
    eventDateExtra: "",
  });

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArr = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
    }));
  const cat = CATEGORIES.find((c) => c.id === form.category);
  const progress = ((step + 1) / 5) * 100;

  const canNext = () => {
    if (step === 0) return form.category !== "";
    if (step === 1)
      return (
        form.managerName &&
        form.managerPhone &&
        form.eventDate &&
        form.eventLocation
      );
    if (step === 2) {
      if (form.category === "연예인 서포트")
        return form.artistInfo && (form.artistCount || form.staffCount);
      return (
        (form.companyInfo || form.shootingType || form.giftOccasion) &&
        form.totalPeople
      );
    }
    if (step === 3)
      return form.menuTypes.length > 0 && form.serviceType.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const isArtist = form.category === "연예인 서포트";
      const params = {
        category: form.category,
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        eventDate:
          form.eventDate + (form.eventTime ? " " + form.eventTime : ""),
        eventLocation: form.eventLocation,
        totalPeople: isArtist
          ? `아티스트 ${form.artistCount || 0}명 / 스태프 ${
              form.staffCount || 0
            }명`
          : `${form.totalPeople}명${
              form.peopleDetail ? " (" + form.peopleDetail + ")" : ""
            }`,
        totalBudget: isArtist
          ? `아티스트 ${form.artistBudget || "-"} / 스태프 ${
              form.staffBudget || "-"
            }`
          : form.totalBudget || "-",
        menuTypes: form.menuTypes.join(", ") || "-",
        serviceType: form.serviceType.join(", ") || "-",
        additionalInfo: isArtist
          ? `[선호/비선호] ${form.preferences || "없음"} / [추가요청] ${
              form.additionalInfo || "없음"
            }`
          : form.additionalInfo || "없음",
        source: form.source || "기타",
        name: form.managerName,
        email: "noreply@catering.com",
        companyInfo: isArtist
          ? `아티스트: ${form.artistInfo}`
          : form.category === "행사 케이터링"
          ? form.companyInfo
          : form.category === "촬영장 케이터링"
          ? `촬영: ${form.shootingType}`
          : `답례품: ${form.giftOccasion}`,
      };
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
      setSubmitted(true);
    } catch (e) {
      setError("제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      console.error(e);
    }
    setSubmitting(false);
  };

  if (submitted)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg,#ecfdf5,#f0fdfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            padding: 48,
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg,#10b981,#0d9488)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <Check size={36} color="#fff" strokeWidth={3} />
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 12,
            }}
          >
            문의가 접수되었습니다
          </h2>
          <p style={{ color: "#64748b", lineHeight: 1.8, marginBottom: 24 }}>
            소중한 문의 감사드립니다.
            <br />
            확인 후 <strong style={{ color: "#10b981" }}>카카오 채널</strong>을
            통해 빠른 답변 드리겠습니다.
          </p>
          <div
            style={{
              background: "#f0fdf4",
              borderRadius: 16,
              padding: 16,
              fontSize: 13,
              color: "#64748b",
              textAlign: "left",
            }}
          >
            <p style={{ fontWeight: 600, color: "#374151", marginBottom: 8 }}>
              📌 운영 안내
            </p>
            <p style={{ margin: "4px 0" }}>• 일요일은 운영하지 않습니다.</p>
            <p style={{ margin: "4px 0" }}>
              • 최소 주문 금액: 30만원 (VAT 및 배송비 별도)
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm({
                category: "",
                managerName: "",
                managerPhone: "",
                eventDate: "",
                eventTime: "",
                eventLocation: "",
                artistInfo: "",
                companyInfo: "",
                shootingType: "",
                giftOccasion: "",
                artistCount: "",
                staffCount: "",
                artistBudget: "",
                staffBudget: "",
                totalPeople: "",
                totalBudget: "",
                peopleDetail: "",
                preferences: "",
                menuTypes: [],
                serviceType: [],
                additionalInfo: "",
                source: "",
                eventDateExtra: "",
              });
            }}
            style={{
              marginTop: 20,
              fontSize: 13,
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            새 문의 작성하기
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#ecfdf5,#f0fdfa)",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#fff",
              padding: "6px 16px",
              borderRadius: 999,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              marginBottom: 16,
            }}
          >
            <Sparkles size={14} color="#10b981" />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#64748b",
                letterSpacing: 1,
              }}
            >
              FLOWERS DO CATERING
            </span>
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            꽃들도 케이터링 견적 문의
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            정성껏 준비된 한 끼, 특별한 순간을 더욱 빛나게
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 12, color: "#94a3b8" }}>진행률</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}>
              {step + 1} / 5
            </span>
          </div>
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: 999,
              height: 8,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "linear-gradient(90deg,#10b981,#0d9488)",
                borderRadius: 999,
                transition: "width .4s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "32px 28px",
            marginBottom: 16,
          }}
        >
          {step === 0 && (
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                서비스 카테고리 선택
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                문의하실 케이터링 종류를 선택해 주세요
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = form.category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => set("category", c.id)}
                      style={{
                        padding: 20,
                        borderRadius: 16,
                        border: `2px solid ${active ? "#10b981" : "#e2e8f0"}`,
                        background: active ? "#f0fdf4" : "#fff",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all .2s",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: active ? "#10b981" : "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                        }}
                      >
                        <Icon size={20} color={active ? "#fff" : "#64748b"} />
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#0f172a",
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "#94a3b8",
                          lineHeight: 1.5,
                        }}
                      >
                        {c.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              {cat && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <cat.icon size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}
                  >
                    {cat.label}
                  </span>
                </div>
              )}
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                기본 정보
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                담당자 정보와 일시·장소를 알려주세요
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="담당자 성함" required>
                    <input
                      style={inp}
                      value={form.managerName}
                      onChange={(e) => set("managerName", e.target.value)}
                      placeholder="홍길동"
                    />
                  </Field>
                  <Field label="담당자 연락처" required>
                    <input
                      style={inp}
                      type="tel"
                      value={form.managerPhone}
                      onChange={(e) => set("managerPhone", e.target.value)}
                      placeholder="010-0000-0000"
                    />
                  </Field>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                  }}
                >
                  <Field label="행사 날짜" required>
                    <input
                      style={inp}
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => set("eventDate", e.target.value)}
                    />
                  </Field>
                  <Field label="행사 시간">
                    <input
                      style={inp}
                      type="time"
                      value={form.eventTime}
                      onChange={(e) => set("eventTime", e.target.value)}
                    />
                  </Field>
                </div>
                <Field
                  label="딜리버리 장소"
                  hint="케이터링을 전달 받으실 정확한 주소를 기재해 주세요"
                  required
                >
                  <input
                    style={inp}
                    value={form.eventLocation}
                    onChange={(e) => set("eventLocation", e.target.value)}
                    placeholder="서울시 강남구 ○○로 ○○"
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {cat && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <cat.icon size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}
                  >
                    {cat.label}
                  </span>
                </div>
              )}
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                상세 정보
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                정확한 견적을 위해 자세히 알려주세요
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {form.category === "연예인 서포트" && (
                  <>
                    <Field
                      label="아티스트 정보"
                      hint="아티스트명, 소속사 등을 기재해 주세요"
                      required
                    >
                      <input
                        style={inp}
                        value={form.artistInfo}
                        onChange={(e) => set("artistInfo", e.target.value)}
                        placeholder="예) ○○○ / △△엔터테인먼트"
                      />
                    </Field>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <Field label="아티스트 인원">
                        <input
                          style={inp}
                          type="number"
                          value={form.artistCount}
                          onChange={(e) => set("artistCount", e.target.value)}
                          placeholder="명"
                        />
                      </Field>
                      <Field label="스태프 인원">
                        <input
                          style={inp}
                          type="number"
                          value={form.staffCount}
                          onChange={(e) => set("staffCount", e.target.value)}
                          placeholder="명"
                        />
                      </Field>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <Field label="아티스트 1인 예산">
                        <input
                          style={inp}
                          value={form.artistBudget}
                          onChange={(e) => set("artistBudget", e.target.value)}
                          placeholder="예) 50,000원"
                        />
                      </Field>
                      <Field label="스태프 1인 예산">
                        <input
                          style={inp}
                          value={form.staffBudget}
                          onChange={(e) => set("staffBudget", e.target.value)}
                          placeholder="예) 20,000원"
                        />
                      </Field>
                    </div>
                    <Field label="아티스트 선호 / 비선호 식재료">
                      <textarea
                        style={{ ...inp, resize: "none" }}
                        rows={3}
                        value={form.preferences}
                        onChange={(e) => set("preferences", e.target.value)}
                        placeholder="예) 견과류 알레르기 / 매운 음식 선호"
                      />
                    </Field>
                  </>
                )}
                {form.category === "행사 케이터링" && (
                  <>
                    <Field
                      label="기업체 정보 및 행사 종류"
                      hint="기업명과 행사 성격을 알려주세요"
                      required
                    >
                      <textarea
                        style={{ ...inp, resize: "none" }}
                        rows={3}
                        value={form.companyInfo}
                        onChange={(e) => set("companyInfo", e.target.value)}
                        placeholder="예) ○○주식회사 / 연말 송년회"
                      />
                    </Field>
                    <Field label="행사 참여 인원" required>
                      <input
                        style={inp}
                        type="number"
                        value={form.totalPeople}
                        onChange={(e) => set("totalPeople", e.target.value)}
                        placeholder="예) 50"
                      />
                    </Field>
                    <Field label="인원 상세">
                      <input
                        style={inp}
                        value={form.peopleDetail}
                        onChange={(e) => set("peopleDetail", e.target.value)}
                        placeholder="예) 30대 직장인, 남녀 6:4"
                      />
                    </Field>
                    <Field
                      label="총 예산 (1인당 예산)"
                      hint="최소 주문 금액은 30만원입니다 (VAT 및 배송비 별도)"
                    >
                      <input
                        style={inp}
                        value={form.totalBudget}
                        onChange={(e) => set("totalBudget", e.target.value)}
                        placeholder="예) 1인 25,000원"
                      />
                    </Field>
                  </>
                )}
                {form.category === "촬영장 케이터링" && (
                  <>
                    <Field label="촬영 종류" required>
                      <input
                        style={inp}
                        value={form.shootingType}
                        onChange={(e) => set("shootingType", e.target.value)}
                        placeholder="예) 웨딩 촬영 / 광고 촬영"
                      />
                    </Field>
                    <Field label="필요 인원" required>
                      <input
                        style={inp}
                        type="number"
                        value={form.totalPeople}
                        onChange={(e) => set("totalPeople", e.target.value)}
                        placeholder="예) 30"
                      />
                    </Field>
                    <Field label="출연자 / 스태프 구성">
                      <input
                        style={inp}
                        value={form.peopleDetail}
                        onChange={(e) => set("peopleDetail", e.target.value)}
                        placeholder="예) 출연자 5명 / 스태프 25명"
                      />
                    </Field>
                    <Field
                      label="총 예산 (1인당 예산)"
                      hint="최소 주문 금액은 30만원입니다 (VAT 및 배송비 별도)"
                    >
                      <input
                        style={inp}
                        value={form.totalBudget}
                        onChange={(e) => set("totalBudget", e.target.value)}
                        placeholder="예) 1인 20,000원"
                      />
                    </Field>
                  </>
                )}
                {form.category === "답례품" && (
                  <>
                    <Field label="행사 종류" required>
                      <input
                        style={inp}
                        value={form.giftOccasion}
                        onChange={(e) => set("giftOccasion", e.target.value)}
                        placeholder="예) 첫 돌잔치 답례품"
                      />
                    </Field>
                    <Field label="수량 (인원)" required>
                      <input
                        style={inp}
                        type="number"
                        value={form.totalPeople}
                        onChange={(e) => set("totalPeople", e.target.value)}
                        placeholder="예) 50"
                      />
                    </Field>
                    <Field label="받는 분 정보">
                      <input
                        style={inp}
                        value={form.peopleDetail}
                        onChange={(e) => set("peopleDetail", e.target.value)}
                        placeholder="예) 가족, 친지 위주"
                      />
                    </Field>
                    <Field
                      label="총 예산 (1개당 예산)"
                      hint="최소 주문 금액은 30만원입니다 (VAT 및 배송비 별도)"
                    >
                      <input
                        style={inp}
                        value={form.totalBudget}
                        onChange={(e) => set("totalBudget", e.target.value)}
                        placeholder="예) 개당 15,000원"
                      />
                    </Field>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {cat && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <cat.icon size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}
                  >
                    {cat.label}
                  </span>
                </div>
              )}
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                메뉴 & 서비스 선택
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                희망하시는 메뉴와 서비스를 선택해 주세요 (복수 선택 가능)
              </p>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <Cake size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}
                  >
                    희망 메뉴 구성
                  </span>
                  <span style={{ fontSize: 12, color: "#f87171" }}>*</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {MENU_OPTIONS.map((o) => {
                    const active = form.menuTypes.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        onClick={() => toggleArr("menuTypes", o.id)}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          border: `2px solid ${active ? "#10b981" : "#e2e8f0"}`,
                          background: active ? "#f0fdf4" : "#fff",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#0f172a",
                                marginBottom: 2,
                              }}
                            >
                              {o.label}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                              {o.desc}
                            </div>
                          </div>
                          {active && (
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                background: "#10b981",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Check size={12} color="#fff" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 12,
                  }}
                >
                  <Send size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}
                  >
                    희망 서비스 형태
                  </span>
                  <span style={{ fontSize: 12, color: "#f87171" }}>*</span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {SERVICE_OPTIONS.map((o) => {
                    const active = form.serviceType.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        onClick={() => toggleArr("serviceType", o.id)}
                        style={{
                          padding: 14,
                          borderRadius: 14,
                          border: `2px solid ${active ? "#10b981" : "#e2e8f0"}`,
                          background: active ? "#f0fdf4" : "#fff",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#0f172a",
                                marginBottom: 2,
                              }}
                            >
                              {o.label}
                            </div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>
                              {o.desc}
                            </div>
                          </div>
                          {active && (
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                background: "#10b981",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Check size={12} color="#fff" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              {cat && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  <cat.icon size={16} color="#10b981" />
                  <span
                    style={{ fontSize: 12, fontWeight: 600, color: "#10b981" }}
                  >
                    {cat.label}
                  </span>
                </div>
              )}
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                추가 정보
              </h2>
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}>
                마지막 단계입니다
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <Field
                  label="추가 요청 사항"
                  hint="특별 요청 사항을 자유롭게 기재해 주세요"
                >
                  <textarea
                    style={{ ...inp, resize: "none" }}
                    rows={5}
                    value={form.additionalInfo}
                    onChange={(e) => set("additionalInfo", e.target.value)}
                    placeholder="예) 비건 옵션 / 알레르기 제외 등"
                  />
                </Field>
                <Field label="꽃들도 케이터링을 어떻게 알게 되셨나요?">
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 8,
                    }}
                  >
                    {SOURCES.map((s) => (
                      <button
                        key={s}
                        onClick={() => set("source", s)}
                        style={{
                          padding: "10px 8px",
                          borderRadius: 12,
                          border: `2px solid ${
                            form.source === s ? "#10b981" : "#e2e8f0"
                          }`,
                          background: form.source === s ? "#f0fdf4" : "#fff",
                          fontSize: 12,
                          color: form.source === s ? "#059669" : "#64748b",
                          fontWeight: form.source === s ? 600 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 16,
                    padding: 16,
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    📌 안내 사항
                  </p>
                  <p style={{ margin: "4px 0", fontSize: 12 }}>
                    • 일요일은 운영하지 않습니다.
                  </p>
                  <p style={{ margin: "4px 0", fontSize: 12 }}>
                    • 최소 주문 금액은 30만원입니다.
                  </p>
                  <p style={{ margin: "4px 0", fontSize: 12 }}>
                    • 접수 후 카카오 채널로 답변 드립니다.
                  </p>
                </div>
                {error && (
                  <p
                    style={{
                      color: "#ef4444",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 14,
                background: "#fff",
                border: "1px solid #e2e8f0",
                color: "#64748b",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <ChevronLeft size={16} /> 이전
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 14,
                background: canNext()
                  ? "linear-gradient(135deg,#10b981,#0d9488)"
                  : "#e2e8f0",
                color: canNext() ? "#fff" : "#94a3b8",
                fontSize: 14,
                fontWeight: 600,
                cursor: canNext() ? "pointer" : "not-allowed",
                border: "none",
                marginLeft: "auto",
              }}
            >
              다음 <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                borderRadius: 14,
                background: submitting
                  ? "#e2e8f0"
                  : "linear-gradient(135deg,#10b981,#0d9488)",
                color: submitting ? "#94a3b8" : "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                border: "none",
                marginLeft: "auto",
              }}
            >
              {submitting ? (
                "제출 중..."
              ) : (
                <>
                  <Send size={16} /> 문의 제출하기
                </>
              )}
            </button>
          )}
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#cbd5e1",
            marginTop: 24,
          }}
        >
          © 꽃들도 케이터링 · Flowers Do Catering
        </p>
      </div>
    </div>
  );
}
