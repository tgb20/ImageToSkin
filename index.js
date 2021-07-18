const { spawn } = require('child_process');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const countFiles = require('count-files');
const bodyParser = require('body-parser');
const PORT = 1739;


const app = express();
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('skins'));
app.use(express.static('public'))

app.post('/uploadimage', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No image uploaded'
            });
        } else {
            let image = req.files.image;
            let color = req.body.color;

            let newName = makeid(10) + '.png';

            image.mv('./uploads/' + newName);

            const python = spawn('python', ['main.py', newName, color]);

            //send response
            res.send({
                status: true,
                message: 'Image is uploaded',
                skin: {
                    full: '/skin_' + newName,
                    preview: '/skin_preview_' + newName,
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/skincount', async (req, res) => {
    countFiles('./uploads', function (err, results) {
        res.send({ skins: results.files });
    });
});

app.listen(PORT, () =>
    console.log(`App is listening on port ${PORT}.`)
);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}