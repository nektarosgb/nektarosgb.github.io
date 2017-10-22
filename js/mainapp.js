$(function () {
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
    if(user!=null){
        alert("Login Başarılı");
    }else{
        alert("Kullanıcı adı veya parola bulunamadı!");
    }
    window.user = user; // user is undefined if no user signed in
});

function test (){
    var email=$(".txtemail").val();
    var passwd=$(".txtpasswd").val();
    
    firebase.auth().signInWithEmailAndPassword(email, passwd)
    .catch(function(err) {
        alert("lo bi get lo :"+email+"- Err:"+err);
    });
}


