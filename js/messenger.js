var img_bool = false;
var img_code = 0;

function send() {
    var messege_txt = $('#kont .text input').val();
    if (messege_txt != '') {
        $('#kont #backgroundofkont #messages').append('<li class="b">' + messege_txt + '</li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        $('#kont .text input').val('').empty();
    }



}

async function uploadFile() {
    let formData = new FormData();
    formData.append("file", fileupload.files[0]);
    await fetch('/ajax.php?type=message', {
        method: "POST",
        body: formData
    });
    alert('The file has been uploaded successfully.');
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


});