#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv, hashlib, json, sys, string
from datetime import datetime
from operator import itemgetter

def service_to_dates():
  try:
    with open(sys.argv[1] + '/calendar_dates.csv', 'r') as csvfile:
      reader = csv.reader(csvfile, delimiter=',', quotechar='"')
      next(reader)
      services = {}

      for row in reader:
        if not services.has_key(row[0]):
          services[row[0]] = []

        services[row[0]].append(row[1])

      for k, v in services.iteritems():
        v.sort()

      return services
  except IOError:
    print 'Failed to parse calendar_dates.csv'
    return {}

def trip_to_service():
  try:
    with open(sys.argv[1] + '/trips.csv', 'r') as csvfile:
      reader = csv.reader(csvfile, delimiter=',', quotechar='"')
      next(reader)
      trips = {}

      for row in reader:
        trips[row[2]] = row[1]

      return trips
  except IOError:
    print 'Failed to parse trips.csv'
    return {}

def trip_to_dates(services, trips):
  timedtrips = {}

  for k, v in trips.iteritems():
    timedtrips[k] = services[v]

  return timedtrips

if __name__ == '__main__':
  if len(sys.argv) < 2:
    print 'Please give me a CSV file to parse!'
    exit()

  trips_dates = trip_to_dates(service_to_dates(), trip_to_service())
  stops = {}
  FMT = '%H:%M:%S'

  try:
    with open(sys.argv[1] + '/stop_times.csv', 'r') as csvfile:
      stopsreader = csv.reader(csvfile, delimiter=',', quotechar='"')
      next(stopsreader)

      for row in stopsreader:
        stop_id = row[3]
        if not stops.has_key(stop_id):
          stops[stop_id] = { 'times': [] }

        if row[1].startswith('24:'):
          row[1] = string.replace(row[1], '24:', '00:')

        for date in trips_dates[row[0]]:
          stops[stop_id]['times'].append(date[0:4] + '-' + date[4:6] + '-' + date[6:8] + ' ' + row[1])

    for k, v in stops.iteritems():
      v['times'] = list(set(v['times']))
      v['times'].sort()
      v['count'] = len(v['times'])
  except IOError:
    print 'Oops, failed to find or parse the file...'

  print json.dumps(stops, indent=4)
