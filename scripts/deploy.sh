#!/bin/bash

#Remove bogus license
rm *Elektronswer-*/LICENSE

## Linux
echo "Packing linux"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
tar -zcvf elektronswer-linux64.tar.gz Elektronswer-linux-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-linux-x64/resources/app/Elektronswer-*
tar -zcvf elektronswer-linux32.tar.gz Elektronswer-linux-ia32

## Windows
echo "Packing windows"
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-win32-x64/resources/app/Elektronswer-*
zip -r elektronswer-win64.zip Elektronswer-win32-x64
#32Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-win32-ia32/resources/app/Elektronswer-*
zip -r elektronswer-win32.zip Elektronswer-win32-ia32

echo "Packing mac"
## Mac
#64Bit
rm -rf /home/travis/build/solvillan/elektronswer/Elektronswer-darwin-x64/Elektronswer.app/Contents/Resources/app/Elektronswer-*
zip -r elektronswer-mac64.zip Elektronswer-darwin-x64

echo "Fixing permissions"
chmod a+rw elektronswer-mac64.zip
chmod a+rw elektronswer-win32.zip
chmod a+rw elektronswer-win64.zip
chmod a+rw elektronswer-linux64.tar.gz
chmod a+rw elektronswer-linux32.tar.gz
