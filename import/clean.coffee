# All of our dependencies
util = require("util")
excel = require('excel')
path = require('path')
fs = require('fs')
_ = require('lodash')

# This is the file we'll be cleaning
#file = path.join __dirname, 'data', 'sample.xlsx'
file = path.join __dirname, 'data', 'detention_master.xlsx'

# This is a collection of the data that we'll eventually output as a csv
# Clean by doing our best to merge the rows in the excel spreadsheet the data
# is stored in.
clean = ->
  header = 'INCIDENT NUMBER,DESCRIPTION,TYPE,DATE,'
  header += 'LOCATION,DETAILS,SPECIFIC LOCATION,PAGE,ROW'
  console.log header
  extractor = excel file
  extractor.on 'worksheet', extractDataSafe

extractDataSafe = (sheet) ->
  try
    extractData(sheet)
  catch e
    console.error "ERROR: #{_.last(_.compact(sheet[0]))}: " + e

extractData = (sheet) ->

  pageCell = _.last(_.compact(sheet[0]))
  match = pageCell.match(/\d+$/)
  page = if match then match[0] else strip(pageCell)
  
  processed = _.all sheet.slice(0, 6), (row) ->
    _.compact(row).length == 7
  if processed
    console.error("SKIPPING")
    return

  console.error "processing page: #{page}"
  console.error(sheet[0].join(','))

  currentId = ''
  currentLocation = []
  detailsCells = []
  console.error "doing #{sheet.length}"
  entryIndex = 0

  sheet.forEach (row) ->
    currentId += strip row[0]
    detailsCells = detailsCells.concat(_.compact(_.map(row.slice(4), strip)))
    currentLocation = currentLocation.concat(strip(row[3]))
    if currentId.match(/(1-[\dA-Z]+)/)
      entryIndex += 1
      description = strip row[1]
      if badId = currentId.match(/(1-[\dA-Z]+) (.*)/)
        id = badId[1]
        description = strip badId[2]
      else
        id = currentId
      match = row[3].match(/(.*)(\d\d\/\d+\/\d\d\d\d)(.*)/)
      if not match
        match = row[3].match(/(.*)(\d\/\d+\/\d\d\d\d)(.*)/)
      date = strip match[2]
      location = currentLocation.slice(0, -1)
      location = location.concat(_.compact(_.map([match[1], match[3]], strip)))
      location = _.compact(location).join(' ')
      details = detailsCells.join(' ').slice(0, -1)
      cleanRow = [
        id,
        description,
        strip(row[2]),
        date,
        location,
        details,
        _.last(detailsCells),
        page or '',
        entryIndex.toString()
      ]
      cleanRow = _.map cleanRow, (cell) ->
        '"' + cell.replace(/"/g, '""') + '"'
      console.log(cleanRow.join(','))
    
      currentId = ''
      currentLocation = []
      detailsCells = []

strip = (string) ->
  if string
    string.replace(/^\s+|\s+$/mg, '')
  else
    ''

extractSpecificLocationIndex = (sheet) ->
  if not sheet[1] then return
  index = null
  _.detect sheet.slice(1), (row)->
    if row[row.length - 1].match(/\w/)
      index = row.length - 1
    else if row[row.length - 2].match(/\w/)
      index = row.length - 1
    else
      false
  index

    
clean()
