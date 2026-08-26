// Line-style icons (inherit currentColor, stroke 1.6). Editable in one place.
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

function base(props, children) {
  const { size = 24, ...rest } = props
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...S} {...rest}>
      {children}
    </svg>
  )
}

// ---- System-type icons ----
// Paired condenser (fan) + furnace (flame) — a complete system is both. Kept
// deliberately in the same visual language as IconAC/IconFurnace below, not
// a chat-bubble-shaped box with text lines (an earlier version read that way).
export const IconComplete = (p) => base(p, <>
  <rect x="2.5" y="4" width="9.5" height="9.5" rx="1.5" />
  <circle cx="7.25" cy="8.75" r="2.6" /><path d="M7.25 6.15v5.2M4.65 8.75h5.2" />
  <rect x="12.5" y="10.5" width="9" height="9.5" rx="1.5" />
  <path d="M17 13.2c1.05.75 1.2 1.7.6 2.5-.4.55-1.25.7-1.25 1.5 0 .65.5 1 .5 1-1.35-.15-2.25-1.1-2.25-2.3 0-1.4 1.25-1.8 2.4-2.7Z" />
</>)

export const IconAC = (p) => base(p, <>
  <rect x="3" y="5" width="18" height="9" rx="1.5" /><path d="M5 8h14M5 10.5h14" />
  <path d="M7 17c0 1.2-1 1.4-1 2.5M12 17c0 1.2-1 1.4-1 2.5M17 17c0 1.2-1 1.4-1 2.5" />
</>)

export const IconHeatPump = (p) => base(p, <>
  <rect x="3.5" y="6" width="17" height="12" rx="1.5" />
  <circle cx="12" cy="12" r="3.4" /><path d="M12 8.6v6.8M8.6 12h6.8" />
  <path d="M5.5 7.5v9" />
</>)

export const IconFurnace = (p) => base(p, <>
  <rect x="6" y="3.5" width="12" height="17" rx="1.5" /><path d="M6 8h12" />
  <path d="M12 11.5c1.4 1 1.6 2.3.8 3.4-.5.7-1.7.9-1.7 2 0 .9.7 1.4.7 1.4-1.8-.2-3-1.5-3-3.1 0-1.9 1.7-2.4 3.2-3.7Z" />
</>)

export const IconMiniSplit = (p) => base(p, <>
  <rect x="3" y="5" width="12" height="5" rx="1.2" /><path d="M4.5 7.2h9" />
  <path d="M15 12c1.5.6 3 .6 4.5 0M15.5 15c1.5.6 2.7.6 4 0M16 18c1.2.5 2.2.5 3.4 0" />
</>)

export const IconPackage = (p) => base(p, <>
  <rect x="3" y="7" width="18" height="11" rx="1.5" /><path d="M3 11h18" />
  <path d="M6 9.2h3M15 14.5h3M11 14.5h1.5" /><circle cx="7.5" cy="14.5" r="1.4" />
</>)

export const SYSTEM_ICONS = {
  complete: IconComplete,
  ac: IconAC,
  heat_pump: IconHeatPump,
  furnace: IconFurnace,
  mini_split: IconMiniSplit,
  package: IconPackage,
}

// ---- UI icons ----
export const IconCheck = (p) => base(p, <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />)
export const IconArrowRight = (p) => base(p, <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>)
export const IconArrowLeft = (p) => base(p, <><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></>)
export const IconCart = (p) => base(p, <><circle cx="9" cy="20" r="1.3" /><circle cx="18" cy="20" r="1.3" /><path d="M2.5 3h2.2l2.3 12.2a1 1 0 0 0 1 .8h8.3a1 1 0 0 0 1-.8L20.5 7H6" /></>)
export const IconUser = (p) => base(p, <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>)
export const IconSearch = (p) => base(p, <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>)
export const IconPhone = (p) => base(p, <path d="M6.5 3.5c1 0 1.6.6 1.9 1.6l.7 2.3a2 2 0 0 1-.5 2L7.5 10.5a12 12 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2-.5l2.3.7c1 .3 1.6.9 1.6 1.9V20a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 8 2 2 0 0 1 6.5 3.5Z" />)
export const IconShield = (p) => base(p, <><path d="M12 3l7 2.5v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10v-5Z" /><path d="M9 12l2 2 4-4" /></>)
export const IconTruck = (p) => base(p, <><path d="M2.5 6.5h10v9h-10z" /><path d="M12.5 9.5H17l3 3v3h-7.5" /><circle cx="6.5" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>)
export const IconStar = (p) => base(p, <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.9 19.6l1-5.8-4.2-4.1 5.8-.8Z" />)
export const IconBolt = (p) => base(p, <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8Z" />)
export const IconLeaf = (p) => base(p, <><path d="M20 4C10 4 5 9 5 16c0 2 .6 3.5.6 3.5S8 12 20 8c0 0-7 1.5-10.5 8" /></>)
export const IconClock = (p) => base(p, <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>)
