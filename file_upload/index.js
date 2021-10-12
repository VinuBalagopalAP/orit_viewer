const Express = require("express");
const formidable = require("formidable");
const admin = require("firebase-admin");

var serviceAccount = require("./path-to-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "orit-viewer.appspot.com",
});


const app = Express();

app.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
});


app.post('/fileupload', (req, res) => {

    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        let upfile = files.filetoupload;
        var oldpath = upfile.path;
        console.log(oldpath);
        admin.storage().bucket().upload(oldpath)
        .then(async e => {
            console.log('uploaded');
            let x = await e[0].getSignedUrl({
                action: 'read',
                expires: '03-09-2491',
            });
            res.send(x[0]);
        }).catch(er => console.log('err', er));
    });
});


app.listen(3000);
