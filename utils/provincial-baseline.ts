const THAI_AVG_HOUSEHOLD_SIZE = 3.0;

export const PROVINCIAL_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 99.64,
  "Ang Thong": 196.43,
  "Bueng Kan": 115.34,
  "Buriram": 125.35,
  "Chachoengsao": 249.76,
  "Chai Nat": 162.35,
  "Chaiyaphum": 110.0,
  "Chanthaburi": 209.25,
  "Chiang Mai": 162.8,
  "Chiang Rai": 122.84,
  "Chonburi": 273.26,
  "Chumphon": 167.66,
  "Kalasin": 114.3,
  "Kamphaeng Phet": 158.52,
  "Kanchanaburi": 193.0,
  "Khon Kaen": 147.54,
  "Krabi": 189.92,
  "Lampang": 116.63,
  "Lamphun": 121.7,
  "Loei": 118.08,
  "Lopburi": 185.89,
  "Mae Hong Son": 90.14,
  "Maha Sarakham": 114.48,
  "Mukdahan": 113.77,
  "Nakhon Nayok": 209.41,
  "Nakhon Pathom": 282.44,
  "Nakhon Phanom": 106.51,
  "Nakhon Ratchasima": 160.12,
  "Nakhon Sawan": 170.0,
  "Nakhon Si Thammarat": 153.08,
  "Nan": 102.18,
  "Narathiwat": 116.06,
  "Nong Bua Lamphu": 105.05,
  "Nong Khai": 141.7,
  "Pathum Thani": 306.52,
  "Pattani": 120.47,
  "Phang Nga": 179.38,
  "Phatthalung": 136.53,
  "Phayao": 102.66,
  "Phetchabun": 134.08,
  "Phetchaburi": 178.11,
  "Phichit": 162.4,
  "Phitsanulok": 180.25,
  "Phra Nakhon Si Ayutthaya": 260.68,
  "Phrae": 119.69,
  "Phuket": 310.13,
  "Prachinburi": 198.89,
  "Prachuap Khiri Khan": 200.95,
  "Ranong": 162.71,
  "Ratchaburi": 221.06,
  "Rayong": 222.53,
  "Roi Et": 114.09,
  "Sa Kaeo": 156.54,
  "Sakon Nakhon": 106.42,
  "Samut Sakhon": 291.91,
  "Samut Songkhram": 224.27,
  "Saraburi": 242.51,
  "Satun": 136.93,
  "Sing Buri": 187.16,
  "Sisaket": 95.52,
  "Songkhla": 180.61,
  "Sukhothai": 142.42,
  "Suphan Buri": 206.01,
  "Surat Thani": 186.81,
  "Surin": 118.16,
  "Tak": 148.32,
  "Trang": 161.95,
  "Trat": 200.11,
  "Ubon Ratchathani": 112.76,
  "Udon Thani": 139.04,
  "Uthai Thani": 153.29,
  "Uttaradit": 140.58,
  "Yala": 118.77,
  "Yasothon": 104.02,
};

export const PROVINCIAL_PER_PERSON_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 33.21,
  "Ang Thong": 65.48,
  "Bueng Kan": 38.45,
  "Buriram": 41.78,
  "Chachoengsao": 83.25,
  "Chai Nat": 54.12,
  "Chaiyaphum": 36.67,
  "Chanthaburi": 69.75,
  "Chiang Mai": 54.27,
  "Chiang Rai": 40.95,
  "Chonburi": 91.09,
  "Chumphon": 55.89,
  "Kalasin": 38.1,
  "Kamphaeng Phet": 52.84,
  "Kanchanaburi": 64.33,
  "Khon Kaen": 49.18,
  "Krabi": 63.31,
  "Lampang": 38.88,
  "Lamphun": 40.57,
  "Loei": 39.36,
  "Lopburi": 61.96,
  "Mae Hong Son": 30.05,
  "Maha Sarakham": 38.16,
  "Mukdahan": 37.92,
  "Nakhon Nayok": 69.8,
  "Nakhon Pathom": 94.15,
  "Nakhon Phanom": 35.5,
  "Nakhon Ratchasima": 53.37,
  "Nakhon Sawan": 56.67,
  "Nakhon Si Thammarat": 51.03,
  "Nan": 34.06,
  "Narathiwat": 38.69,
  "Nong Bua Lamphu": 35.02,
  "Nong Khai": 47.23,
  "Pathum Thani": 102.17,
  "Pattani": 40.16,
  "Phang Nga": 59.79,
  "Phatthalung": 45.51,
  "Phayao": 34.22,
  "Phetchabun": 44.69,
  "Phetchaburi": 59.37,
  "Phichit": 54.13,
  "Phitsanulok": 60.08,
  "Phra Nakhon Si Ayutthaya": 86.89,
  "Phrae": 39.9,
  "Phuket": 103.38,
  "Prachinburi": 66.3,
  "Prachuap Khiri Khan": 66.98,
  "Ranong": 54.24,
  "Ratchaburi": 73.69,
  "Rayong": 74.18,
  "Roi Et": 38.03,
  "Sa Kaeo": 52.18,
  "Sakon Nakhon": 35.47,
  "Samut Sakhon": 97.3,
  "Samut Songkhram": 74.76,
  "Saraburi": 80.84,
  "Satun": 45.64,
  "Sing Buri": 62.39,
  "Sisaket": 31.84,
  "Songkhla": 60.2,
  "Sukhothai": 47.47,
  "Suphan Buri": 68.67,
  "Surat Thani": 62.27,
  "Surin": 39.39,
  "Tak": 49.44,
  "Trang": 53.98,
  "Trat": 66.7,
  "Ubon Ratchathani": 37.59,
  "Udon Thani": 46.35,
  "Uthai Thani": 51.1,
  "Uttaradit": 46.86,
  "Yala": 39.59,
  "Yasothon": 34.67,
};

export const PROVINCIAL_TIER_LOW_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 60.56,
  "Ang Thong": 69.22,
  "Bueng Kan": 67.26,
  "Buriram": 70.15,
  "Chachoengsao": 70.0,
  "Chai Nat": 68.96,
  "Chaiyaphum": 62.35,
  "Chanthaburi": 63.2,
  "Chiang Mai": 55.82,
  "Chiang Rai": 62.03,
  "Chonburi": 68.41,
  "Chumphon": 72.3,
  "Kalasin": 64.9,
  "Kamphaeng Phet": 71.92,
  "Kanchanaburi": 69.14,
  "Khon Kaen": 66.17,
  "Krabi": 73.63,
  "Lampang": 57.04,
  "Lamphun": 52.47,
  "Loei": 65.41,
  "Lopburi": 68.23,
  "Mae Hong Son": 53.31,
  "Maha Sarakham": 63.71,
  "Mukdahan": 62.83,
  "Nakhon Nayok": 69.73,
  "Nakhon Pathom": 69.48,
  "Nakhon Phanom": 59.9,
  "Nakhon Ratchasima": 69.88,
  "Nakhon Sawan": 69.11,
  "Nakhon Si Thammarat": 69.69,
  "Nan": 58.12,
  "Narathiwat": 68.2,
  "Nong Bua Lamphu": 62.43,
  "Nong Khai": 67.42,
  "Pathum Thani": 69.23,
  "Pattani": 67.62,
  "Phang Nga": 72.65,
  "Phatthalung": 70.05,
  "Phayao": 59.26,
  "Phetchabun": 67.11,
  "Phetchaburi": 63.15,
  "Phichit": 70.64,
  "Phitsanulok": 68.05,
  "Phra Nakhon Si Ayutthaya": 76.47,
  "Phrae": 62.19,
  "Phuket": 60.65,
  "Prachinburi": 68.73,
  "Prachuap Khiri Khan": 70.08,
  "Ranong": 74.01,
  "Ratchaburi": 72.18,
  "Rayong": 64.31,
  "Roi Et": 63.66,
  "Sa Kaeo": 67.71,
  "Sakon Nakhon": 59.62,
  "Samut Sakhon": 68.83,
  "Samut Songkhram": 66.11,
  "Saraburi": 70.9,
  "Satun": 70.91,
  "Sing Buri": 70.53,
  "Sisaket": 58.43,
  "Songkhla": 70.92,
  "Sukhothai": 70.86,
  "Suphan Buri": 74.23,
  "Surat Thani": 69.9,
  "Surin": 68.24,
  "Tak": 65.93,
  "Trang": 76.01,
  "Trat": 66.44,
  "Ubon Ratchathani": 58.21,
  "Udon Thani": 66.45,
  "Uthai Thani": 70.12,
  "Uttaradit": 64.24,
  "Yala": 64.02,
  "Yasothon": 59.53,
};

export const PROVINCIAL_TIER_HIGH_MONTHLY_KWH: Record<string, number> = {
  "Amnat Charoen": 205.8,
  "Ang Thong": 290.17,
  "Bueng Kan": 216.04,
  "Buriram": 227.69,
  "Chachoengsao": 332.34,
  "Chai Nat": 258.74,
  "Chaiyaphum": 216.1,
  "Chanthaburi": 302.43,
  "Chiang Mai": 254.89,
  "Chiang Rai": 219.78,
  "Chonburi": 321.54,
  "Chumphon": 252.05,
  "Kalasin": 219.77,
  "Kamphaeng Phet": 252.09,
  "Kanchanaburi": 286.47,
  "Khon Kaen": 250.02,
  "Krabi": 290.66,
  "Lampang": 220.44,
  "Lamphun": 220.94,
  "Loei": 218.66,
  "Lopburi": 279.22,
  "Mae Hong Son": 186.48,
  "Maha Sarakham": 220.1,
  "Mukdahan": 214.78,
  "Nakhon Nayok": 288.26,
  "Nakhon Pathom": 366.62,
  "Nakhon Phanom": 216.87,
  "Nakhon Ratchasima": 251.07,
  "Nakhon Sawan": 264.89,
  "Nakhon Si Thammarat": 253.08,
  "Nan": 210.68,
  "Narathiwat": 230.82,
  "Nong Bua Lamphu": 214.52,
  "Nong Khai": 243.67,
  "Pathum Thani": 353.37,
  "Pattani": 236.99,
  "Phang Nga": 276.64,
  "Phatthalung": 238.51,
  "Phayao": 199.76,
  "Phetchabun": 237.57,
  "Phetchaburi": 265.26,
  "Phichit": 247.9,
  "Phitsanulok": 271.95,
  "Phra Nakhon Si Ayutthaya": 329.14,
  "Phrae": 219.0,
  "Phuket": 387.0,
  "Prachinburi": 278.32,
  "Prachuap Khiri Khan": 275.53,
  "Ranong": 275.3,
  "Ratchaburi": 309.83,
  "Rayong": 307.2,
  "Roi Et": 219.6,
  "Sa Kaeo": 262.18,
  "Sakon Nakhon": 215.05,
  "Samut Sakhon": 381.04,
  "Samut Songkhram": 329.68,
  "Saraburi": 321.8,
  "Satun": 238.9,
  "Sing Buri": 272.16,
  "Sisaket": 217.57,
  "Songkhla": 265.62,
  "Sukhothai": 238.92,
  "Suphan Buri": 299.17,
  "Surat Thani": 285.09,
  "Surin": 220.49,
  "Tak": 255.76,
  "Trang": 256.45,
  "Trat": 302.51,
  "Ubon Ratchathani": 233.37,
  "Udon Thani": 241.32,
  "Uthai Thani": 263.49,
  "Uttaradit": 251.47,
  "Yala": 233.18,
  "Yasothon": 207.72,
};

export const PROVINCIAL_HIGH_TIER_PCT: Record<string, number> = {
  "Amnat Charoen": 26.9,
  "Ang Thong": 57.6,
  "Bueng Kan": 32.3,
  "Buriram": 35.0,
  "Chachoengsao": 68.5,
  "Chai Nat": 49.2,
  "Chaiyaphum": 31.0,
  "Chanthaburi": 61.0,
  "Chiang Mai": 53.7,
  "Chiang Rai": 38.5,
  "Chonburi": 80.9,
  "Chumphon": 53.0,
  "Kalasin": 31.9,
  "Kamphaeng Phet": 48.1,
  "Kanchanaburi": 57.0,
  "Khon Kaen": 44.3,
  "Krabi": 53.6,
  "Lampang": 36.5,
  "Lamphun": 41.1,
  "Loei": 34.4,
  "Lopburi": 55.8,
  "Mae Hong Son": 27.7,
  "Maha Sarakham": 32.5,
  "Mukdahan": 33.5,
  "Nakhon Nayok": 63.9,
  "Nakhon Pathom": 71.7,
  "Nakhon Phanom": 29.7,
  "Nakhon Ratchasima": 49.8,
  "Nakhon Sawan": 51.5,
  "Nakhon Si Thammarat": 45.5,
  "Nan": 28.9,
  "Narathiwat": 29.4,
  "Nong Bua Lamphu": 28.0,
  "Nong Khai": 42.1,
  "Pathum Thani": 83.5,
  "Pattani": 31.2,
  "Phang Nga": 52.3,
  "Phatthalung": 39.5,
  "Phayao": 30.9,
  "Phetchabun": 39.3,
  "Phetchaburi": 56.9,
  "Phichit": 51.8,
  "Phitsanulok": 55.0,
  "Phra Nakhon Si Ayutthaya": 72.9,
  "Phrae": 36.7,
  "Phuket": 76.4,
  "Prachinburi": 62.1,
  "Prachuap Khiri Khan": 63.7,
  "Ranong": 44.1,
  "Ratchaburi": 62.6,
  "Rayong": 65.1,
  "Roi Et": 32.3,
  "Sa Kaeo": 45.7,
  "Sakon Nakhon": 30.1,
  "Samut Sakhon": 71.5,
  "Samut Songkhram": 60.0,
  "Saraburi": 68.4,
  "Satun": 39.3,
  "Sing Buri": 57.8,
  "Sisaket": 23.3,
  "Songkhla": 56.3,
  "Sukhothai": 42.6,
  "Suphan Buri": 58.6,
  "Surat Thani": 54.3,
  "Surin": 32.8,
  "Tak": 43.4,
  "Trang": 47.6,
  "Trat": 56.6,
  "Ubon Ratchathani": 31.1,
  "Udon Thani": 41.5,
  "Uthai Thani": 43.0,
  "Uttaradit": 40.8,
  "Yala": 32.4,
  "Yasothon": 30.0,
};

export const PROVINCIAL_TIER_LOW_PER_PERSON_KWH: Record<string, number> = {
  "Amnat Charoen": 20.19,
  "Ang Thong": 23.07,
  "Bueng Kan": 22.42,
  "Buriram": 23.38,
  "Chachoengsao": 23.33,
  "Chai Nat": 22.99,
  "Chaiyaphum": 20.79,
  "Chanthaburi": 21.07,
  "Chiang Mai": 18.61,
  "Chiang Rai": 20.68,
  "Chonburi": 22.8,
  "Chumphon": 24.1,
  "Kalasin": 21.63,
  "Kamphaeng Phet": 23.97,
  "Kanchanaburi": 23.05,
  "Khon Kaen": 22.06,
  "Krabi": 24.54,
  "Lampang": 19.01,
  "Lamphun": 17.49,
  "Loei": 21.8,
  "Lopburi": 22.74,
  "Mae Hong Son": 17.77,
  "Maha Sarakham": 21.24,
  "Mukdahan": 20.94,
  "Nakhon Nayok": 23.24,
  "Nakhon Pathom": 23.16,
  "Nakhon Phanom": 19.97,
  "Nakhon Ratchasima": 23.29,
  "Nakhon Sawan": 23.04,
  "Nakhon Si Thammarat": 23.23,
  "Nan": 19.37,
  "Narathiwat": 22.73,
  "Nong Bua Lamphu": 20.81,
  "Nong Khai": 22.47,
  "Pathum Thani": 23.08,
  "Pattani": 22.54,
  "Phang Nga": 24.22,
  "Phatthalung": 23.35,
  "Phayao": 19.75,
  "Phetchabun": 22.37,
  "Phetchaburi": 21.05,
  "Phichit": 23.55,
  "Phitsanulok": 22.68,
  "Phra Nakhon Si Ayutthaya": 25.49,
  "Phrae": 20.73,
  "Phuket": 20.21,
  "Prachinburi": 22.91,
  "Prachuap Khiri Khan": 23.36,
  "Ranong": 24.67,
  "Ratchaburi": 24.06,
  "Rayong": 21.44,
  "Roi Et": 21.22,
  "Sa Kaeo": 22.57,
  "Sakon Nakhon": 19.87,
  "Samut Sakhon": 22.94,
  "Samut Songkhram": 22.04,
  "Saraburi": 23.63,
  "Satun": 23.64,
  "Sing Buri": 23.51,
  "Sisaket": 19.48,
  "Songkhla": 23.64,
  "Sukhothai": 23.62,
  "Suphan Buri": 24.74,
  "Surat Thani": 23.3,
  "Surin": 22.75,
  "Tak": 21.98,
  "Trang": 25.34,
  "Trat": 22.15,
  "Ubon Ratchathani": 19.4,
  "Udon Thani": 22.15,
  "Uthai Thani": 23.37,
  "Uttaradit": 21.41,
  "Yala": 21.34,
  "Yasothon": 19.84,
};

export const PROVINCIAL_TIER_HIGH_PER_PERSON_KWH: Record<string, number> = {
  "Amnat Charoen": 68.6,
  "Ang Thong": 96.72,
  "Bueng Kan": 72.01,
  "Buriram": 75.9,
  "Chachoengsao": 110.78,
  "Chai Nat": 86.25,
  "Chaiyaphum": 72.03,
  "Chanthaburi": 100.81,
  "Chiang Mai": 84.96,
  "Chiang Rai": 73.26,
  "Chonburi": 107.18,
  "Chumphon": 84.02,
  "Kalasin": 73.26,
  "Kamphaeng Phet": 84.03,
  "Kanchanaburi": 95.49,
  "Khon Kaen": 83.34,
  "Krabi": 96.89,
  "Lampang": 73.48,
  "Lamphun": 73.65,
  "Loei": 72.89,
  "Lopburi": 93.07,
  "Mae Hong Son": 62.16,
  "Maha Sarakham": 73.37,
  "Mukdahan": 71.59,
  "Nakhon Nayok": 96.09,
  "Nakhon Pathom": 122.21,
  "Nakhon Phanom": 72.29,
  "Nakhon Ratchasima": 83.69,
  "Nakhon Sawan": 88.3,
  "Nakhon Si Thammarat": 84.36,
  "Nan": 70.23,
  "Narathiwat": 76.94,
  "Nong Bua Lamphu": 71.51,
  "Nong Khai": 81.22,
  "Pathum Thani": 117.79,
  "Pattani": 79.0,
  "Phang Nga": 92.21,
  "Phatthalung": 79.5,
  "Phayao": 66.59,
  "Phetchabun": 79.19,
  "Phetchaburi": 88.42,
  "Phichit": 82.63,
  "Phitsanulok": 90.65,
  "Phra Nakhon Si Ayutthaya": 109.71,
  "Phrae": 73.0,
  "Phuket": 129.0,
  "Prachinburi": 92.77,
  "Prachuap Khiri Khan": 91.84,
  "Ranong": 91.77,
  "Ratchaburi": 103.28,
  "Rayong": 102.4,
  "Roi Et": 73.2,
  "Sa Kaeo": 87.39,
  "Sakon Nakhon": 71.68,
  "Samut Sakhon": 127.01,
  "Samut Songkhram": 109.89,
  "Saraburi": 107.27,
  "Satun": 79.63,
  "Sing Buri": 90.72,
  "Sisaket": 72.52,
  "Songkhla": 88.54,
  "Sukhothai": 79.64,
  "Suphan Buri": 99.72,
  "Surat Thani": 95.03,
  "Surin": 73.5,
  "Tak": 85.25,
  "Trang": 85.48,
  "Trat": 100.84,
  "Ubon Ratchathani": 77.79,
  "Udon Thani": 80.44,
  "Uthai Thani": 87.83,
  "Uttaradit": 83.82,
  "Yala": 77.73,
  "Yasothon": 69.24,
};

const NATIONAL_AVG_KWH = 166.88;
const NATIONAL_AVG_PER_PERSON_KWH = NATIONAL_AVG_KWH / THAI_AVG_HOUSEHOLD_SIZE;
const TIER_CUTOFF_KWH = 150;

function fallbackNumber<T>(record: Record<string, T>, key: string, fallback: T): T {
  return key in record ? record[key] : fallback;
}

export function provinceBaselineKwh(
  province: string,
  householdSize: number,
): number {
  const raw = fallbackNumber(PROVINCIAL_MONTHLY_KWH, province, NATIONAL_AVG_KWH);
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
  const highPct = fallbackNumber(PROVINCIAL_HIGH_TIER_PCT, province, 100);

  const tierKwh = isHighTier
    ? fallbackNumber(PROVINCIAL_TIER_HIGH_MONTHLY_KWH, province, 300)
    : fallbackNumber(PROVINCIAL_TIER_LOW_MONTHLY_KWH, province, 70);

  const scale = householdSize / THAI_AVG_HOUSEHOLD_SIZE;
  const scaledTierKwh = Math.round(tierKwh * scale * 100) / 100;

  const deltaKwh = userMonthlyKwh - scaledTierKwh;
  const deltaPct =
    scaledTierKwh > 0 ? Math.round((deltaKwh / scaledTierKwh) * 100) : 0;

  const tierLabel = isHighTier
    ? `Top ${highPct}% of ${province}`
    : `Bottom ${100 - highPct}% of ${province}`;

  const label =
    deltaPct > 0
      ? `${deltaPct}% above ${tier === "high" ? "high-usage" : "low-usage"} peers`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below ${tier === "high" ? "high-usage" : "low-usage"} peers`
        : `On par with ${tier === "high" ? "high-usage" : "low-usage"} peers`;

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
  const userPerPerson = userMonthlyKwh / householdSize;

  const baseline = isHighTier
    ? fallbackNumber(PROVINCIAL_TIER_HIGH_PER_PERSON_KWH, province, 80)
    : fallbackNumber(PROVINCIAL_TIER_LOW_PER_PERSON_KWH, province, 20);

  const deltaKwh = userPerPerson - baseline;
  const deltaPct =
    baseline > 0 ? Math.round((deltaKwh / baseline) * 100) : 0;

  const tierLabel = isHighTier ? "high-usage" : "low-usage";
  const label =
    deltaPct > 0
      ? `${deltaPct}% above ${tierLabel} per-person avg`
      : deltaPct < 0
        ? `${Math.abs(deltaPct)}% below ${tierLabel} per-person avg`
        : `On par with ${tierLabel} per-person avg`;

  return { baselineKwh: baseline, deltaKwh, deltaPct, label };
}
