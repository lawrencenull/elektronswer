#!/bin/bash

#Remove bogus license
rm Elektronswer-*/LICENSE

## Linux
echo "Packing linux"
#64Bit
tar -zcvf elektronswer-linux64.tar.gz ../Elektronswer-linux-x64
#32Bit
tar -zcvf elektronswer-linux32.tar.gz ../Elektronswer-linux-ia32

## Windows
echo "Packing windows"
#64Bit
zip -r elektronswer-win64.zip ../Elektronswer-win32-x64
#32Bit
zip -r elektronswer-win32.zip ../Elektronswer-win32-ia32

echo "Packing mac"
## Mac
#64Bit
zip -r elektronswer-mac64.zip ../Elektronswer-darwin-x64

echo "Fixing permissions"
chmod a+r elektronswer-*

echo "Starting upload"
ftp -n $FTP_SERVER <<End-Of-Session
# -n option disables auto-logon

user $FTP_USER "$FTP_PASS"
binary
cd /srv/http/
put "elektronswer-linux64.tar.gz"
put "elektronswer-linux32.tar.gz"
put "elektronswer-win64.zip"
put "elektronswer-win32.zip"
put "elektronswer-mac64.zip"
bye
End-Of-Session

echo "Done deploying!"
