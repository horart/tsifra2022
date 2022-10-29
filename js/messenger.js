var img_bool = false;
var img_code = 0;

function new_message(text, name, img) {
    if (img) {
        $('#kont #backgroundofkont #messages').append('<li class="a"><div class="name">' + name + '</div>' + text + '<img src="' + img + '" /></li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        return
    }
    $('#kont #backgroundofkont #messages').append('<li class="a"><div class="name">' + name + '</div>' + text + '</li>');
    $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
}

function my_new_message(text, img) {
    $('#kont .text input').val('').empty();
    if (img) {
        $('#kont #backgroundofkont #messages').append('<li class="b">' + text + '<br><img src="' + img + '" /></li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        return
    }
    $('#kont #backgroundofkont #messages').append('<li class="b">' + text + '</li>');
    $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
}

function poll() {
    let requestOptions = {
        method: 'POST',
    };

    fetch("/ajax.php?type=poll", requestOptions)
        .then(response => response.json())
        .then(function(res) {
            res.forEach(msg => {
                new_message(msg['content'], msg['name']);
            })
        })
        .catch(error => console.log('error', error));
}

function send() {
    $("#backgroundofkont").css("height", "calc(100% - 105px)")
    var message_txt = $('#kont .text input').val();
    if (message_txt != '') {
        let formData = new FormData();
        formData.append("text", message_txt);
        formData.append("is_file", 0);
        formData.append("is_problem", 0);
        fetch('/ajax.php?type=message', {
            method: "POST",
            body: formData
        });
        if (!img_bool) {
            my_new_message(message_txt)
        }
    }
    if (img_bool) {
        let img = document.getElementById('fileupload').files[0];
        let formData = new FormData();
        formData.append("attachment", img);
        formData.append("is_file", 1);
        formData.append("is_problem", 0);
        fetch('/ajax.php?type=message', {
            method: "POST",
            body: formData
        });
        const preview = document.getElementById("img_up");
        preview.innerHTML = '';
        my_new_message(message_txt, img_code)
        img_bool = false;
    }
    img_code = 0;
}




function upload(selector, accept) {
    const input = document.querySelector(selector);
    if (accept) {
        input.setAttribute("accept", accept)
    }

    const changeHandler = event => {
        if (!event.target.files.length) {
            return
        }
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (!file.type.match("image")) {
                return
            }
            const preview = document.getElementById("img_up");
            preview.innerHTML = '';
            const reader = new FileReader();
            reader.onload = ev => {
                console.log(ev.target.result)
                const img = document.createElement("img")
                const prw_div = document.createElement("div")
                const img_del = document.createElement("div")
                prw_div.classList.add("prw_div")
                img_del.classList.add("img_del")
                img.setAttribute("src", ev.target.result)
                $("#backgroundofkont").css("height", "calc(100% - 325px)")
                prw_div.insertAdjacentElement("afterbegin", img)
                prw_div.insertAdjacentElement("afterbegin", img_del)
                preview.insertAdjacentElement("afterbegin", prw_div)
                img_bool = true;
                img_code = ev.target.result;
                img_del.addEventListener("click", () => {
                    img_bool = false
                    img_code = 0;
                    preview.innerHTML = '';


                })
            }
            reader.readAsDataURL(file)

        })

    }
    input.addEventListener("change", changeHandler);
}



$(document).ready(function() {
    upload("#fileupload", '.png, .jpg, .jpeg, .gif');

    $('#kont .send img').click(function() {
        send();
    });



    $('#kont .text input').keypress(function(e) {
        if (e.which == 13 && !e.shiftKey) {
            send();
        }
    });

    $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");

    $('#kont .send').css('cursor', 'pointer');
    let requestOptions = {
        method: 'POST',
    };
    fetch("/ajax.php?type=init", requestOptions)
        .then(response => response.json())
        .then(function(res) {
            res.forEach(msg => {
                let is_image = msg['is_image'] ? 1 : 0;
                if(msg['mine']) {
                    my_new_message(is_image ? '' : msg['content'], is_image ? '/attachments/' + msg['content'] + '.jpg' : undefined);
                }
                else {
                    new_message(is_image ? '' : msg['content'], msg['name'], is_image ? '/attachments/' + msg['content'] + '.jpg' : undefined);
                }
            })
        })
        .catch(error => console.log('error', error));

    setInterval(poll, 1000);
});