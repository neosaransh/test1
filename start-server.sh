cd Backend
if [ -n NODE ]; then
  NODE=node
fi
PORT=3001 node bin/www 2>&1 | sed -r "s/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[mGK]//g" > ../logs/backend.log &
sleep 2
cd ../Website
npm start 2>&1 > ../logs/website.log &
