firebase.auth().onAuthStateChanged(function (user) {
    if(user!=null){
        alert("Login Başarılı");
    }else{
        alert("Kullanıcı adı veya parola bulunamadı!");
    }
    window.user = user; // user is undefined if no user signed in
});


function checkLogin(){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(err) {
      // Handle errors
    });
}
