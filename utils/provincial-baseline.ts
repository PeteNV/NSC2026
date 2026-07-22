const THAI_AVG_HOUSEHOLD_SIZE = 2.5;

export const PROVINCIAL_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 99.64,
  Bangkok: 579.23,
  "Ang Thong": 196.43,
  "Bueng Kan": 115.34,
  Buriram: 125.35,
  Chachoengsao: 249.76,
  "Chai Nat": 162.35,
  Chaiyaphum: 110.0,
  Chanthaburi: 209.25,
  "Chiang Mai": 162.8,
  "Chiang Rai": 122.84,
  Chonburi: 273.26,
  Chumphon: 167.66,
  Kalasin: 114.3,
  "Kamphaeng Phet": 158.52,
  Kanchanaburi: 193.0,
  "Khon Kaen": 147.54,
  Krabi: 189.92,
  Lampang: 116.63,
  Lamphun: 121.7,
  Loei: 118.08,
  Lopburi: 185.89,
  "Mae Hong Son": 90.14,
  "Maha Sarakham": 114.48,
  Mukdahan: 113.77,
  "Nakhon Nayok": 209.41,
  "Nakhon Pathom": 282.44,
  "Nakhon Phanom": 106.51,
  "Nakhon Ratchasima": 160.12,
  "Nakhon Sawan": 170.0,
  "Nakhon Si Thammarat": 153.08,
  Nan: 102.18,
  Narathiwat: 116.06,
  "Nong Bua Lamphu": 105.05,
  "Nong Khai": 141.7,
  "Pathum Thani": 306.52,
  Pattani: 120.47,
  "Phang Nga": 179.38,
  Phatthalung: 136.53,
  Phayao: 102.66,
  Phetchabun: 134.08,
  Phetchaburi: 178.11,
  Phichit: 162.4,
  Phitsanulok: 180.25,
  "Phra Nakhon Si Ayutthaya": 260.68,
  Phrae: 119.69,
  Phuket: 310.13,
  Prachinburi: 198.89,
  "Prachuap Khiri Khan": 200.95,
  Ranong: 162.71,
  Ratchaburi: 221.06,
  Rayong: 222.53,
  "Roi Et": 114.09,
  "Sa Kaeo": 156.54,
  "Sakon Nakhon": 106.42,
  "Samut Sakhon": 291.91,
  "Samut Songkhram": 224.27,
  Saraburi: 242.51,
  Satun: 136.93,
  "Sing Buri": 187.16,
  Sisaket: 95.52,
  Songkhla: 180.61,
  Sukhothai: 142.42,
  "Suphan Buri": 206.01,
  "Surat Thani": 186.81,
  Surin: 118.16,
  Tak: 148.32,
  Trang: 161.95,
  Trat: 200.11,
  "Ubon Ratchathani": 112.76,
  "Udon Thani": 139.04,
  "Uthai Thani": 153.29,
  Uttaradit: 140.58,
  Yala: 118.77,
  Yasothon: 104.02,
};

export const PROVINCIAL_PER_PERSON_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 39.85,
  Bangkok: 231.69,
  "Ang Thong": 78.57,
  "Bueng Kan": 46.14,
  "Buriram": 50.14,
  "Chachoengsao": 99.91,
  "Chai Nat": 64.94,
  "Chaiyaphum": 44.0,
  "Chanthaburi": 83.7,
  "Chiang Mai": 65.12,
  "Chiang Rai": 49.14,
  "Chonburi": 109.3,
  "Chumphon": 67.06,
  "Kalasin": 45.72,
  "Kamphaeng Phet": 63.41,
  "Kanchanaburi": 77.2,
  "Khon Kaen": 59.01,
  "Krabi": 75.97,
  "Lampang": 46.65,
  "Lamphun": 48.68,
  "Loei": 47.23,
  "Lopburi": 74.36,
  "Mae Hong Son": 36.05,
  "Maha Sarakham": 45.79,
  "Mukdahan": 45.51,
  "Nakhon Nayok": 83.76,
  "Nakhon Pathom": 112.98,
  "Nakhon Phanom": 42.6,
  "Nakhon Ratchasima": 64.05,
  "Nakhon Sawan": 68.0,
  "Nakhon Si Thammarat": 61.23,
  "Nan": 40.87,
  "Narathiwat": 46.42,
  "Nong Bua Lamphu": 42.02,
  "Nong Khai": 56.68,
  "Pathum Thani": 122.61,
  "Pattani": 48.19,
  "Phang Nga": 71.75,
  "Phatthalung": 54.61,
  "Phayao": 41.07,
  "Phetchabun": 53.63,
  "Phetchaburi": 71.25,
  "Phichit": 64.96,
  "Phitsanulok": 72.1,
  "Phra Nakhon Si Ayutthaya": 104.27,
  "Phrae": 47.88,
  "Phuket": 124.05,
  "Prachinburi": 79.55,
  "Prachuap Khiri Khan": 80.38,
  "Ranong": 65.08,
  "Ratchaburi": 88.42,
  "Rayong": 89.01,
  "Roi Et": 45.64,
  "Sa Kaeo": 62.62,
  "Sakon Nakhon": 42.57,
  "Samut Sakhon": 116.77,
  "Samut Songkhram": 89.71,
  "Saraburi": 97.01,
  "Satun": 54.77,
  "Sing Buri": 74.86,
  "Sisaket": 38.21,
  "Songkhla": 72.24,
  "Sukhothai": 56.97,
  "Suphan Buri": 82.41,
  "Surat Thani": 74.73,
  "Surin": 47.26,
  "Tak": 59.33,
  "Trang": 64.78,
  "Trat": 80.04,
  "Ubon Ratchathani": 45.1,
  "Udon Thani": 55.62,
  "Uthai Thani": 61.32,
  "Uttaradit": 56.23,
  "Yala": 47.51,
  "Yasothon": 41.61,
};

export const PROVINCIAL_TIER_LOW_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 60.56,
  "Ang Thong": 69.22,
  "Bueng Kan": 67.26,
  Buriram: 70.15,
  Chachoengsao: 70.0,
  "Chai Nat": 68.96,
  Chaiyaphum: 62.35,
  Chanthaburi: 63.2,
  "Chiang Mai": 55.82,
  "Chiang Rai": 62.03,
  Chonburi: 68.41,
  Chumphon: 72.3,
  Kalasin: 64.9,
  "Kamphaeng Phet": 71.92,
  Kanchanaburi: 69.14,
  "Khon Kaen": 66.17,
  Krabi: 73.63,
  Lampang: 57.04,
  Lamphun: 52.47,
  Loei: 65.41,
  Lopburi: 68.23,
  "Mae Hong Son": 53.31,
  "Maha Sarakham": 63.71,
  Mukdahan: 62.83,
  "Nakhon Nayok": 69.73,
  "Nakhon Pathom": 69.48,
  "Nakhon Phanom": 59.9,
  "Nakhon Ratchasima": 69.88,
  "Nakhon Sawan": 69.11,
  "Nakhon Si Thammarat": 69.69,
  Nan: 58.12,
  Narathiwat: 68.2,
  "Nong Bua Lamphu": 62.43,
  "Nong Khai": 67.42,
  "Pathum Thani": 69.23,
  Pattani: 67.62,
  "Phang Nga": 72.65,
  Phatthalung: 70.05,
  Phayao: 59.26,
  Phetchabun: 67.11,
  Phetchaburi: 63.15,
  Phichit: 70.64,
  Phitsanulok: 68.05,
  "Phra Nakhon Si Ayutthaya": 76.47,
  Phrae: 62.19,
  Phuket: 60.65,
  Prachinburi: 68.73,
  "Prachuap Khiri Khan": 70.08,
  Ranong: 74.01,
  Ratchaburi: 72.18,
  Rayong: 64.31,
  "Roi Et": 63.66,
  "Sa Kaeo": 67.71,
  "Sakon Nakhon": 59.62,
  "Samut Sakhon": 68.83,
  "Samut Songkhram": 66.11,
  Saraburi: 70.9,
  Satun: 70.91,
  "Sing Buri": 70.53,
  Sisaket: 58.43,
  Songkhla: 70.92,
  Sukhothai: 70.86,
  "Suphan Buri": 74.23,
  "Surat Thani": 69.9,
  Surin: 68.24,
  Tak: 65.93,
  Trang: 76.01,
  Trat: 66.44,
  "Ubon Ratchathani": 58.21,
  "Udon Thani": 66.45,
  "Uthai Thani": 70.12,
  Uttaradit: 64.24,
  Yala: 64.02,
  Yasothon: 59.53,
};

export const PROVINCIAL_TIER_HIGH_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 205.8,
  "Ang Thong": 290.17,
  "Bueng Kan": 216.04,
  Buriram: 227.69,
  Chachoengsao: 332.34,
  "Chai Nat": 258.74,
  Chaiyaphum: 216.1,
  Chanthaburi: 302.43,
  "Chiang Mai": 254.89,
  "Chiang Rai": 219.78,
  Chonburi: 321.54,
  Chumphon: 252.05,
  Kalasin: 219.77,
  "Kamphaeng Phet": 252.09,
  Kanchanaburi: 286.47,
  "Khon Kaen": 250.02,
  Krabi: 290.66,
  Lampang: 220.44,
  Lamphun: 220.94,
  Loei: 218.66,
  Lopburi: 279.22,
  "Mae Hong Son": 186.48,
  "Maha Sarakham": 220.1,
  Mukdahan: 214.78,
  "Nakhon Nayok": 288.26,
  "Nakhon Pathom": 366.62,
  "Nakhon Phanom": 216.87,
  "Nakhon Ratchasima": 251.07,
  "Nakhon Sawan": 264.89,
  "Nakhon Si Thammarat": 253.08,
  Nan: 210.68,
  Narathiwat: 230.82,
  "Nong Bua Lamphu": 214.52,
  "Nong Khai": 243.67,
  "Pathum Thani": 353.37,
  Pattani: 236.99,
  "Phang Nga": 276.64,
  Phatthalung: 238.51,
  Phayao: 199.76,
  Phetchabun: 237.57,
  Phetchaburi: 265.26,
  Phichit: 247.9,
  Phitsanulok: 271.95,
  "Phra Nakhon Si Ayutthaya": 329.14,
  Phrae: 219.0,
  Phuket: 387.0,
  Prachinburi: 278.32,
  "Prachuap Khiri Khan": 275.53,
  Ranong: 275.3,
  Ratchaburi: 309.83,
  Rayong: 307.2,
  "Roi Et": 219.6,
  "Sa Kaeo": 262.18,
  "Sakon Nakhon": 215.05,
  "Samut Sakhon": 381.04,
  "Samut Songkhram": 329.68,
  Saraburi: 321.8,
  Satun: 238.9,
  "Sing Buri": 272.16,
  Sisaket: 217.57,
  Songkhla: 265.62,
  Sukhothai: 238.92,
  "Suphan Buri": 299.17,
  "Surat Thani": 285.09,
  Surin: 220.49,
  Tak: 255.76,
  Trang: 256.45,
  Trat: 302.51,
  "Ubon Ratchathani": 233.37,
  "Udon Thani": 241.32,
  "Uthai Thani": 263.49,
  Uttaradit: 251.47,
  Yala: 233.18,
  Yasothon: 207.72,
};

export const PROVINCIAL_HIGH_TIER_PCT: Record<string, number> = {
  "Amnat Charoen": 26.9,
  "Ang Thong": 57.6,
  "Bueng Kan": 32.3,
  Buriram: 35.0,
  Chachoengsao: 68.5,
  "Chai Nat": 49.2,
  Chaiyaphum: 31.0,
  Chanthaburi: 61.0,
  "Chiang Mai": 53.7,
  "Chiang Rai": 38.5,
  Chonburi: 80.9,
  Chumphon: 53.0,
  Kalasin: 31.9,
  "Kamphaeng Phet": 48.1,
  Kanchanaburi: 57.0,
  "Khon Kaen": 44.3,
  Krabi: 53.6,
  Lampang: 36.5,
  Lamphun: 41.1,
  Loei: 34.4,
  Lopburi: 55.8,
  "Mae Hong Son": 27.7,
  "Maha Sarakham": 32.5,
  Mukdahan: 33.5,
  "Nakhon Nayok": 63.9,
  "Nakhon Pathom": 71.7,
  "Nakhon Phanom": 29.7,
  "Nakhon Ratchasima": 49.8,
  "Nakhon Sawan": 51.5,
  "Nakhon Si Thammarat": 45.5,
  Nan: 28.9,
  Narathiwat: 29.4,
  "Nong Bua Lamphu": 28.0,
  "Nong Khai": 42.1,
  "Pathum Thani": 83.5,
  Pattani: 31.2,
  "Phang Nga": 52.3,
  Phatthalung: 39.5,
  Phayao: 30.9,
  Phetchabun: 39.3,
  Phetchaburi: 56.9,
  Phichit: 51.8,
  Phitsanulok: 55.0,
  "Phra Nakhon Si Ayutthaya": 72.9,
  Phrae: 36.7,
  Phuket: 76.4,
  Prachinburi: 62.1,
  "Prachuap Khiri Khan": 63.7,
  Ranong: 44.1,
  Ratchaburi: 62.6,
  Rayong: 65.1,
  "Roi Et": 32.3,
  "Sa Kaeo": 45.7,
  "Sakon Nakhon": 30.1,
  "Samut Sakhon": 71.5,
  "Samut Songkhram": 60.0,
  Saraburi: 68.4,
  Satun: 39.3,
  "Sing Buri": 57.8,
  Sisaket: 23.3,
  Songkhla: 56.3,
  Sukhothai: 42.6,
  "Suphan Buri": 58.6,
  "Surat Thani": 54.3,
  Surin: 32.8,
  Tak: 43.4,
  Trang: 47.6,
  Trat: 56.6,
  "Ubon Ratchathani": 31.1,
  "Udon Thani": 41.5,
  "Uthai Thani": 43.0,
  Uttaradit: 40.8,
  Yala: 32.4,
  Yasothon: 30.0,
};

export const PROVINCIAL_TIER_LOW_PER_PERSON_KWH: Record<string, number> = {
  "Amnat Charoen": 24.23,
  "Ang Thong": 27.69,
  "Bueng Kan": 26.9,
  "Buriram": 28.06,
  "Chachoengsao": 28.0,
  "Chai Nat": 27.58,
  "Chaiyaphum": 24.94,
  "Chanthaburi": 25.28,
  "Chiang Mai": 22.33,
  "Chiang Rai": 24.81,
  "Chonburi": 27.36,
  "Chumphon": 28.92,
  "Kalasin": 25.96,
  "Kamphaeng Phet": 28.77,
  "Kanchanaburi": 27.65,
  "Khon Kaen": 26.47,
  "Krabi": 29.45,
  "Lampang": 22.82,
  "Lamphun": 20.99,
  "Loei": 26.17,
  "Lopburi": 27.29,
  "Mae Hong Son": 21.32,
  "Maha Sarakham": 25.48,
  "Mukdahan": 25.13,
  "Nakhon Nayok": 27.89,
  "Nakhon Pathom": 27.79,
  "Nakhon Phanom": 23.96,
  "Nakhon Ratchasima": 27.95,
  "Nakhon Sawan": 27.64,
  "Nakhon Si Thammarat": 27.87,
  "Nan": 23.25,
  "Narathiwat": 27.28,
  "Nong Bua Lamphu": 24.97,
  "Nong Khai": 26.97,
  "Pathum Thani": 27.69,
  "Pattani": 27.05,
  "Phang Nga": 29.06,
  "Phatthalung": 28.02,
  "Phayao": 23.7,
  "Phetchabun": 26.84,
  "Phetchaburi": 25.26,
  "Phichit": 28.26,
  "Phitsanulok": 27.22,
  "Phra Nakhon Si Ayutthaya": 30.59,
  "Phrae": 24.88,
  "Phuket": 24.26,
  "Prachinburi": 27.49,
  "Prachuap Khiri Khan": 28.03,
  "Ranong": 29.6,
  "Ratchaburi": 28.87,
  "Rayong": 25.72,
  "Roi Et": 25.46,
  "Sa Kaeo": 27.08,
  "Sakon Nakhon": 23.85,
  "Samut Sakhon": 27.53,
  "Samut Songkhram": 26.45,
  "Saraburi": 28.36,
  "Satun": 28.37,
  "Sing Buri": 28.21,
  "Sisaket": 23.37,
  "Songkhla": 28.37,
  "Sukhothai": 28.35,
  "Suphan Buri": 29.69,
  "Surat Thani": 27.96,
  "Surin": 27.29,
  "Tak": 26.37,
  "Trang": 30.4,
  "Trat": 26.58,
  "Ubon Ratchathani": 23.28,
  "Udon Thani": 26.58,
  "Uthai Thani": 28.05,
  "Uttaradit": 25.7,
  "Yala": 25.61,
  "Yasothon": 23.81,
};

export const PROVINCIAL_TIER_HIGH_PER_PERSON_KWH: Record<string, number> = {
  "Amnat Charoen": 82.32,
  "Ang Thong": 116.07,
  "Bueng Kan": 86.41,
  "Buriram": 91.08,
  "Chachoengsao": 132.94,
  "Chai Nat": 103.49,
  "Chaiyaphum": 86.44,
  "Chanthaburi": 120.97,
  "Chiang Mai": 101.95,
  "Chiang Rai": 87.91,
  "Chonburi": 128.61,
  "Chumphon": 100.82,
  "Kalasin": 87.91,
  "Kamphaeng Phet": 100.83,
  "Kanchanaburi": 114.59,
  "Khon Kaen": 100.01,
  "Krabi": 116.26,
  "Lampang": 88.18,
  "Lamphun": 88.38,
  "Loei": 87.46,
  "Lopburi": 111.69,
  "Mae Hong Son": 74.59,
  "Maha Sarakham": 88.04,
  "Mukdahan": 85.91,
  "Nakhon Nayok": 115.3,
  "Nakhon Pathom": 146.65,
  "Nakhon Phanom": 86.75,
  "Nakhon Ratchasima": 100.43,
  "Nakhon Sawan": 105.96,
  "Nakhon Si Thammarat": 101.23,
  "Nan": 84.27,
  "Narathiwat": 92.33,
  "Nong Bua Lamphu": 85.81,
  "Nong Khai": 97.47,
  "Pathum Thani": 141.35,
  "Pattani": 94.8,
  "Phang Nga": 110.66,
  "Phatthalung": 95.4,
  "Phayao": 79.9,
  "Phetchabun": 95.03,
  "Phetchaburi": 106.1,
  "Phichit": 99.16,
  "Phitsanulok": 108.78,
  "Phra Nakhon Si Ayutthaya": 131.66,
  "Phrae": 87.6,
  "Phuket": 154.8,
  "Prachinburi": 111.33,
  "Prachuap Khiri Khan": 110.21,
  "Ranong": 110.12,
  "Ratchaburi": 123.93,
  "Rayong": 122.88,
  "Roi Et": 87.84,
  "Sa Kaeo": 104.87,
  "Sakon Nakhon": 86.02,
  "Samut Sakhon": 152.42,
  "Samut Songkhram": 131.87,
  "Saraburi": 128.72,
  "Satun": 95.56,
  "Sing Buri": 108.86,
  "Sisaket": 87.03,
  "Songkhla": 106.25,
  "Sukhothai": 95.57,
  "Suphan Buri": 119.67,
  "Surat Thani": 114.03,
  "Surin": 88.19,
  "Tak": 102.3,
  "Trang": 102.58,
  "Trat": 121.0,
  "Ubon Ratchathani": 93.35,
  "Udon Thani": 96.53,
  "Uthai Thani": 105.4,
  "Uttaradit": 100.59,
  "Yala": 93.27,
  "Yasothon": 83.09,
};

const NATIONAL_AVG_KWH = 166.88;
const NATIONAL_AVG_PER_PERSON_KWH = NATIONAL_AVG_KWH / THAI_AVG_HOUSEHOLD_SIZE;
const TIER_CUTOFF_KWH = 150;

function fallbackNumber<T>(
  record: Record<string, T>,
  key: string,
  fallback: T,
): T {
  return key in record ? record[key] : fallback;
}

export function provinceBaselineKwh(
  province: string,
  householdSize: number,
): number {
  const raw = fallbackNumber(
    PROVINCIAL_MONTHLY_KWH,
    province,
    NATIONAL_AVG_KWH,
  );
  const scale = householdSize / THAI_AVG_HOUSEHOLD_SIZE;
  return Math.round(raw * scale * 100) / 100;
}

export function provinceComparison(
  userMonthlyKwh: number,
  province: string,
  householdSize: number,
): {
  baselineKwh: number;
  deltaKwh: number;
  deltaPct: number;
  label: string;
} {
  const baselineKwh = provinceBaselineKwh(province, householdSize);
  const deltaKwh = userMonthlyKwh - baselineKwh;
  const deltaPct =
    baselineKwh > 0 ? Math.round((deltaKwh / baselineKwh) * 100) : 0;
  const label =
    deltaPct > 0
      ? `${deltaPct}% above provincial average`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below provincial average`
        : "On par with provincial average";

  return { baselineKwh, deltaKwh, deltaPct, label };
}

export function provincePerPersonComparison(
  userMonthlyKwh: number,
  province: string,
  householdSize: number,
): {
  baselineKwh: number;
  deltaKwh: number;
  deltaPct: number;
  label: string;
} {
  const userPerPerson = userMonthlyKwh / householdSize;
  const baselinePerPerson = fallbackNumber(
    PROVINCIAL_PER_PERSON_MONTHLY_KWH,
    province,
    NATIONAL_AVG_PER_PERSON_KWH,
  );
  const deltaKwh = userPerPerson - baselinePerPerson;
  const deltaPct =
    baselinePerPerson > 0
      ? Math.round((deltaKwh / baselinePerPerson) * 100)
      : 0;
  const label =
    deltaPct > 0
      ? `${deltaPct}% above per-person avg`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below per-person avg`
        : "On par with per-person avg";

  return { baselineKwh: baselinePerPerson, deltaKwh, deltaPct, label };
}

export function provinceTierComparison(
  userMonthlyKwh: number,
  province: string,
  householdSize: number,
): {
  tier: "low" | "high";
  tierLabel: string;
  tierKwh: number;
  scaledTierKwh: number;
  highTierPct: number;
  deltaKwh: number;
  deltaPct: number;
  label: string;
} {
  const isHighTier = userMonthlyKwh >= TIER_CUTOFF_KWH;
  const tier = isHighTier ? "high" : "low";
  const hasTierData = province in PROVINCIAL_HIGH_TIER_PCT;
  const highPct = hasTierData
    ? PROVINCIAL_HIGH_TIER_PCT[province]
    : 100;

  const tierKwh = hasTierData
    ? isHighTier
      ? fallbackNumber(PROVINCIAL_TIER_HIGH_MONTHLY_KWH, province, 300)
      : fallbackNumber(PROVINCIAL_TIER_LOW_MONTHLY_KWH, province, 70)
    : fallbackNumber(PROVINCIAL_MONTHLY_KWH, province, NATIONAL_AVG_KWH);

  const scale = householdSize / THAI_AVG_HOUSEHOLD_SIZE;
  const scaledTierKwh = Math.round(tierKwh * scale * 100) / 100;

  const deltaKwh = userMonthlyKwh - scaledTierKwh;
  const deltaPct =
    scaledTierKwh > 0 ? Math.round((deltaKwh / scaledTierKwh) * 100) : 0;

  const tierLabel = hasTierData
    ? isHighTier
      ? `Top ${highPct}% of ${province}`
      : `Bottom ${100 - highPct}% of ${province}`
    : `${province}`;

  const peerLabel = hasTierData
    ? tier === "high"
      ? "high-usage peers"
      : "low-usage peers"
    : "provincial average";

  const label =
    deltaPct > 0
      ? `${deltaPct}% above ${peerLabel}`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below ${peerLabel}`
        : `On par with ${peerLabel}`;

  return {
    tier,
    tierLabel,
    tierKwh,
    scaledTierKwh,
    highTierPct: highPct,
    deltaKwh,
    deltaPct,
    label,
  };
}

export function provinceTierPerPersonComparison(
  userMonthlyKwh: number,
  province: string,
  householdSize: number,
): {
  baselineKwh: number;
  deltaKwh: number;
  deltaPct: number;
  label: string;
} {
  const isHighTier = userMonthlyKwh >= TIER_CUTOFF_KWH;
  const hasTierData = province in PROVINCIAL_HIGH_TIER_PCT;
  const userPerPerson = userMonthlyKwh / householdSize;

  const baseline = hasTierData
    ? isHighTier
      ? fallbackNumber(PROVINCIAL_TIER_HIGH_PER_PERSON_KWH, province, 80)
      : fallbackNumber(PROVINCIAL_TIER_LOW_PER_PERSON_KWH, province, 20)
    : fallbackNumber(
        PROVINCIAL_PER_PERSON_MONTHLY_KWH,
        province,
        NATIONAL_AVG_PER_PERSON_KWH,
      );

  const deltaKwh = userPerPerson - baseline;
  const deltaPct = baseline > 0 ? Math.round((deltaKwh / baseline) * 100) : 0;

  const peerLabel = hasTierData
    ? isHighTier
      ? "high-usage"
      : "low-usage"
    : "provincial";
  const label =
    deltaPct > 0
      ? `${deltaPct}% above ${peerLabel} per-person avg`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below ${peerLabel} per-person avg`
        : `On par with ${peerLabel} per-person avg`;

  return { baselineKwh: baseline, deltaKwh, deltaPct, label };
}
