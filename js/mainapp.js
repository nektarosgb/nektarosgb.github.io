$(function () {
    
});



// firebase.auth().onAuthStateChanged(function (user) {
//     if (user != null) {
//         if (window.location.href.indexOf("index.html") == -1) {
//             window.location = "index.html";
//         }
//     } else {
//         if (window.location.href.indexOf("login") == -1) {
//             window.location = "login.html";
//         }
//     }
//     window.user = user; // user is undefined if no user signed in
// });

function checkLogin() {
    var email = $(".txtemail").val();
    var passwd = $(".txtpasswd").val();

    firebase.auth().signInWithEmailAndPassword(email, passwd)
        .catch(function (err) {
            alert("Kullanıcı adı veya parola bulunamadı!");
        });
}

function kaydetVeritabani(tablo, id, veri) {
    firebase.database().ref(tablo + '/' + id).set(veri);
    listTable(tablo);
}

function listTable(tablo)
{
    var ref = firebase.database().ref();
    ref.on(tablo,function(snapshot){
        console.log(snapshot.val());
    })

    return firebase.database().ref(tablo).once('value').then(function(snapshot) {
        console.log(snapshot.val());
      });
}

function kaydetSirketBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var sirketAdi=$("#txtSirketAdi").val();    
    var idSirket=sirketAdi.replace(/[^\x00-\x7F]/g, "")+n;
    var sirketAdresi=$("#txtSirketAdresi").val();    
    var sirketTelefon=$("#txtSirketTelefon").val();   
    var sirketSGKSicilNo=$("#txtSirketSGKSicilNo").val();   
    var sirketIlgiliKisi=$("#txtSirketIlgiliKisi").val();   
    var sirketTelefonCep=$("#txtSirketTelefonCep").val();   
    var sirketEposta=$("#txtSirketEposta").val();   
    var sirketIsyeriHekimi=$("#txtSirketIsyeriHekimi").val(); 
    var sirketIsGuvenligiUzmani=$("#txtSirketIsGuvenligiUzmani").val(); 

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri={
        "idSirket":idSirket,
        "sirketAdi":sirketAdi,
        "sirketAdresi":sirketAdresi,
        "sirketTelefon":sirketTelefon,
        "sirketSGKSicilNo":sirketSGKSicilNo,
        "sirketIlgiliKisi":sirketIlgiliKisi,
        "sirketTelefonCep":sirketTelefonCep,
        "sirketEposta":sirketEposta,
        "sirketIsyeriHekimi":sirketIsyeriHekimi,
        "sirketIsGuvenligiUzmani":sirketIsGuvenligiUzmani,
        "kayitEden":firebase.auth().currentUser.uid
    }

    kaydetVeritabani("sirketler",idSirket,veri);

}

