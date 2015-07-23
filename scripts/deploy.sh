#!/bin/bash

#Remove bogus license
rm *Elektronswer-*/LICENSE

## Linux
echo "Packing linux"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/Elektronswer-*
tar -zcvf elektronswer-linux64.tar.gz /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-ia32/Elektronswer-*
tar -zcvf elektronswer-linux32.tar.gz /home/travis/build/solvillan/elektronswer/Elektronswer-linux-ia32

## Windows
echo "Packing windows"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-win32-x64/Elektronswer-*
zip -r elektronswer-win64.zip /home/travis/build/solvillan/elektronswer/Elektronswer-win32-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-win32-ia32/Elektronswer-*
zip -r elektronswer-win32.zip /home/travis/build/solvillan/elektronswer/Elektronswer-win32-ia32

echo "Packing mac"
## Mac
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-darwin-x64/Elektronswer-*
zip -r elektronswer-mac64.zip /home/travis/build/solvillan/elektronswer/Elektronswer-darwin-x64

echo "Fixing permissions"
chmod a+rw elektronswer-*

echo "Starting upload"

echo "open $FTP_SERVER
user $FTP_USER \"$FTP_PASS\"
cd /srv/http/
put elektronswer-linux64.tar.gz
put elektronswer-linux32.tar.gz
put elektronswer-win64.zip
put elektronswer-win32.zip
put elektronswer-mac64.zip
bye" > upload

lftp -p -f upload

echo "Done deploying!"
