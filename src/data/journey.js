// ---------------------------------------------------------------------------
// The quote journey — mirrors the live Contractor Commerce flow step-for-step:
//   system_type -> residence_type -> size -> ac_unit_location -> unit_location
//   -> contact -> results
// Edit questions/options here; the step pages render from this data.
// ---------------------------------------------------------------------------

export const STEPS = [
  {
    id: 'system_type',
    path: 'system_type',
    question: "Let's start with what type of system you're interested in today.",
    layout: 'tiles',
    options: [
      { value: 'both',      label: 'Heating + Cooling', icon: 'complete',  hint: 'Gas furnace + AC' },
      { value: 'heating',   label: 'Heating',           icon: 'furnace',   hint: 'Gas furnace only' },
      { value: 'heatpump',  label: 'Heat Pump',         icon: 'heat_pump', hint: 'All-electric heating & cooling' },
      { value: 'cooling',   label: 'Cooling',           icon: 'ac',        hint: 'Air conditioning only' },
    ],
  },
  {
    id: 'residence_type',
    path: 'residence_type',
    question: 'What type of home/residence is it?',
    options: [
      { value: 'single_family', label: 'Single Family Home' },
      { value: 'condo',         label: 'Condo or Townhome' },
      { value: 'apartment',     label: 'Apartment' },
      { value: 'mobile',        label: 'Mobile Home' },
      { value: 'other',         label: 'Other/Not Sure' },
    ],
  },
  {
    id: 'size',
    path: 'size',
    question: "What's the square footage for this system?",
    options: [
      { value: 'small',     label: 'Small (0-1200 sq.ft.)' },
      { value: 'small_mid', label: 'Small-Mid (1200-1500 sq.ft.)' },
      { value: 'medium',    label: 'Medium (1500-1800 sq.ft.)' },
      { value: 'mid_large', label: 'Mid-Large (1800-2400 sq.ft.)' },
      { value: 'large',     label: 'Large (2400+ sq.ft.)' },
    ],
    skip: { label: "I Don't Know", value: 'unknown' },
  },
  {
    id: 'ac_unit_location',
    path: 'ac_unit_location',
    question: 'Where is your AC unit located?',
    // only asked when the job involves an outdoor condenser
    showIf: (a) => ['cooling', 'both', 'heatpump'].includes(a.system_type),
    options: [
      { value: 'backyard', label: 'Backyard' },
      { value: 'adjacent', label: 'Adjacent to home' },
      { value: 'roof',     label: 'Roof' },
    ],
  },
  {
    id: 'unit_location',
    path: 'unit_location',
    question: 'Where is your heating element located?',
    options: [
      { value: 'basement',   label: 'Basement' },
      { value: 'crawlspace', label: 'Crawlspace' },
      { value: 'garage',     label: 'Garage' },
      { value: 'attic',      label: 'Attic' },
      { value: 'closet',     label: 'Closet' },
      { value: 'wall',       label: 'Wall Mounted' },
      { value: 'package',    label: 'Packaged Unit' },
    ],
    skip: { label: "I Don't Know", value: 'unknown' },
  },
]

// Square-footage band -> system size (tons). Edit to re-tune sizing.
export const SIZE_TO_TONS = {
  small: 2.0,      // 0-1200 sq.ft.
  small_mid: 3.0,  // 1200-1500 sq.ft.
  medium: 4.0,     // 1500-1800 sq.ft.
  mid_large: 5.0,  // 1800-2400 sq.ft.
  large: 5.0,      // 2400+ sq.ft.
  unknown: 3.0,
}

// Steps that actually apply, given the answers so far.
export const visibleSteps = (answers) => STEPS.filter((s) => !s.showIf || s.showIf(answers))
