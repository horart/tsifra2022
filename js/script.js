function send() {
    var messege_txt = $('#kont .text input').val();
    if (messege_txt != '') {
        $('#kont #backgroundofkont #messages').append('<li class="b">' + messege_txt + '</li>');
        $("#kont #backgroundofkont").animate({ scrollTop: 10000 }, "slow");
        $('#kont .text input').val('').empty();
    }

}
$(document).ready(function() {


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