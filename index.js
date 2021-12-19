const { spawn } = require('child_process');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const sharp = require('sharp');
const JSONdb = require('simple-json-db');
const PORT = 1739;

const db = new JSONdb('storage.json');

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
            let color = req.body.color;
            let blank = await sharp({
                create: {
                    width: 64, height: 64,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }
            }).png().toBuffer();
            let image = req.files.image;
            let preview = await sharp(image.data).resize({
                height: 32,
                width: 16,
                kernel: sharp.kernel.nearest,
            }).toBuffer();
            let head = await sharp(preview).extract({ top: 0, left: 4, width: 8, height: 8 }).toBuffer();
            let leftArm = await sharp(preview).extract({ top: 8, left: 0, width: 4, height: 12 }).toBuffer();
            let rightArm = await sharp(preview).extract({ top: 8, left: 12, width: 4, height: 12 }).toBuffer();
            let body = await sharp(preview).extract({ top: 8, left: 4, width: 8, height: 12 }).toBuffer();
            let leftLeg = await sharp(preview).extract({ top: 20, left: 4, width: 4, height: 12 }).toBuffer();
            let rightLeg = await sharp(preview).extract({ top: 20, left: 8, width: 4, height: 12 }).toBuffer();
            let skin = await sharp(blank).composite([{
                input: head,
                top: 8,
                left: 8
            },
            {
                input: body,
                top: 20,
                left: 20
            },
            {
                input: rightArm,
                top: 52,
                left: 36
            },
            {
                input: leftArm,
                top: 20,
                left: 44
            },
            {
                input: rightLeg,
                top: 52,
                left: 20
            },
            {
                input: leftLeg,
                top: 20,
                left: 4
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 8,
                        channels: 3,
                        background: color
                    }
                },
                top: 8,
                left: 0
            },
            {
                input: {
                    create: {
                        width: 16,
                        height: 8,
                        channels: 3,
                        background: color
                    }
                },
                top: 0,
                left: 8
            },
            {
                input: {
                    create: {
                        width: 16,
                        height: 8,
                        channels: 3,
                        background: color
                    }
                },
                top: 8,
                left: 16
            },
            {
                input: {
                    create: {
                        width: 4,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 20,
                left: 0
            },
            {
                input: {
                    create: {
                        width: 12,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 20,
                left: 8
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 4,
                        channels: 3,
                        background: color
                    }
                },
                top: 16,
                left: 4
            },
            {
                input: {
                    create: {
                        width: 16,
                        height: 4,
                        channels: 3,
                        background: color
                    }
                },
                top: 16,
                left: 20
            },
            {
                input: {
                    create: {
                        width: 16,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 20,
                left: 28
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 4,
                        channels: 3,
                        background: color
                    }
                },
                top: 16,
                left: 44
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 20,
                left: 48
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 52,
                left: 40
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 4,
                        channels: 3,
                        background: color
                    }
                },
                top: 48,
                left: 36
            },
            {
                input: {
                    create: {
                        width: 12,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 52,
                left: 24
            },
            {
                input: {
                    create: {
                        width: 8,
                        height: 4,
                        channels: 3,
                        background: color
                    }
                },
                top: 48,
                left: 20
            },
            {
                input: {
                    create: {
                        width: 4,
                        height: 12,
                        channels: 3,
                        background: color
                    }
                },
                top: 52,
                left: 16
            }]).png().toBuffer();

            let skins = db.get('skins');
            skins += 1;
            db.set('skins', skins);

            res.json({
                status: true,
                message: 'Image is uploaded',
                skin: {
                    full: `data:image/png;base64,${skin.toString('base64')}`
                },
                skins: skins
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(`# HELP skin_downloads The total number skins created.\n# TYPE skin_downloads counter\nskin_downloads ${rdb.get('skins')}`);
});

app.listen(PORT, () =>
    console.log(`App is listening on port ${PORT}.`)
);