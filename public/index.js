$(() => {

    $('#error-message-container').hide();
    $('#skin-container').hide();

    let backgroundColor = '#000000';

    const pickr = Pickr.create({
        el: '.pickr-container',
        theme: 'monolith', // or 'monolith', or 'nano'
        default: '#000000',
        lockOpacity: true,
        comparison: false,

        components: {

            // Main components
            preview: true,
            opacity: false,
            hue: true,
            inline: true,
            // Input / output Options
            interaction: {
                hex: true,
                input: true,
                save: true,
            }
        }
    });

    pickr.on('change', (color, instance) => {
        backgroundColor = color.toHEXA().toString();
    })

    $('#build-button').click(() => {

        let baseImage = $('#file').prop('files')[0];

        if (baseImage === undefined) {
            $('#error-message-container').show();
        } else {
            backgroundColor = backgroundColor.substring(1);

            const formData = new FormData();
            formData.append('image', baseImage);
            formData.append('color', backgroundColor);

            fetch('/uploadimage', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status != false) {
                        $('#upload-container').hide();
                        $('#skin-container').show();
                        setTimeout(() => {
                            $('#skin-preview').attr('src', data.skin.preview);
                            $('#skin').attr('src', data.skin.full);
                            $('#loading').hide();
                        }, 1000);
                    }
                })
                .catch(error => {
                    console.error(error)
                });
        }
    });
});