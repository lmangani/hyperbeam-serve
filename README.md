<img src="https://hypercore-protocol.org/images/hypercore-protocol.png" width=130>

## hyperbeam-serve
HyperBeam 1-1 Encrypted Tunneling Proxy w/ Auto Discovery

### Setup
```
npm install -g @qxip/hyperbeam-serve
```

### Usage
#### Client
```
hyperbeam-serve -c google.com:80 -t somesupersecretproxyhash
```

#### Server
```
hyperbeam-serve -s 0.0.0.0:8080 -t somesupersecretproxyhash
```

---------

### Test
Once your client/server pair is connected you can interact with it through `hyperbeam` or via the proxy port with `curl` or other tools.

#### Hyperbeam Client
```
hyperbeam supersecretproxyhash
```
```
GET http://google.com/ HTTP/1.1

```
#### CURL Client
```
curl www.google.com -x localhost:8080
```
