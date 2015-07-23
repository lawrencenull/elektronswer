#!/bin/bash

#Remove bogus license
rm *Elektronswer-*/LICENSE

## Linux
echo "Packing linux"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
tar -zcvf elektronswer-linux64-$TRAVIS_BUILD_NUMBER.tar.gz Elektronswer-linux-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
tar -zcvf elektronswer-linux32-$TRAVIS_BUILD_NUMBER.tar.gz Elektronswer-linux-ia32

## Windows
echo "Packing windows"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
zip -r elektronswer-win64-$TRAVIS_BUILD_NUMBER.zip Elektronswer-win32-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
zip -r elektronswer-win32-$TRAVIS_BUILD_NUMBER.zip Elektronswer-win32-ia32

echo "Packing mac"
## Mac
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
zip -r elektronswer-mac64-$TRAVIS_BUILD_NUMBER.zip Elektronswer-darwin-x64

echo "Fixing permissions"
chmod a+rw elektronswer-*

echo "Generate webpage"

echo "<!DOCTYPE html>
<html>
  <head>
    <meta charset=\"utf-8\">
    <title>Elektronswer</title>
  </head>
  <body>
    <h1>Welcome to Elektronswer.</h1>
    <h6>Download latest builds:</h6><a class=\"buildnr\">Build #$TRAVIS_BUILD_NUMBER</a>
    <ul>
      <li><a href=\"elektronswer-linux64-$TRAVIS_BUILD_NUMBER.tar.gz\">Linux x64</a></li>
      <li><a href=\"elektronswer-linux32-$TRAVIS_BUILD_NUMBER.tar.gz\">Linux x86</a></li>
      <li><a href=\"elektronswer-win64-$TRAVIS_BUILD_NUMBER.zip\">Windows x64</a></li>
      <li><a href=\"elektronswer-win32-$TRAVIS_BUILD_NUMBER.zip\">Windows x86</a></li>
      <li><a href=\"elektronswer-mac64-$TRAVIS_BUILD_NUMBER.zip\">Mac OSX</a></li>
    </ul>
  </body>
</html>
" > index.html

chmod a+rw index.html

echo "Starting upload"

echo "open $FTP_SERVER
user $FTP_USER \"$FTP_PASS\"
cd /srv/http/
put elektronswer-linux64-$TRAVIS_BUILD_NUMBER.tar.gz
put elektronswer-linux32-$TRAVIS_BUILD_NUMBER.tar.gz
put elektronswer-win64-$TRAVIS_BUILD_NUMBER.zip
put elektronswer-win32-$TRAVIS_BUILD_NUMBER.zip
put elektronswer-mac64-$TRAVIS_BUILD_NUMBER.zip
put index.html
bye" > upload

lftp -p -f upload

echo "Done deploying!"
