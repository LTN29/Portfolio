"use client";

import { useState, type FormEvent } from "react";
import { contactForm, profile } from "@/data/portfolio";
import { RadarPulseIcon, SparkArrowIcon } from "@/components/visuals/icons";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return;
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `Lời nhắn từ portfolio — ${name || "khách"}`;
    const body = [`Tên: ${name}`, `Liên hệ: ${contact}`, "", message].join("\n");

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
            message,
          }),
        });
        const json = (await res.json()) as { success?: boolean };
        setStatus(json.success ? "sent" : "error");
        if (json.success) form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <section id="contact" className="pf-contact" aria-labelledby="contact-title">
      <div className="sg-wrap pf-contact__grid">
        <header className="pf-contact__head reveal">
          <p className="sg-label">06 — Liên hệ</p>
          <h2 id="contact-title" className="sg-display">
            Muốn xem kỹ hơn<br />
            <span className="sg-tone">một dự án?</span>
          </h2>
          <p className="pf-contact__deck">
            Để lại lời nhắn, tôi sẵn sàng trình bày trực tiếp sản phẩm, cách thiết kế và cách vận hành của từng hệ thống.
          </p>

          <div className="pf-contact__cards">
            <div className="pf-contact__info-card">
              <span className="pf-contact__info-icon">
                <RadarPulseIcon />
              </span>
              <div>
                <b>{profile.role}</b>
                <small>{profile.location}</small>
              </div>
            </div>
            <div className="pf-contact__info-card">
              <span className="pf-contact__info-icon pf-contact__info-icon--clock">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M12 7.5V12L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <b>Phản hồi trong 24 giờ</b>
                <small>Qua email hoặc Zalo bạn để lại</small>
              </div>
            </div>
          </div>
        </header>

        {status === "sent" ? (
          <div className="pf-contact__done" role="status">
            <b>Đã gửi lời nhắn.</b>
            <p>Cảm ơn bạn, tôi sẽ phản hồi sớm qua thông tin bạn để lại.</p>
            <button type="button" className="sg-link" onClick={() => setStatus("idle")}>Gửi lời nhắn khác</button>
          </div>
        ) : (
          <form className="pf-form" onSubmit={onSubmit}>
            <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label className="pf-field">
              <span>Tên của bạn</span>
              <input name="name" required autoComplete="name" placeholder="Nguyễn Văn A" />
            </label>
            <label className="pf-field">
              <span>Email hoặc số điện thoại / Zalo</span>
              <input name="contact" required autoComplete="email" placeholder="email@vidu.vn · 090..." />
            </label>


            <label className="pf-field pf-field--wide">
              <span>Lời nhắn</span>
              <textarea name="message" required rows={4} placeholder="Bạn muốn trao đổi về điều gì…" />
            </label>

            <div className="pf-form__foot">
              <button type="submit" className="sg-btn" disabled={status === "sending"}>
                <span>{status === "sending" ? "Đang gửi…" : "Gửi lời nhắn"}</span>
                <SparkArrowIcon />
              </button>
              {status === "error" && <p className="pf-form__error" role="alert">Chưa gửi được, bạn vui lòng thử lại nhé.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
