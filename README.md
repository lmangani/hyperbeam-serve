<img src="https://hypercore-protocol.org/images/hypercore-protocol.png" width=130>

## hyperbeam-serve
HyperBeam 1-1 Encrypted Tunneling Proxy w/ Auto Discovery

#### Setup
```
npm install -g @qxip/hyperbeam-serve
```

#### Usage
##### Client
Spawn a beam client tunnel targeting a local or remote `service:port`
```
hyperbeam-serve -c some.webserver:80 -t somesupersecretproxyhash
```

##### Server
Spawn a local beam server proxying traffic to the client using a custom `port`
```
hyperbeam-serve -s 0.0.0.0:8080 -t somesupersecretproxyhash
```

##### Server + Client
Spawn a local beam server proxying traffic to a local beam client using a custom `port`
```
hyperbeam-serve -s 0.0.0.0:8080 -c some.webserver:80 -t somesupersecretproxyhash
```

---------

#### Test
Once the  beam is connected you can interact with it through `hyperbeam` or via the proxy with `curl`.

##### Hyperbeam Client
```
hyperbeam supersecretproxyhash
```
```
GET / HTTP/1.1

```
##### CURL Client
```
curl www.google.com -x localhost:8080
```


#### Credits
* [hyperbeam](https://github.com/mafintosh/hyperbeam)
* [http-over-hyperswarm](https://github.com/ameba23/http-over-hyperswarm)
