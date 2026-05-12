// ─── Shared ───────────────────────────────────────────────────
export interface Dasha {
  pl: string;
  yrs: number;
  start: string;
  end: string;
  isCurrent: boolean;
}

// ─── Kundali Milan ────────────────────────────────────────────
export interface KundaliCard {
  rashi: string; rshort: string; nak: string; pada: number;
  nlord: string; rlord: string; sunR: string; marR: string;
  varna: string; lagnaRashi: string; gana: string; nadi: string;
  yoni: string; ygen: string; moonLon: number;
  city: string; tz: number; dashas: Dasha[];
}

export interface KootaRow {
  key: string; name: string; sub: string; max: number;
  boyVal: string; girlVal: string; score: number;
}

export interface Dosha {
  name: string; ico: string; cls: string; bdg: string;
  lbl: string; desc: string;
}

export interface KundaliMilanResult {
  boyName: string; girlName: string;
  boy: KundaliCard; girl: KundaliCard;
  kootas: Record<string, number>;
  kootaRows: KootaRow[];
  total: number;
  verdict: string; verdictClass: string;
  doshas: Dosha[]; remedies: string[];
  boyBG?: string; girlBG?: string;
}

export interface KundaliMilanInput {
  boyName: string; girlName: string;
  boyDOB: string; girlDOB: string;
  boyTOB: string; girlTOB: string;
  boyTZ: string;  girlTZ: string;
  boyCity: string; girlCity: string;
  boyBG?: string; girlBG?: string;
}

// ─── Bhavishya ────────────────────────────────────────────────
export interface LifeArea {
  icon: string; key: string; title: string;
  score: number; str: 'strong' | 'caution' | 'weak'; text: string;
}

export interface Recommendation {
  icon: string; cat: string; val: string; desc: string;
}

export interface PersonalRemedies {
  mantras: string[]; donations: string[]; temples: string[];
  spiritual: string[]; behavioral: string[];
}

export interface GuidanceItem { ico: string; text: string; }

export interface PlanetInfo {
  key: string; name: string; symbol: string;
  rashi: string; rashiFull: string; rashiSym: string;
  degree: number; house: number;
}

export interface BhavaCell {
  house: number; rashi: string; planets: string[];
}

export interface BhavaDasha {
  pct: number;
  mahaLabel: string; mahaStart: string; mahaEnd: string; mahaYrs: number;
  antarLabel: string|null; antarStart: string|null; antarEnd: string|null; antarYrs: string|null;
}

export interface DashaEffect { mahaDesc: string; antarDesc: string; }

export interface BhavishyaDosha {
  name: string; ico: string; present: boolean; partial: boolean; desc: string;
}

export interface ZodiacEntry {
  key: string; name: string; rashi: string; rashiFull: string; rashiSym: string; lon: number;
}

export interface BhavishyaResult {
  name: string; gender: string; dob: string; city: string;
  moonRashi: string; moonRashiShort: string;
  lagnaRashi: string; lagnaRashiShort: string;
  nakshatra: string; maha: string; antar: string;
  dashas: Dasha[];
  dashaProgress: BhavaDasha | null;
  dashaEffect: DashaEffect;
  lifeAreas: LifeArea[];
  doshas: BhavishyaDosha[];
  recs: Recommendation[];
  remedies: PersonalRemedies;
  guidance: { daily: GuidanceItem[]; weekly: GuidanceItem[]; monthly: GuidanceItem[]; };
  bhavaData: { planetGrid: PlanetInfo[]; bhavaCells: (BhavaCell|null)[]; lagnaRashi: string; personName: string; };
  zodiacStrip: ZodiacEntry[];
}

export interface BhavishyaInput {
  name: string; gender: string; dob: string;
  tob: string; tz: string; city: string;
}

// ─── Medical ──────────────────────────────────────────────────
export interface MedCondition {
  icon: string; title: string; severity: string;
  badge: string; badgeCls: string; cardCls: string;
  text: string; action: string; rhWarning: boolean;
}

export interface BloodTest {
  priority: string; priorityLabel: string; who: string;
  name: string; why: string; note: string;
}

export interface MedicalResult {
  analysis: { conditions: MedCondition[]; overallRisk: string; boyBG: string; girlBG: string; };
  tests: BloodTest[];
}

// ─── API wrapper ──────────────────────────────────────────────
export interface ApiResponse<T> { success: boolean; data: T; }
