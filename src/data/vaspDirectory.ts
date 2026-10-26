export type VASPCategory = 'DOMESTIC' | 'OFFSHORE' | 'MIXER' | 'DEFI' | 'UNHOSTED';

export interface CountryFreezingLaws {
  country: 'India' | 'Switzerland' | string;
  countryCode: 'IN' | 'CH' | string;
  countryFlag: string;
  primaryStatute: string;
  regulatoryBody: string;
  keySections: {
    section: string;
    act: string;
    description: string;
    actionableDirectives: string;
  }[];
  stepByStepProtocol: string[];
  executionSLA: string;
  bilateralTreaty: string;
  subpoenaTemplate: {
    title: string;
    legalHeader: string;
    statutoryCitation: string;
    bodyText: string;
  };
}

export const FREEZING_LAWS_BY_COUNTRY: Record<'India' | 'Switzerland', CountryFreezingLaws> = {
  India: {
    country: 'India',
    countryCode: 'IN',
    countryFlag: '🇮🇳',
    primaryStatute: 'Section 102 CrPC / Section 106 BNSS 2023 & Section 12 PMLA 2002',
    regulatoryBody: 'Financial Intelligence Unit - India (FIU-IND) & State Police Cyber Cells',
    keySections: [
      {
        section: 'Section 102 CrPC / Sec 106 BNSS 2023',
        act: 'Code of Criminal Procedure / Bharatiya Nagarik Suraksha Sanhita',
        description: 'Empowers police officers to seize and freeze property alleged or suspected to have been stolen or found under circumstances creating suspicion of commission of any offense.',
        actionableDirectives: 'Directs VASP to immediately freeze debit transactions on internal UID and move suspect crypto to an isolated escrow wallet.',
      },
      {
        section: 'Section 91 CrPC / Sec 94 BNSS 2023',
        act: 'Summons to Produce Documents & Digital Evidence',
        description: 'Authorizes Investigating Officer to requisition full KYC (Aadhaar, PAN, Passport), linked fiat bank accounts, device IP logs, and blockchain withdrawal trails.',
        actionableDirectives: 'Mandatory document production within 24–48 hours upon receipt of official notice.',
      },
      {
        section: 'Section 12 & 12AA PMLA 2002',
        act: 'Prevention of Money Laundering Act',
        description: 'Mandatory reporting entity provisions compelling registered Virtual Digital Asset (VDA) service providers to assist law enforcement and maintain 5-year verifiable audit logs.',
        actionableDirectives: 'Failure to comply constitutes non-compliance penalty under Section 13 PMLA.',
      },
      {
        section: 'Section 69A / 79(3)(b) IT Act 2000',
        act: 'Information Technology Act',
        description: 'Intermediary liability; safe harbour protection is forfeited if exchange fails to expeditiously remove or disable access to illicit cyber fraud assets.',
        actionableDirectives: 'Intermediary must act immediately upon receiving actual knowledge from statutory authorities.',
      },
    ],
    stepByStepProtocol: [
      '1. ISSUE STATUTORY NOTICE: IO drafts Section 102 CrPC Notice citing FIR Number, Police Station, and GD entry.',
      '2. SPECIFY BLOCKCHAIN IDENTIFIERS: Cite destination VASP deposit address, TXID transaction hash, timestamp, and amount in ETH/USDT/INR.',
      '3. DIRECT EMAIL TRANSMISSION: Dispatch notice via official verified police email domain (.gov.in / .nic.in / @uppolice.gov.in) to registered Nodal Officer.',
      '4. RAPID DEBIT-FREEZE: Compliance desk places immediate lien/freeze on the beneficiary account within 24–48 hours.',
      '5. MAGISTRATE SEIZURE REPORT: IO reports seizure of electronic assets to the jurisdictional Magistrate under Section 102(3) CrPC within 48 hours.',
    ],
    executionSLA: 'Mandatory 24–48 Hours (Direct Statutory Requisition)',
    bilateralTreaty: 'Direct Domestic Police Requisition (No Foreign Treaty Required)',
    subpoenaTemplate: {
      title: 'STATUTORY NOTICE TO FREEZE CRYPTO-ASSET UNDER SECTION 102 CrPC / SECTION 106 BNSS 2023',
      legalHeader: 'OFFICE OF THE INVESTIGATING OFFICER, CYBER CRIME POLICE STATION\nTO: NODAL COMPLIANCE OFFICER, FIU-IND REPORTING ENTITY (INDIA)',
      statutoryCitation: 'Sections 102 & 91 of Code of Criminal Procedure, 1973 r/w PMLA 2002',
      bodyText: 'WHEREAS, during the investigation of FIR registered at Cyber Crime Police Station regarding cryptocurrency fraud, it is revealed that proceeds of crime were deposited into your exchange infrastructure at target address. YOU ARE HEREBY ORDERED to immediately FREEZE the target wallet/account, suspend all debit/withdrawal operations, and furnish within 48 hours: 1) Full KYC documents; 2) Linked bank account details; 3) IP access logs with timestamps; 4) Downstream withdrawal addresses.',
    },
  },

  Switzerland: {
    country: 'Switzerland',
    countryCode: 'CH',
    countryFlag: '🇨🇭',
    primaryStatute: 'Swiss Criminal Code (StGB / CP Art. 263/268) & Swiss AMLA (GwG / FINMA)',
    regulatoryBody: 'FINMA (Swiss Financial Market Supervisory Authority), MROS (Fedpol), & Cantonal Public Prosecutor',
    keySections: [
      {
        section: 'Article 263 StGB / CP',
        act: 'Swiss Criminal Code (Schweizerisches Strafgesetzbuch)',
        description: 'Empowers public prosecutors and judicial authorities to seize and freeze assets located within Swiss jurisdiction suspected of being used in or resulting from a criminal offense.',
        actionableDirectives: 'Judicial seizure order (Beschlagnahmeverfügung) binds Swiss banks and crypto custodians to immobilize digital assets.',
      },
      {
        section: 'Article 9 & 10 GwG / AMLA',
        act: 'Swiss Anti-Money Laundering Act (Geldwäschereigesetz)',
        description: 'Imposes immediate statutory obligation on Swiss financial intermediaries to file a suspicious activity report with MROS and place an autonomous 5-day holding freeze.',
        actionableDirectives: 'VASP must freeze assets for up to 5 business days without tipping off the client while MROS investigates.',
      },
      {
        section: 'Articles 18 & 33a IRSG / IMAC',
        act: 'Federal Act on International Mutual Assistance in Criminal Matters',
        description: 'Enables foreign law enforcement agencies to petition Switzerland for urgent provisional asset freezing and documentary evidence transmission before formal trial.',
        actionableDirectives: 'Swiss Federal Office of Justice (FOJ) coordinates with Cantonal Prosecutor for provisional freezing of funds.',
      },
      {
        section: 'FINMA Circular 2019/2',
        act: 'FINMA Regulatory Ordinance on Virtual Asset Service Providers (VASPs)',
        description: 'Mandates strict FATF Travel Rule verification for all virtual asset transfers originating or terminating in Switzerland exceeding CHF 1,000.',
        actionableDirectives: 'Ensures customer identity, beneficial ownership, and counterparty attribution are recorded and auditable.',
      },
    ],
    stepByStepProtocol: [
      '1. EMERGENCY POLICE ALERT: Indian LEA / Interpol NCB New Delhi dispatches an urgent provisional freeze notice to Fedpol (MROS) in Bern.',
      '2. VASP HOLDING FREEZE: Swiss VASP (e.g., Bitcoin Suisse, Sygnum) places a provisional 5-day blocking hold under Article 10 AMLA.',
      '3. CANTONAL SEIZURE ORDER: The Cantonal Public Prosecutor (e.g., Canton of Zug or Zurich) issues an official seizure warrant (Beschlagnahmeverfügung) under Art. 263 StGB.',
      '4. FORMAL MLAT FILING: Ministry of Home Affairs (MHA), India transmits formal Mutual Legal Assistance request to the Swiss Federal Office of Justice (FOJ / BJ).',
      '5. REPATRIATION PROCEEDINGS: Upon conviction, Swiss judicial authority executes asset restitution to the jurisdiction of origin.',
    ],
    executionSLA: 'Provisional Hold: 24–72 Hours · Cantonal Order: 5 Working Days · Formal MLAT: 14–28 Days',
    bilateralTreaty: 'India-Switzerland Mutual Legal Assistance Treaty (MLAT) in Criminal Matters (In Force Since 2011)',
    subpoenaTemplate: {
      title: 'INTERNATIONAL PROVISIONAL ASSET SEIZURE DEMAND (ART. 263 SWISS CRIMINAL CODE & ART. 18 IMAC)',
      legalHeader: 'CENTRAL AUTHORITY (MINISTRY OF HOME AFFAIRS, GOVT. OF INDIA) / INTERPOL NEW DELHI\nTO: FEDERAL OFFICE OF POLICE (FEDPOL / MROS) BERN & CANTONAL PROSECUTOR (SWITZERLAND)',
      statutoryCitation: 'Articles 263 & 268 Swiss StGB r/w Article 18 of IMAC (IRSG)',
      bodyText: 'The Central Authority of India requests urgent provisional preservation and freezing of virtual assets held by Swiss financial intermediary at destination deposit address. The underlying funds constitute proceeds of grand cyber larceny and extortion investigated under Crime Case registered by State Police. Immediate provisional asset restraint is requested pursuant to Article 18 IMAC to prevent dissipation pending formal Mutual Legal Assistance proceedings.',
    },
  },
};

export interface VASPInfo {
  name: string;
  shortName: string;
  category: VASPCategory;
  country: 'India' | 'Switzerland' | 'Offshore' | string;
  countryFlag: string;
  jurisdiction: string;
  fiuRegistered: boolean;
  fiuRegistrationNumber?: string;
  nodalEmail: string;
  lawEnforcementPortal?: string;
  legalProcess: string;
  statutoryDeadline: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  notes: string;
}

export const VASP_DIRECTORY: Record<string, VASPInfo> = {
  'WazirX': {
    name: 'WazirX (Zanmai Labs Pvt Ltd)',
    shortName: 'WazirX',
    category: 'DOMESTIC',
    country: 'India',
    countryFlag: '🇮🇳',
    jurisdiction: 'India (Mumbai / PMLA)',
    fiuRegistered: true,
    fiuRegistrationNumber: 'FIU-IND/RE/2023/VASP-0021',
    nodalEmail: 'legal.compliance@wazirx.com / nodal@zanmai.in',
    legalProcess: 'Direct Section 91 CrPC / Section 94 BNSS Statutory Requisition',
    statutoryDeadline: 'Mandatory 24–48h response under PMLA Sec 12 (Max 7 days)',
    color: '#0284c7',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    notes: 'Domestic FIU-IND Reporting Entity. Obligated to disclose full KYC, Aadhaar/PAN, linked bank accounts, and session IP logs upon receipt of statutory police notice.',
  },
  'CoinDCX': {
    name: 'CoinDCX (Neblio Technologies Pvt Ltd)',
    shortName: 'CoinDCX',
    category: 'DOMESTIC',
    country: 'India',
    countryFlag: '🇮🇳',
    jurisdiction: 'India (Mumbai / PMLA)',
    fiuRegistered: true,
    fiuRegistrationNumber: 'FIU-IND/RE/2023/VASP-0014',
    nodalEmail: 'lawenforcement@coindcx.com',
    legalProcess: 'Direct Section 91 CrPC / Section 94 BNSS Statutory Notice',
    statutoryDeadline: 'Mandatory 24–48h account freeze under Section 102 CrPC',
    color: '#2563eb',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    notes: 'Domestic FIU-IND Reporting Entity. Dedicated 24/7 law enforcement compliance desk for rapid asset freeze and KYC extraction.',
  },
  'CoinSwitch': {
    name: 'CoinSwitch Kuber (Bitcipher Labs LLP)',
    shortName: 'CoinSwitch',
    category: 'DOMESTIC',
    country: 'India',
    countryFlag: '🇮🇳',
    jurisdiction: 'India (Bengaluru / PMLA)',
    fiuRegistered: true,
    fiuRegistrationNumber: 'FIU-IND/RE/2023/VASP-0008',
    nodalEmail: 'lawenforcement@coinswitch.co',
    legalProcess: 'Direct Section 91 CrPC Statutory Notice',
    statutoryDeadline: 'Mandatory 24–48h compliance',
    color: '#10b981',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    notes: 'Domestic FIU-IND Reporting Entity. Compliant with PMLA anti-money laundering monitoring requirements.',
  },
  'ZebPay': {
    name: 'ZebPay (Awlencan Innovations India Ltd)',
    shortName: 'ZebPay',
    category: 'DOMESTIC',
    country: 'India',
    countryFlag: '🇮🇳',
    jurisdiction: 'India (Ahmedabad / PMLA)',
    fiuRegistered: true,
    fiuRegistrationNumber: 'FIU-IND/RE/2023/VASP-0003',
    nodalEmail: 'compliance@zebpay.com',
    legalProcess: 'Direct Section 91 CrPC Statutory Notice',
    statutoryDeadline: '24–48 Hours',
    color: '#f59e0b',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    notes: 'Domestic FIU-IND Registered Exchange. Responds to Sec 102 CrPC orders for rapid asset freezing.',
  },
  'Bitcoin Suisse': {
    name: 'Bitcoin Suisse AG',
    shortName: 'Bitcoin Suisse',
    category: 'OFFSHORE',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    jurisdiction: 'Switzerland (Canton of Zug / FINMA SRO)',
    fiuRegistered: false,
    nodalEmail: 'compliance@bitcoinsuisse.com / lawenforcement@bitcoinsuisse.com',
    legalProcess: 'Swiss Criminal Code Art. 263 Seizure Order / MLAT via Fedpol & Swiss FOJ',
    statutoryDeadline: '24–72h emergency hold; 5-day MROS statutory freeze',
    color: '#dc2626',
    badgeBg: '#fef2f2',
    badgeBorder: '#fecaca',
    badgeText: '#991b1b',
    notes: 'Premier Swiss digital asset broker based in Crypto Valley (Zug). Governed by Swiss AMLA (GwG) and supervised under FINMA framework. Requires Cantonal Prosecutor order or MLAT for permanent seizure.',
  },
  'Sygnum Bank': {
    name: 'Sygnum Bank AG',
    shortName: 'Sygnum Bank',
    category: 'OFFSHORE',
    country: 'Switzerland',
    countryFlag: '🇨🇭',
    jurisdiction: 'Switzerland (Zurich / FINMA Licensed Digital Asset Bank)',
    fiuRegistered: false,
    nodalEmail: 'legal@sygnum.com / lawenforcement@sygnum.com',
    legalProcess: 'Swiss Banking Act / Swiss CP Art. 263 / IMAC Article 18',
    statutoryDeadline: '24–48h banking hold upon MROS/Cantonal notification',
    color: '#dc2626',
    badgeBg: '#fef2f2',
    badgeBorder: '#fecaca',
    badgeText: '#991b1b',
    notes: 'World’s first digital asset bank, fully licensed by FINMA in Switzerland. Complies with Swiss Criminal Code Art. 263 freezing orders upon MROS/Prosecutor transmission.',
  },
  'Binance': {
    name: 'Binance (Binance Holdings Ltd)',
    shortName: 'Binance',
    category: 'OFFSHORE',
    country: 'Cayman Islands / Global',
    countryFlag: '🌐',
    jurisdiction: 'Offshore (Cayman Islands / Seychelles)',
    fiuRegistered: true,
    fiuRegistrationNumber: 'FIU-IND/RE/2024/VASP-0048 (Registered 2024)',
    nodalEmail: 'case@binance.com / lawenforcement@binance.com',
    lawEnforcementPortal: 'https://www.binance.com/en/support/law-enforcement',
    legalProcess: 'Binance Law Enforcement Request System (LERS) + Section 91 CrPC Notice',
    statutoryDeadline: '5–14 Working Days via Verified Gov Email (.gov.in / .nic.in)',
    color: '#f59e0b',
    badgeBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    notes: 'Offshore Exchange with FIU-IND registration status. Requests must be submitted through verified official police domain onto the Binance LERS portal.',
  },
  'OKX': {
    name: 'OKX (Aux Cayes FinTech Co.)',
    shortName: 'OKX',
    category: 'OFFSHORE',
    country: 'Seychelles / Bahamas',
    countryFlag: '🌐',
    jurisdiction: 'Offshore (Seychelles)',
    fiuRegistered: false,
    nodalEmail: 'lawenforcement@okx.com',
    lawEnforcementPortal: 'https://www.okx.com/law-enforcement',
    legalProcess: 'International LERS Portal / MLAT via Ministry of Home Affairs (MHA)',
    statutoryDeadline: '14–30 Days (Subject to International Treaties)',
    color: '#6366f1',
    badgeBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    notes: 'Offshore Unregistered Entity. Domestic CrPC notices are non-binding; requires MLAT or official law enforcement portal subpoena.',
  },
  'Bybit': {
    name: 'Bybit Fintech Ltd',
    shortName: 'Bybit',
    category: 'OFFSHORE',
    country: 'UAE (Dubai)',
    countryFlag: '🇦🇪',
    jurisdiction: 'Offshore (Dubai / BVI)',
    fiuRegistered: false,
    nodalEmail: 'compliance@bybit.com',
    legalProcess: 'Bybit LE Portal / Letters Rogatory',
    statutoryDeadline: '14–30 Days',
    color: '#f97316',
    badgeBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    notes: 'Offshore Exchange operating from UAE jurisdiction.',
  },
  'Coinbase': {
    name: 'Coinbase Inc.',
    shortName: 'Coinbase',
    category: 'OFFSHORE',
    country: 'United States',
    countryFlag: '🇺🇸',
    jurisdiction: 'United States (FinCEN / SEC Regulated)',
    fiuRegistered: false,
    nodalEmail: 'lawenforcement@coinbase.com',
    legalProcess: 'Coinbase LERS Portal / US-India Mutual Legal Assistance Treaty (MLAT)',
    statutoryDeadline: '21–30 Days via US Department of Justice (DOJ)',
    color: '#0284c7',
    badgeBg: '#eff6ff',
    badgeBorder: '#bfdbfe',
    badgeText: '#1d4ed8',
    notes: 'US-regulated custodial exchange. Responds to official government emails through the Coinbase Law Enforcement Request Portal.',
  },
  'Tornado Cash': {
    name: 'Tornado Cash Smart Contracts',
    shortName: 'Tornado Cash',
    category: 'MIXER',
    country: 'Decentralized',
    countryFlag: '⚠️',
    jurisdiction: 'Decentralized Protocol (OFAC Sanctioned)',
    fiuRegistered: false,
    nodalEmail: 'N/A (No Centralized Operator)',
    legalProcess: 'On-Chain Address Blacklisting & FIU-IND Advisory',
    statutoryDeadline: 'Immediate On-Chain Blacklist Alert',
    color: '#ef4444',
    badgeBg: '#fef2f2',
    badgeBorder: '#fecaca',
    badgeText: '#b91c1c',
    notes: 'Cryptographic privacy mixer. No legal entity or KYC registry exists. Tainted outputs should be flagged to all domestic Indian exchanges for freeze on deposit.',
  },
  'Unhosted / Private Relays': {
    name: 'Unhosted External Self-Custody Wallets',
    shortName: 'Unhosted Relays',
    category: 'UNHOSTED',
    country: 'Peer-to-Peer',
    countryFlag: '🛡️',
    jurisdiction: 'Non-Custodial / Self-Hosted',
    fiuRegistered: false,
    nodalEmail: 'N/A (Private Key Holder)',
    legalProcess: 'Continuous Node Watch & Off-Ramp Interception',
    statutoryDeadline: 'Real-Time Node Monitoring',
    color: '#64748b',
    badgeBg: '#f8fafc',
    badgeBorder: '#e2e8f0',
    badgeText: '#475569',
    notes: 'Funds are held in non-custodial external wallets. Continuous monitoring required to detect eventual sweeping into domestic or offshore centralized exchanges.',
  },
};

/**
 * Resolves full VASP metadata and country from string name
 */
export function getVASPInfo(vaspString: string): VASPInfo {
  const lower = vaspString.toLowerCase();
  for (const [key, info] of Object.entries(VASP_DIRECTORY)) {
    if (lower.includes(key.toLowerCase()) || lower.includes(info.shortName.toLowerCase())) {
      return info;
    }
  }

  // Swiss fallbacks
  if (lower.includes('suisse') || lower.includes('sygnum') || lower.includes('swiss') || lower.includes('zug')) {
    return VASP_DIRECTORY['Bitcoin Suisse'];
  }

  // Domestic vs mixer vs fallback
  if (lower.includes('mixer') || lower.includes('tornado')) {
    return VASP_DIRECTORY['Tornado Cash'];
  }
  if (lower.includes('unhosted') || lower.includes('private')) {
    return VASP_DIRECTORY['Unhosted / Private Relays'];
  }
  if (lower.includes('binance')) {
    return VASP_DIRECTORY['Binance'];
  }
  if (lower.includes('wazirx')) {
    return VASP_DIRECTORY['WazirX'];
  }
  if (lower.includes('coindcx')) {
    return VASP_DIRECTORY['CoinDCX'];
  }
  if (lower.includes('coinswitch')) {
    return VASP_DIRECTORY['CoinSwitch'];
  }
  if (lower.includes('zebpay')) {
    return VASP_DIRECTORY['ZebPay'];
  }

  const isDomestic = lower.includes('india') || lower.includes('zanmai') || lower.includes('neblio');
  return {
    name: vaspString,
    shortName: vaspString.split(' ')[0],
    category: isDomestic ? 'DOMESTIC' : 'OFFSHORE',
    country: isDomestic ? 'India' : 'International',
    countryFlag: isDomestic ? '🇮🇳' : '🌐',
    jurisdiction: isDomestic ? 'India (PMLA Jurisdiction)' : 'Offshore Jurisdiction',
    fiuRegistered: isDomestic,
    fiuRegistrationNumber: isDomestic ? 'FIU-IND/RE/2023/VASP-VERIFIED' : undefined,
    nodalEmail: `lawenforcement@${vaspString.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    legalProcess: isDomestic ? 'Section 91 CrPC / Section 94 BNSS Direct Requisition' : 'International LE Portal / MLAT',
    statutoryDeadline: isDomestic ? '24–48h statutory deadline' : '14–30 Days via bilateral channel',
    color: '#2563eb',
    badgeBg: isDomestic ? '#f0fdf4' : '#eff6ff',
    badgeBorder: isDomestic ? '#bbf7d0' : '#bfdbfe',
    badgeText: isDomestic ? '#15803d' : '#1d4ed8',
    notes: isDomestic
      ? 'Domestic VASP under PMLA 2002 reporting obligations.'
      : 'Offshore exchange infrastructure requiring international compliance routing.',
  };
}

/**
 * Returns specific statutory freezing laws for a country (India or Switzerland)
 */
export function getCountryFreezingLaws(countryOrVasp: string): CountryFreezingLaws {
  const lower = countryOrVasp.toLowerCase();
  if (lower.includes('switz') || lower.includes('swiss') || lower.includes('zug') || lower.includes('suisse') || lower.includes('sygnum')) {
    return FREEZING_LAWS_BY_COUNTRY.Switzerland;
  }
  // Default to India
  return FREEZING_LAWS_BY_COUNTRY.India;
}
