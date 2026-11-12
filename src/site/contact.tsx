"use client";

import { useState, type FormEvent } from "react";
import { contactForm, profile, sectionLinks } from "@/data/portfolio";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactAndFooter() {
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

    if (contactForm.web3formsKey) {
      setStatus("sending");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: contactForm.web3formsKey, subject, from_name: "Portfolio LTN", name, contact, message }),
        });
        const json = (await res.json()) as { success?: boolean };
        setStatus(json.success ? "sent" : "error");
        if (json.success) form.reset();
      } catch {
        setStatus("error");
      }
      return;
    }
    const body = [`Tên: ${name}`, `Liên hệ: ${contact}`, "", message].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  return (
    <div className="dark">
      <section className="contact" id="contact" aria-labelledby="contact-t">
        <div className="wrap contact__grid">
          <div className="contact__head">
            <h2 id="contact-t" data-reveal>
              <span className="h-idx">06</span>
              Muốn xem kỹ hơn <span className="ed">một dự án?</span>
            </h2>
            <p data-reveal>Để lại lời nhắn, tôi sẵn sàng trình bày trực tiếp sản phẩm, cách thiết kế và cách vận hành của từng hệ thống.</p>
            <div className="contact__meta" data-reveal>
              <span>{profile.role}</span>
              <span>{profile.location} · phản hồi trong 24 giờ</span>
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
            </div>
          </div>

          {status === "sent" ? (
            <div className="form__done" role="status">
              <b>Đã gửi lời nhắn.</b>
              <p>Cảm ơn bạn, tôi sẽ phản hồi sớm qua thông tin bạn để lại.</p>
              <button type="button" onClick={() => setStatus("idle")}>Gửi lời nhắn khác</button>
            </div>
          ) : (
            <form className="form" onSubmit={onSubmit} data-reveal>
              <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="field">
                <span>Tên của bạn</span>
                <input name="name" required autoComplete="name" placeholder="Nguyễn Văn A" />
              </label>
              <label className="field">
                <span>Email hoặc số điện thoại / Zalo</span>
                <input name="contact" required autoComplete="email" placeholder="email@vidu.vn · 090…" />
              </label>
              <label className="field">
                <span>Lời nhắn</span>
                <textarea name="message" required rows={3} placeholder="Bạn muốn trao đổi về điều gì…" />
              </label>
              <button type="submit" className="btn" disabled={status === "sending"}>
                {status === "sending" ? "Đang gửi…" : "Gửi lời nhắn"}
              </button>
              {status === "error" && <p className="form__err" role="alert">Chưa gửi được, bạn vui lòng thử lại nhé.</p>}
            </form>
          )}
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <p className="foot__mark" aria-hidden="true">LTN<span className="dot">.</span></p>
          <div className="foot__row">
            <span>© 2026 {profile.name} · {profile.role}</span>
            <nav aria-label="Liên kết chân trang">
              {sectionLinks.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
              <a href="#top">Lên đầu trang ↑</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
