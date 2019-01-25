# SMPP SIMULATOR

## Installation

~~~
$ cd js-client
$
$ # Download library
$ npm install
$ bower install
$ # Compile the JS code
$ grunt --force build
$
$ # Copy JS code to server static resources
$ rsync -avP --delete dist/* ../java-server/src/main/resources/static/
$
$ # Package java code
$ cd ../java-server
$ mvn -DskipTests=true clean package
$
$ # Build the docker image
$ docker build . -t registry.gitlab.com/adsmife/myson/smpp-simulator
$
$ # Push to gitlab registry
$ docker push registry.gitlab.com/adsmife/myson/smpp-simulator
$
$ #run smpp simulator locally  
$ docker run -p 28080:8080 registry.gitlab.com/adsmife/myson/smpp-simulator
$
$ Smpp simulator - http://localhost:28080/#!/
