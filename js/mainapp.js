firebase.auth().onAuthStateChanged(function (user) {
    if(user!=null){
        alert("Login Başarılı");
    }else{
        alert("Kullanıcı adı veya parola bulunamadı!");
    }
    window.user = user; // user is undefined if no user signed in
});

$(".btnlogin").on('click',new function(){
    checkLogin();
});


function checkLogin(){
    var email=$(".btnlogin").val();
    var passwd=$(".txtpasswd").val();
    alert("login başladım :"+email+"-"+ passwd);
    firebase.auth().signInWithEmailAndPassword(email, passwd)
    .catch(function(err) {
      // Handle errors
    });
}
