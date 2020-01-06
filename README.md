# Datalyzer

GDELT data are pushed to Kinesis Firehose stream on S3 Event (uploading GDELT data csv).
You can conect with QuickSight to Kinesis Firehose stream bucket for GDELT data analysis. 

## GDELT details

* [GDELT website](https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime)
* [GDELT data](http://data.gdeltproject.org/gdeltv2/20200105203000.export.CSV.zip)

## SLS Commands

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
sls deploy -v

aws s3 cp "<local_path>\20200105203000.export.csv" s3://<destnation_bucket>

sls logs -f ingestGdeltData

sls remove -v

sls info -v
```