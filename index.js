const port = 3000
const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')
const babel = require("babel-core");

const app = express()

app.get('*.html', (req, res) => {
    let filePath = path.join(__dirname, req.path);
    res.sendFile(filePath);
    // res.status(200)
    //     .json({message: 'ok'})
})
app.get('*.js', (req, res) => {
    let filePath = path.join(__dirname, req.path);
    bres = babeltransform(filePath);
    //let sourceFileName = "/" + path.relative(__dirname, filePath);
    // res.send(bres.code + `\n//# sourceMappingURL=${req.path}.map\n//# sourceUrl=${sourceFileName}`);
    res.send(bres.code);
    // res.status(200)
    //     .json({message: 'ok'})
})
app.get('*.js.map', (req, res) => {
    let filePath = path.join(__dirname, req.path);
    filePath = filePath.substr(0, filePath.length-4);
    bres = babeltransform(filePath);
    res.send(bres.map);
    // res.status(200)
    //     .json({message: 'ok'})
})

const serverOpts = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.crt')
}

spdy.createServer(serverOpts, app)
    .listen(port, (error) => {
        if (error) {
            console.error(error)
            return process.exit(1)
        } else {
            console.log('Listening on port: ' + port + '.')
        }
    })

function babeltransform(filePath) {
    console.log("transpiling", filePath,  path.relative(__dirname, filePath));
    return babel.transform(fs.readFileSync(filePath), {
        babelrc: false,
        filename: filePath,
        sourceMaps: "inline",
        // sourceRoot: "test"
        sourceFileName: "sources:///" + path.relative(__dirname, filePath),
        presets: [ require("babel-preset-es2015") ]
    });
}



// web socokets
const WebSocket = require('ws');
const http = require("http");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
//   const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    const chokidar = require('chokidar');

    // One-liner for current directory, ignores .dotfiles
    chokidar.watch(path.resolve(__dirname, "test"), {ignored: /(^|[\/\\])\../}).on('all', (event, filePath) => {
        console.log(event, filePath);
        if (event === "change") {
            ws.send(JSON.stringify({ event, path: "/" + path.relative(__dirname, filePath)}));
        }
    });

//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });


//   ws.send('something');
});

server.listen(4000, function listening() {
  console.log('Web socket server listening on %d', server.address().port);
});
