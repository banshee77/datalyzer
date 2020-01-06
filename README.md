# GDELT data

https://blog.gdeltproject.org/gdelt-2-0-our-global-world-in-realtime
http://data.gdeltproject.org/gdeltv2/20200105203000.export.CSV.zip

# usefull sls commands

sls deploy -v
aws s3 cp "<local_path>\20200105203000.export.csv" s3://<destnation_bucket>
sls logs -f ingestGdeltData

sls remove -v
sls info -v