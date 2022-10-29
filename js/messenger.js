var img_bool = false;
var img_code = 0;

function new_message(text, name, img) {
    if (img != '') {
        $('#kont #backgroundofkont #messages').append('<li class="a"><div class="name">' + name + '</div>' + text + '<img src="' + img + '" /></li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        return
    }
    $('#kont #backgroundofkont #messages').append('<li class="a"><div class="name">' + name + '</div>' + text + '</li>');
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
                new_message(msg['text']);
            })
        })
        .catch(error => console.log('error', error));
}

function send() {
    var message_txt = $('#kont .text input').val();
    if (message_txt != '') {
        $('#kont #backgroundofkont #messages').append('<li class="b">' + message_txt + '</li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        $('#kont .text input').val('').empty();
        let formData = new FormData();
        formData.append("text", message_txt);
        formData.append("is_file", 0);
        formData.append("is_problem", 0);
        fetch('/ajax.php?type=message', {
            method: "POST",
            body: formData
        });
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
    }
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
                img.setAttribute("height", "200px")
                img.setAttribute("width", "250px")
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
                    $("#backgroundofkont").css("height", "calc(100% - 105px)")

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


    //alert($('#kont #messages li:first').height());

    //$('#kont #messages li').css('top', $(this).prev().height()+'px');


    $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");

    $('#kont .send').css('cursor', 'pointer');

    setInterval(poll, 3);
});