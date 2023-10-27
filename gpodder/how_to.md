Run with:

VERIFIER_SECRET_KEY="secret" ./gpodder2go serve -b 192.168.178.27:3005



curl -X POST -u moritz:password http://192.168.178.27:3005/api/2/auth/moritz/login.json

curl -X GET -u moritz:password http://192.168.178.27:3005/subscriptions/moritz.json


curl -X GET -u moritz:password http://192.168.178.27:3005/api/2/devices/moritz.json

curl -X GET -u moritz:password http://192.168.178.27:3005/api/2/subscriptions/moritz/1.json

curl -i -X GET -u moritz:password http://192.168.178.27:3005/api/2/subscriptions/moritz/1.json

curl -i -X GET -u moritz:password http://192.168.178.27:3005/api/2/devices/moritz.json


