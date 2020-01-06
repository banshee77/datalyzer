# Project Title

One Paragraph of project description goes here

## Getting Started

* [GDELT website](https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime) 
* [GDELT data](http://data.gdeltproject.org/gdeltv2/20200105203000.export.CSV.zip) 

## sls commands

```
sls deploy -v
aws s3 cp "<local_path>\20200105203000.export.csv" s3://<destnation_bucket>
sls logs -f ingestGdeltData

sls remove -v
sls info -v
```