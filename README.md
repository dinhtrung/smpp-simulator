# SMPP SIMULATOR

## Installation

~~~
$ cd js-client
$
$ # Compile the JS code
$ grunt --force
$
$ # Copy JS code to server static resources
$ rsync -avP --delete dist/* ../java-server/src/main/resource/static/
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
~~~
