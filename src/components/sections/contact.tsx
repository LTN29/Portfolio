"use client";

import { useState, type FormEvent } from "react";
import { contactForm, profile } from "@/data/portfolio";

type Status = "idle" | "sending" | "sent" | "error";

/** Form "Gửi yêu cầu": khách mô tả dự án, yêu cầu được gửi về email của anh. */
export function Contact() {
  const [types, setTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const toggleType = (t: string) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // chống spam
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Yêu cầu dự án từ ${name || "khách"} — ${types.join(", ") || "chưa chọn loại"}`;
    const body = [
      `Tên: ${name}`,
      `Liên hệ: ${contact}`,
      `Loại dự án: ${types.join(", ") || "—"}`,
      `Ngân sách: ${budget || "—"}`,
      "",
      message,
    ].join("\n");

    if (contactForm.web3formsKey) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: contactForm.web3formsKey,
            subject,
            from_name: "Portfolio LTN",
            name,
            contact,
            project_type: types.join(", "),
            budget,
            message,
          }),
        });
        const json = (await res.json()) as { success?: boolean };
        setStatus(json.success ? "sent" : "error");
        if (json.success) { form.reset(); setTypes([]); setBudget(""); }
      } catch {
        setStatus("error");
      }
      return;
    }
    // Chưa có key: mở ứng dụng email của khách với nội dung soạn sẵn
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <section id="contact" className="pf-contact" aria-labelledby="contact-title">
      <div className="sg-wrap pf-contact__grid">
        <header className="pf-contact__head reveal">
          <p className="sg-label">07 — Gửi yêu cầu</p>
          <h2 id="contact-title" className="sg-display">
            Kể tôi nghe<br />
            <span className="sg-tone">bài toán của bạn.</span>
          </h2>
          <p className="pf-contact__deck">Vài dòng là đủ. Tôi đọc và trả lời qua email kèm hướng làm, thời gian và chi phí dự kiến.</p>
        </header>

        {status === "sent" ? (
          <div className="pf-contact__done" role="status">
            <b>Đã gửi yêu cầu.</b>
            <p>Cảm ơn bạn — tôi sẽ phản hồi qua email sớm nhất.</p>
            <button type="button" className="sg-link" onClick={() => setStatus("idle")}>Gửi yêu cầu khác</button>
          </div>
        ) : (
          <form className="pf-form" onSubmit={onSubmit}>
            <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className="pf-field">
              <span>Tên của bạn</span>
              <input name="name" required autoComplete="name" placeholder="Nguyễn Văn A" />
            </label>
            <label className="pf-field">
              <span>Email hoặc số điện thoại</span>
              <input name="contact" required autoComplete="email" placeholder="ban@congty.vn" />
            </label>

            <fieldset className="pf-field pf-field--wide">
              <legend>Bạn cần làm gì?</legend>
              <div className="pf-pills">
                {contactForm.projectTypes.map((t) => (
                  <button key={t} type="button" className={types.includes(t) ? "is-on" : undefined} aria-pressed={types.includes(t)} onClick={() => toggleType(t)}>{t}</button>
                ))}
              </div>
            </fieldset>

            <fieldset className="pf-field pf-field--wide">
              <legend>Ngân sách dự kiến</legend>
              <div className="pf-pills">
                {contactForm.budgets.map((b) => (
                  <button key={b} type="button" className={budget === b ? "is-on" : undefined} aria-pressed={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>{b}</button>
                ))}
              </div>
            </fieldset>

            <label className="pf-field pf-field--wide">
              <span>Mô tả ngắn</span>
              <textarea name="message" required rows={4} placeholder="Mục tiêu, người dùng, thời hạn mong muốn…" />
            </label>

            <div className="pf-form__foot">
              <button type="submit" className="sg-btn" disabled={status === "sending"}>
                {status === "sending" ? "Đang gửi…" : "Gửi yêu cầu"}
              </button>
              {status === "error" && <p className="pf-form__error" role="alert">Chưa gửi được, bạn thử lại hoặc nhắn qua email nhé.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
