#!/usr/bin/env node

const Hyperbeam = require('./node_modules/hyperbeam')
const net = require('net')

var argv = require('minimist')(process.argv.slice(2));

if ((!argv.c || !argv.s) && !argv.t) {
  console.error('Usage: hyperbeam-serve -c <remoteserver>:<remoteport> -t <topic>')
  console.error('Usage: hyperbeam-serve -s <localhost>:<localport> -t <topic>')
  process.exit(1)
}

const topic = argv.t;
const target = argv.s || argv.c;
var localport,localhost;


var getNetConfig = function(target,ip){
  var resp = {};
  if (target.includes(":")) {
	var split = target.split(':');
	resp.port = split[1];
	resp.host = split[0];
  } else {
	resp.port = target;
	resp.host = ip | '127.0.0.1';
  }
  return resp;
}

const beam = new Hyperbeam(topic, { announce: argv.c ? true : false, lookup: argv.s ? true : false })

beam.on('remote-address', function ({ host, port }) {
  if (!host) console.error('[hyperbeam] Could not detect remote address')
  else console.error('[hyperbeam] Joined the DHT - remote address is ' + host + ':' + port)
  if (port) console.error('[hyperbeam] Network is holepunchable \\o/')
})

let client = false;
let off = false;
beam.on('connected', function () {
	  console.error('[hyperbeam] Success! Encrypted tunnel established to remote peer')
	  if (argv.c){
	    var cconfig = getNetConfig(argv.c);
	    client = net.createConnection(cconfig.port, cconfig.host, () => {
	      beam.on('data', (data) => {
	        client.write(data)
	      })
	      client.on('data', (data) => {
	        beam.write(data)
	      })
	      client.on('close', (data) => {
	        if (!off) client.connect(cconfig.port, cconfig.host, function() {} )
	      })
	      client.on('connect', (data) => {
		// console.error('[hyperbeam] Net client connected to remote '+cconfig.host+':'+cconfig.port)
	      })
	      beam.on('end', () => {
		off = true;
	        client.end()
		beam.end()
	      })
	    })
	    client.on('error', (err) => {
	      console.error(err)
	    })
  	}
	if (argv.s){
	  var sconfig = getNetConfig(argv.s, '0.0.0.0');
	  const server = net.createServer((connection) => {
	    if (beam) {
	      connection.on('data', (data) => {
	        beam.write(data)
	      })
	      connection.on('end', () => {
	        console.log('ending')
	      })
	      beam.on('data', (data) => {
	        if (!connection.destroyed) connection.write(data)
	      })
	      beam.on('close', () => {
	        connection.end()
	      })
	      connection.on('error', (err) => {
	        console.error(err)
	      })
	    }
	  })
	  server.on('error', (err) => {
	    throw err
	  })
	  server.listen(sconfig.port, sconfig.host, () => {
	    console.error('[hyperbeam] Net proxy listening on '+sconfig.host+':'+sconfig.port)
	  })

  }
})

//process.stdin.pipe(beam).pipe(process.stdout)
beam.pipe(process.stdout)

if (typeof process.stdin.unref === 'function') process.stdin.unref()

process.once('SIGINT', () => {
  if (!beam.connected) closeASAP()
  else beam.end()
})

function closeASAP () {
  console.error('[hyperbeam] Shutting down beam...')

  const timeout = setTimeout(() => process.exit(1), 2000)
  if (client) client.end()
  if (server) server.close()
  beam.destroy()
  beam.on('close', function () {
    clearTimeout(timeout)
  })
}
