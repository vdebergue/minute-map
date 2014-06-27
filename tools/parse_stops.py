#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv, hashlib, json, sys

if __name__ == '__main__':
  if len(sys.argv) < 2:
    print 'Please give me a CSV file to parse!'
    exit()
  try:
    with open(sys.argv[1], 'r') as csvfile:
      stopsreader = csv.reader(csvfile, delimiter=',', quotechar='"')
      next(stopsreader)
      stops = {}

      for row in stopsreader:
        station_hash = hashlib.sha1(row[2]).hexdigest()
        station_data = stops.get(station_hash, {})
        if not station_data.has_key('name'):
          station_data['name'] = row[2]
          station_data['lon'] = row[5]
          station_data['lat'] = row[4]
          station_data['ids'] = []
        station_data['ids'].append(row[0])
        stops[station_hash] = station_data

      print json.dumps(stops)
  except IOError:
    print 'Oops, failed to find or parse the file...'