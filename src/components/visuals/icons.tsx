import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Multi-ring animated radar/availability beacon for the Hero status card */
export function RadarPulseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" {...props}>
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
      <path d="M14 2 A12 12 0 0 1 26 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="pf-icon-spin" />
      <circle cx="14" cy="14" r="3.5" fill="currentColor" className="pf-icon-pulse" />
    </svg>
  );
}

/** Octagonal architectural crest for engineer identity */
export function CrestIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" {...props}>
      <polygon
        points="14,2 22.5,5.5 26,14 22.5,22.5 14,26 5.5,22.5 2,14 5.5,5.5"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <polygon
        points="14,6 20,8.5 22,14 20,19.5 14,22 8,19.5 6,14 8,8.5"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="1.1"
      />
      <path d="M14 6V22M6 14H22" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="14" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Precision diagonal arrow with framing corners */
export function SparkArrowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path d="M5.5 14.5L14.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7.5 5.5H14.5V12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="5.5" cy="14.5" r="1.3" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}

/** Blueprint grid & compass icon for exploring systems */
export function CompassGridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
      <polygon points="10,5 12.2,10 10,15 7.8,10" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Category emblems for Hero Frieze & AI Projects */
export function CategoryEmblem({ kind }: { kind: string }) {
  switch (kind) {
    case "live":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-emblem-sm">
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.1" strokeDasharray="2.5 2.5" />
          <path d="M7.5 9.5C6.2 10.9 6.2 13.1 7.5 14.5M16.5 9.5C17.8 10.9 17.8 13.1 16.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M5 7C2.5 9.8 2.5 14.2 5 17M19 7C21.5 9.8 21.5 14.2 19 17" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" />
        </svg>
      );
    case "office":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-emblem-sm">
          <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
          <path d="M12 3V12M20 7.5L12 12M4 7.5L12 12M12 12V21" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <circle cx="12" cy="3" r="1.5" fill="currentColor" />
          <circle cx="20" cy="7.5" r="1.5" fill="currentColor" />
          <circle cx="4" cy="7.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "gateway":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-emblem-sm">
          <rect x="6.5" y="6.5" width="11" height="11" rx="2" transform="rotate(45 12 12)" stroke="currentColor" strokeWidth="1.4" />
          <rect x="8.5" y="8.5" width="7" height="7" rx="1" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.1" />
          <path d="M2 12H6M18 12H22M12 2V6M12 18V22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      );
    case "orchestrator":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-emblem-sm">
          <circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="18" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="17.5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8.5 7H15.5M7.5 9.2L10.6 15.2M16.5 9.2L13.4 15.2" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.2" />
          <circle cx="12" cy="17.5" r="1.2" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-emblem-sm">
          <rect x="6" y="2.5" width="12" height="19" rx="3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 5.5H14" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.2" />
          <path d="M10.8 12.5L11.7 13.4L13.5 11.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

/** 3 Story Architectural Pillar Emblems */
export function PillarEmblem({ index }: { index: number }) {
  if (index === 0) {
    // Isometric 3-layer full-stack architecture lattice
    return (
      <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className="pf-pillar__svg">
        <circle cx="22" cy="22" r="20" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
        <polygon points="22,7 36,14 22,21 8,14" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.06" />
        <polyline points="8,21.5 22,28.5 36,21.5" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.4" />
        <polyline points="8,29 22,36 36,29" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
        <line x1="22" y1="14" x2="22" y2="36" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="22" cy="14" r="2.2" fill="currentColor" />
      </svg>
    );
  }
  if (index === 1) {
    // High-availability fault-tolerant shield & pulse
    return (
      <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className="pf-pillar__svg">
        <circle cx="22" cy="22" r="20" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="3 3" />
        <path
          d="M22 7L34 12V21.5C34 29.2 28.8 35.4 22 37.5C15.2 35.4 10 29.2 10 21.5V12L22 7Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.05"
        />
        <path
          d="M14.5 22.5H18.2L20.4 17.5L23.6 27L25.8 22.5H29.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  // Sovereign code & container cube
  return (
    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true" className="pf-pillar__svg">
      <circle cx="22" cy="22" r="20" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
      <polygon points="22,8 35,15.5 35,28.5 22,36 9,28.5 9,15.5" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.05" />
      <path d="M9 15.5L22 23L35 15.5M22 23V36" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.3" />
      <polygon points="22,13.5 28.5,17.2 22,21 15.5,17.2" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.1" />
      <circle cx="22" cy="23" r="2.2" fill="currentColor" />
    </svg>
  );
}

/** 6 Bespoke Intricate Service Emblems */
export function ServiceEmblem({ index }: { index: number }) {
  switch (index) {
    case 0: // AI Chatbot & Livestream
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />
          <circle cx="24" cy="24" r="14" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.1" strokeDasharray="3 3" />
          <path d="M13 24V22M17.5 28V18M22 31V15M26.5 29V17M31 26V20M35 24V22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="24" cy="10" r="2" fill="currentColor" />
          <circle cx="38" cy="24" r="2" fill="currentColor" fillOpacity="0.6" />
          <circle cx="10" cy="24" r="2" fill="currentColor" fillOpacity="0.6" />
        </svg>
      );
    case 1: // AI Agent & Multi-Agent
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.1" />
          <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="8" y1="15" x2="40" y2="33" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          <line x1="40" y1="15" x2="8" y2="33" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
          <rect x="18.5" y="18.5" width="11" height="11" rx="2" transform="rotate(45 24 24)" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
          <circle cx="24" cy="24" r="2.5" fill="currentColor" />
          <circle cx="24" cy="6" r="2.2" fill="currentColor" />
          <circle cx="40" cy="15" r="2.2" fill="currentColor" />
          <circle cx="40" cy="33" r="2.2" fill="currentColor" />
          <circle cx="24" cy="42" r="2.2" fill="currentColor" />
          <circle cx="8" cy="33" r="2.2" fill="currentColor" />
          <circle cx="8" cy="15" r="2.2" fill="currentColor" />
        </svg>
      );
    case 2: // Enterprise Web & ERP
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <rect x="6" y="9" width="36" height="30" rx="4" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.04" />
          <line x1="6" y1="16" x2="42" y2="16" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
          <circle cx="11" cy="12.5" r="1.2" fill="currentColor" />
          <circle cx="15" cy="12.5" r="1.2" fill="currentColor" fillOpacity="0.6" />
          <circle cx="19" cy="12.5" r="1.2" fill="currentColor" fillOpacity="0.3" />
          <rect x="11" y="21" width="11" height="13" rx="2" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" />
          <path d="M26 31L30 26L33.5 28.5L37.5 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="37.5" cy="22" r="2" fill="currentColor" />
        </svg>
      );
    case 3: // Mobile App iOS & Android
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <rect x="11" y="8" width="18" height="32" rx="4" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
          <rect x="18" y="6" width="19" height="34" rx="4.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
          <line x1="24.5" y1="10.5" x2="30.5" y2="10.5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="27.5" cy="23" r="5.5" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.3" />
          <path d="M25.5 23L27 24.5L30 21.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 4: // Workflow Automation
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <rect x="6" y="10" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="31" y="10" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="18.5" y="28" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
          <path d="M17 15.5H31M11.5 21V29.5C11.5 31.7 13.3 33.5 15.5 33.5H18.5M36.5 21V29.5C36.5 31.7 34.7 33.5 32.5 33.5H29.5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.3" />
          <circle cx="24" cy="33.5" r="2.2" fill="currentColor" />
        </svg>
      );
    default: // System Architecture & Cloud
      return (
        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="pf-service__svg">
          <ellipse cx="24" cy="14" rx="15" ry="5.5" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.06" />
          <path d="M9 14V24C9 27 15.7 29.5 24 29.5C32.3 29.5 39 27 39 24V14" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.4" />
          <path d="M9 24V34C9 37 15.7 39.5 24 39.5C32.3 39.5 39 37 39 34V24" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
          <circle cx="32" cy="23.5" r="1.6" fill="currentColor" />
          <circle cx="32" cy="33.5" r="1.6" fill="currentColor" />
        </svg>
      );
  }
}

/** 6 System Roster Icons */
export function SystemRowIcon({ index }: { index: number }) {
  switch (index) {
    case 0: // ERP
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    case 1: // Inventory
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <polygon points="12,2.5 21,7.5 12,12.5 3,7.5" stroke="currentColor" strokeWidth="1.4" />
          <polyline points="3,12.5 12,17.5 21,12.5" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" />
          <polyline points="3,17 12,22 21,17" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" />
        </svg>
      );
    case 2: // Warranty
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <path d="M12 2.5L20 6V12.5C20 17.5 16.5 21.2 12 22.5C7.5 21.2 4 17.5 4 12.5V6L12 2.5Z" stroke="currentColor" strokeWidth="1.4" />
          <path d="M9 12.2L11 14.2L15.2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 3: // Automation
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <circle cx="6" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="18" cy="6" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="12" cy="18" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8.8 6H15.2M7.5 8.5L10.5 15.5M16.5 8.5L13.5 15.5" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.3" />
        </svg>
      );
    case 4: // E-Commerce
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <path d="M4 7H20L18.5 19.5H5.5L4 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M8.5 7V5.5C8.5 3.6 10.1 2 12 2C13.9 2 15.5 3.6 15.5 5.5V7" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" />
          <circle cx="12" cy="13" r="2" fill="currentColor" />
        </svg>
      );
    default: // Analytics
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="pf-sys-icon">
          <path d="M4 19.5H20" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.3" strokeLinecap="round" />
          <rect x="5.5" y="12" width="3" height="5.5" rx="0.8" fill="currentColor" fillOpacity="0.45" />
          <rect x="10.5" y="8.5" width="3" height="9" rx="0.8" fill="currentColor" fillOpacity="0.7" />
          <rect x="15.5" y="4.5" width="3" height="13" rx="0.8" fill="currentColor" />
        </svg>
      );
  }
}

/** 4 Process Protocol Stage Emblems */
export function ProcessEmblem({ index }: { index: number }) {
  switch (index) {
    case 0: // Discovery & Blueprint
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className="pf-protocol__svg">
          <circle cx="18" cy="18" r="15" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.1" strokeDasharray="3 3" />
          <polygon points="18,7 22,18 18,29 14,18" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
          <circle cx="18" cy="18" r="2.2" fill="currentColor" />
        </svg>
      );
    case 1: // Architecture & Schema
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className="pf-protocol__svg">
          <rect x="11" y="11" width="14" height="14" rx="2" transform="rotate(45 18 18)" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
          <circle cx="18" cy="6" r="2" fill="currentColor" />
          <circle cx="30" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="30" r="2" fill="currentColor" />
          <circle cx="6" cy="18" r="2" fill="currentColor" />
        </svg>
      );
    case 2: // Sprint Build & Demo
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className="pf-protocol__svg">
          <path d="M8 18A10 10 0 1 1 18 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 8A10 10 0 0 1 28 18" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2.5 2.5" />
          <polyline points="14,14 19,18 14,22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default: // Deploy & Handover
      return (
        <svg viewBox="0 0 36 36" fill="none" aria-hidden="true" className="pf-protocol__svg">
          <polygon points="18,5 30,11.5 30,24.5 18,31 6,24.5 6,11.5" stroke="currentColor" strokeWidth="1.4" fill="currentColor" fillOpacity="0.08" />
          <path d="M13.5 18.2L16.8 21.5L23 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
