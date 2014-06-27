#!/usr/bin/python2
# -*- coding: utf-8 -*-

from io import open
from datetime import datetime
import csv, sys, json

def load_stops_json(filename):
  with open(filename, 'r') as f:
    return json.load(f)

def format_stops(stops):
  result = {}
  for key in stops:
    for i in stops[key]['ids']:
      result[i] = key
  return result

def time_format(date):
  return datetime.strptime(date, '%H:%M:%S')

def parse_file(stops_dict, map_ids, path):
  def get_node(uid, stop_id, stops_dict, map_ids):
    return {
      'id': uid, 'name': stops_dict[uid]['name'],
      'lon': stops_dict[uid]['lon'], 'lat': stops_dict[uid]['lat']
    }

  def get_edge(uid, preceding_uid, departure_time, arrival_time):
    return {
      'from': u'' if preceding_uid == None else preceding_uid, 'to': uid,
      'time': u'' if departure_time == None else (arrival_time - departure_time).total_seconds()
    }

  line = {'nodes': [], 'edges': []}
  with open(path) as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    next(reader, None) #skip headers

    preceding_trip_id = None
    preceding_uid = None
    departure_time = None

    for row in reader:
      trip_id = row[0]

      if trip_id == preceding_trip_id or preceding_trip_id == None:
        stop_id = row[3]
        uid = map_ids[stop_id]
        arrival_time = time_format(row[1])

        line['nodes'].append(get_node(uid, stop_id, stops_dict, map_ids))
        line['edges'].append(get_edge(uid, preceding_uid, departure_time, arrival_time))

        departure_time = time_format(row[2])
        preceding_uid = uid
        preceding_trip_id = trip_id

      else:
        break

  return line

def parse_path(path):
  return path.split('_')[2].split('.')[0]

if __name__ == '__main__':
  if len(sys.argv) < 3:
    print 'Please give me JSON and CSV files to parse!'
    exit()

  stops_dict = load_stops_json(sys.argv[1])
  map_ids = format_stops(stops_dict)
  lines = {}

  for arg in sys.argv[2:]:
    try:
      lines[u'1'] = parse_file(stops_dict, map_ids, arg)
    except IOError:
      print 'Oops, failed to find or parse the file...'
      pass

  with open('stop_times.json', 'w') as f:
    f.write(unicode(json.dumps(lines, ensure_ascii=False)))
