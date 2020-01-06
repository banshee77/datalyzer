'use strict';

const AWS = require('aws-sdk');
const csv = require('fast-csv');
const fs = require('fs');

const config = require('./config.json');

function toISODate(dateString) {
  const dateObj = new Date(
    dateString.substr(0, 4), // year
    1, // Months are numbered 1..12
    dateString.substr(4, 2), // month
    dateString.substr(6, 2), // day
    dateString.substr(8, 2), // hour
    dateString.substr(10, 2), // min
    dateString.substr(12, 2), // sec
  )

  return dateObj.toISOString();
}

module.exports.ingestGdeltData = async (event, context) => {

  console.log("S3 Event: ", event['Records'][0]['s3']);  

  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
  const firehose = new AWS.Firehose({ apiVersion: '2015-08-04' });
  
  const s3Event = event['Records'][0];

  // Sanity check event type

  if (s3Event['eventSource'] != 'aws:s3') {
    const err = new Error(`eventSource is not 'aws:s3': ${s3Event}`);
    throw err;
  }

  if (s3Event['eventName'] != 'ObjectCreated:Put') {
    const err = new Error(`eventName is not 'ObjectCreated:Put': ${s3Event}`);
    throw err;
  }

  // Get bucket and key from the SNS event

  const bucketName = s3Event['s3']['bucket']['name'];
  const objectKey = s3Event['s3']['object']['key'];

  console.info(`Found GDELT events file: ${bucketName}/${objectKey}`);

  
  // Get CSV data as stream

  const objectLocation = { Bucket: bucketName, Key: objectKey };
  const s3Stream = s3.getObject(objectLocation).createReadStream();


  // Parse and transform data  

  const loadFromStream = s3Stream => new Promise((resolve, reject) => {
    csv.parseStream(s3Stream, { delimiter: '\t', headers: config.GDELT_EVENT_FIELDS })
      .on('data', async function (data) {
        data['IsoTime'] = toISODate(data['DateAdded']);
        data['QuadClassString'] = config.GDELT_QUADCLASS_MAP[data['QuadClass']] || "UNKNOWN";

        // Send data to firehose

        await firehose.putRecord({
          DeliveryStreamName: process.env.DATALYZER_INGEST_STREAM_NAME,
          Record: { 'Data': JSON.stringify(data) }
        }).promise();
      })
      .on('end', rowCount => {
        console.log(`Parsed ${rowCount} rows`);
        resolve()
      })
      .on('error', error => {
        console.error(error)
        reject(error)
      });
  });

  await loadFromStream(s3Stream);
  
  return;
};
