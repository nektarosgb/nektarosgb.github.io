$(function () {

    

    if (window.user == null) {

        var host = window.location.hostname;
        if (window.location != host+"/login.html") {
            alert("Girişe yönlendiriliyorsunuz..."+window.location);
            window.location = "login.html";
        }
    }

    $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' // optional
    });

    // $(".btnlogin").on('click',new function(){
    //     var email=$(".txtemail").val();
    //     var passwd=$(".txtpasswd").val();
    //     alert("login başladım :"+email+"-"+ passwd);
    //     firebase.auth().signInWithEmailAndPassword(email, passwd)
    //     .catch(function(err) {
    //       // Handle errors
    //     });
    // });


});



firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        if (window.location != "index.html") {
            alert("Login Başarılı"+JSON.stringify(user));

            window.location = "index.html";
        }
    }
    window.user = user; // user is undefined if no user signed in
});

function test() {
    var email = $(".txtemail").val();
    var passwd = $(".txtpasswd").val();

    firebase.auth().signInWithEmailAndPassword(email, passwd)
        .catch(function (err) {
            alert("Kullanıcı adı veya parola bulunamadı!");
        });
}


