#!/usr/bin/env python

import csv
from datetime import datetime
from proyeksi.models import Klimatologi

CSV_PATH = '../Assets/Data/1985-2021.csv'

with open(CSV_PATH, newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    next(spamreader, None)
    Klimatologi.objects.bulk_create(
        [Klimatologi(**{
            'tanggal': datetime.strptime(row[0], '%Y-%m-%d'),
            'tn': row[1] if row[1] else None,
            'tx': row[2] if row[2] else None,
            'tavg': row[3] if row[3] else None,
            'rh_avg': row[4] if row[4] else None,
            'rr': row[5] if row[5] else None,
            'ss': row[6] if row[6] else None,
            'ff_x': row[7] if row[7] else None,
            'ddd_x': row[8] if row[8] else None,
            'ff_avg': row[9] if row[9] else None,
            'ddd_car': row[10] if row[10] else None
        }) for row in spamreader]
    )
