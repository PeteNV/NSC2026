import csv

cons = {}
with open('backend/data/electricity_consumption_per_user_by_province.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        prov = row['\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14']
        typ = row['\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e44\u0e1f\u0e1f\u0e49\u0e32']
        kwh = float(row['2565'])
        cons.setdefault(prov, {})[typ] = kwh

users = {}
with open('backend/data/electricity_users_by_province.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        prov = row['\u0e08\u0e31\u0e07\u0e2b\u0e27\u0e31\u0e14']
        typ = row['\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e44\u0e1f\u0e1f\u0e49\u0e32']
        cnt = int(row['2565'])
        users.setdefault(prov, {})[typ] = cnt

th2en = {
    '\u0e1b\u0e17\u0e38\u0e21\u0e18\u0e32\u0e19\u0e35': 'Pathum Thani',
    '\u0e1e\u0e23\u0e30\u0e19\u0e04\u0e23\u0e28\u0e23\u0e35\u0e2d\u0e22\u0e38\u0e18\u0e22\u0e32': 'Phra Nakhon Si Ayutthaya',
    '\u0e2d\u0e48\u0e32\u0e07\u0e17\u0e2d\u0e07': 'Ang Thong',
    '\u0e25\u0e1e\u0e1a\u0e38\u0e23\u0e35': 'Lopburi',
    '\u0e2a\u0e34\u0e07\u0e2b\u0e4c\u0e1a\u0e38\u0e23\u0e35': 'Sing Buri',
    '\u0e0a\u0e31\u0e22\u0e19\u0e32\u0e17': 'Chai Nat',
    '\u0e2a\u0e23\u0e30\u0e1a\u0e38\u0e23\u0e35': 'Saraburi',
    '\u0e0a\u0e25\u0e1a\u0e38\u0e23\u0e35': 'Chonburi',
    '\u0e23\u0e30\u0e22\u0e2d\u0e07': 'Rayong',
    '\u0e08\u0e31\u0e19\u0e17\u0e1a\u0e38\u0e23\u0e35': 'Chanthaburi',
    '\u0e15\u0e23\u0e32\u0e14': 'Trat',
    '\u0e09\u0e30\u0e40\u0e0a\u0e34\u0e07\u0e40\u0e17\u0e23\u0e32': 'Chachoengsao',
    '\u0e1b\u0e23\u0e32\u0e08\u0e35\u0e19\u0e1a\u0e38\u0e23\u0e35': 'Prachinburi',
    '\u0e19\u0e04\u0e23\u0e19\u0e32\u0e22\u0e01': 'Nakhon Nayok',
    '\u0e2a\u0e23\u0e30\u0e41\u0e01\u0e49\u0e27': 'Sa Kaeo',
    '\u0e23\u0e32\u0e0a\u0e1a\u0e38\u0e23\u0e35': 'Ratchaburi',
    '\u0e01\u0e32\u0e0d\u0e08\u0e19\u0e1a\u0e38\u0e23\u0e35': 'Kanchanaburi',
    '\u0e2a\u0e38\u0e1e\u0e23\u0e23\u0e13\u0e1a\u0e38\u0e23\u0e35': 'Suphan Buri',
    '\u0e19\u0e04\u0e23\u0e1b\u0e10\u0e21': 'Nakhon Pathom',
    '\u0e2a\u0e21\u0e38\u0e17\u0e23\u0e2a\u0e32\u0e04\u0e23': 'Samut Sakhon',
    '\u0e2a\u0e21\u0e38\u0e17\u0e23\u0e2a\u0e07\u0e04\u0e23\u0e32\u0e21': 'Samut Songkhram',
    '\u0e40\u0e1e\u0e0a\u0e23\u0e1a\u0e38\u0e23\u0e35': 'Phetchaburi',
    '\u0e1b\u0e23\u0e30\u0e08\u0e27\u0e1a\u0e04\u0e35\u0e23\u0e35\u0e02\u0e31\u0e19\u0e18\u0e4c': 'Prachuap Khiri Khan',
    '\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e43\u0e2b\u0e21\u0e48': 'Chiang Mai',
    '\u0e25\u0e33\u0e1e\u0e39\u0e19': 'Lamphun',
    '\u0e25\u0e33\u0e1b\u0e32\u0e07': 'Lampang',
    '\u0e2d\u0e38\u0e15\u0e23\u0e14\u0e34\u0e15\u0e16\u0e4c': 'Uttaradit',
    '\u0e41\u0e1e\u0e23\u0e48': 'Phrae',
    '\u0e19\u0e48\u0e32\u0e19': 'Nan',
    '\u0e1e\u0e30\u0e40\u0e22\u0e32': 'Phayao',
    '\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e23\u0e32\u0e22': 'Chiang Rai',
    '\u0e41\u0e21\u0e48\u0e2e\u0e48\u0e2d\u0e07\u0e2a\u0e2d\u0e19': 'Mae Hong Son',
    '\u0e19\u0e04\u0e23\u0e2a\u0e27\u0e23\u0e23\u0e04\u0e4c': 'Nakhon Sawan',
    '\u0e2d\u0e38\u0e17\u0e31\u0e22\u0e18\u0e32\u0e19\u0e35': 'Uthai Thani',
    '\u0e01\u0e33\u0e41\u0e1e\u0e07\u0e40\u0e1e\u0e0a\u0e23': 'Kamphaeng Phet',
    '\u0e15\u0e32\u0e01': 'Tak',
    '\u0e2a\u0e38\u0e42\u0e02\u0e17\u0e31\u0e22': 'Sukhothai',
    '\u0e1e\u0e34\u0e29\u0e13\u0e38\u0e42\u0e25\u0e01': 'Phitsanulok',
    '\u0e1e\u0e34\u0e08\u0e34\u0e15\u0e23': 'Phichit',
    '\u0e40\u0e1e\u0e0a\u0e23\u0e1a\u0e39\u0e23\u0e13\u0e4c': 'Phetchabun',
    '\u0e19\u0e04\u0e23\u0e23\u0e32\u0e0a\u0e2a\u0e35\u0e21\u0e32': 'Nakhon Ratchasima',
    '\u0e1a\u0e38\u0e23\u0e35\u0e23\u0e31\u0e21\u0e22\u0e4c': 'Buriram',
    '\u0e2a\u0e38\u0e23\u0e34\u0e19\u0e17\u0e23\u0e4c': 'Surin',
    '\u0e28\u0e23\u0e35\u0e2a\u0e30\u0e40\u0e01\u0e29': 'Sisaket',
    '\u0e2d\u0e38\u0e1a\u0e25\u0e23\u0e32\u0e0a\u0e18\u0e32\u0e19\u0e35': 'Ubon Ratchathani',
    '\u0e22\u0e42\u0e2a\u0e18\u0e23': 'Yasothon',
    '\u0e0a\u0e31\u0e22\u0e20\u0e39\u0e21\u0e34': 'Chaiyaphum',
    '\u0e2d\u0e33\u0e19\u0e32\u0e08\u0e40\u0e08\u0e23\u0e34\u0e0d': 'Amnat Charoen',
    '\u0e1a\u0e36\u0e07\u0e01\u0e32\u0e2c': 'Bueng Kan',
    '\u0e2b\u0e19\u0e2d\u0e07\u0e1a\u0e31\u0e27\u0e25\u0e33\u0e20\u0e39': 'Nong Bua Lamphu',
    '\u0e02\u0e2d\u0e19\u0e41\u0e01\u0e48\u0e19': 'Khon Kaen',
    '\u0e2d\u0e38\u0e14\u0e23\u0e18\u0e32\u0e19\u0e35': 'Udon Thani',
    '\u0e40\u0e25\u0e22': 'Loei',
    '\u0e2b\u0e19\u0e2d\u0e07\u0e04\u0e32\u0e22': 'Nong Khai',
    '\u0e21\u0e2b\u0e32\u0e2a\u0e32\u0e23\u0e04\u0e32\u0e21': 'Maha Sarakham',
    '\u0e23\u0e49\u0e2d\u0e22\u0e40\u0e2d\u0e47\u0e14': 'Roi Et',
    '\u0e01\u0e32\u0e2c\u0e2a\u0e34\u0e19\u0e18\u0e38\u0e4c': 'Kalasin',
    '\u0e2a\u0e01\u0e25\u0e19\u0e04\u0e23': 'Sakon Nakhon',
    '\u0e19\u0e04\u0e23\u0e1e\u0e19\u0e21': 'Nakhon Phanom',
    '\u0e21\u0e38\u0e01\u0e14\u0e32\u0e2b\u0e32\u0e23': 'Mukdahan',
    '\u0e19\u0e04\u0e23\u0e28\u0e23\u0e35\u0e18\u0e23\u0e23\u0e21\u0e23\u0e32\u0e0a': 'Nakhon Si Thammarat',
    '\u0e01\u0e23\u0e30\u0e1a\u0e35\u0e48': 'Krabi',
    '\u0e1e\u0e31\u0e07\u0e07\u0e32': 'Phang Nga',
    '\u0e20\u0e39\u0e40\u0e01\u0e47\u0e15': 'Phuket',
    '\u0e2a\u0e38\u0e23\u0e32\u0e29\u0e0e\u0e23\u0e4c\u0e18\u0e32\u0e19\u0e35': 'Surat Thani',
    '\u0e23\u0e30\u0e19\u0e2d\u0e07': 'Ranong',
    '\u0e0a\u0e38\u0e21\u0e1e\u0e23': 'Chumphon',
    '\u0e2a\u0e07\u0e02\u0e25\u0e32': 'Songkhla',
    '\u0e2a\u0e15\u0e39\u0e25': 'Satun',
    '\u0e15\u0e23\u0e31\u0e07': 'Trang',
    '\u0e1e\u0e31\u0e17\u0e25\u0e38\u0e07': 'Phatthalung',
    '\u0e1b\u0e31\u0e15\u0e15\u0e32\u0e19\u0e35': 'Pattani',
    '\u0e22\u0e30\u0e25\u0e32': 'Yala',
    '\u0e19\u0e23\u0e32\u0e18\u0e34\u0e27\u0e32\u0e2a': 'Narathiwat',
}

HH = 3.0
LOW = '\u0e1a\u0e49\u0e32\u0e19\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22 (\u0e19\u0e49\u0e2d\u0e22\u0e01\u0e27\u0e48\u0e32 150 \u0e01\u0e34\u0e42\u0e25\u0e27\u0e31\u0e15\u0e15\u0e4c-\u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e15\u0e48\u0e2d\u0e40\u0e14\u0e37\u0e2d\u0e19)'
HIGH = '\u0e1a\u0e49\u0e32\u0e19\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22 (150 \u0e41\u0e25\u0e30\u0e21\u0e32\u0e01\u0e01\u0e27\u0e48\u0e32 \u0e01\u0e34\u0e42\u0e25\u0e27\u0e31\u0e15\u0e15\u0e4c-\u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e15\u0e48\u0e2d\u0e40\u0e14\u0e37\u0e2d\u0e19)'

low_pp = {}
high_pp = {}

for th_name in cons:
    if th_name not in th2en:
        continue
    en = th2en[th_name]
    l_kwh = cons[th_name].get(LOW, 0)
    h_kwh = cons[th_name].get(HIGH, 0)
    low_pp[en] = round(l_kwh / 12 / HH, 2)
    high_pp[en] = round(h_kwh / 12 / HH, 2)

print('export const PROVINCIAL_TIER_LOW_PER_PERSON_KWH: Record<string, number> = {')
for name in sorted(low_pp.keys()):
    print(f'  "{name}": {low_pp[name]},')
print('};')
print()
print('export const PROVINCIAL_TIER_HIGH_PER_PERSON_KWH: Record<string, number> = {')
for name in sorted(high_pp.keys()):
    print(f'  "{name}": {high_pp[name]},')
print('};')
