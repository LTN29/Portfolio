/* Dữ liệu có cấu trúc (schema.org) cho Google và các công cụ AI đọc hiểu trang. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
