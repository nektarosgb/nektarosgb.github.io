$(function () {

});



firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        if (window.location.href.indexOf("index.html") == -1) {
            window.location = "index.html";
        }
    } else {
        if (window.location.href.indexOf("login") == -1) {
            window.location = "login.html";
        }
    }
    window.user = user; // user is undefined if no user signed in
});

function checkLogin() {
    var email = $(".txtemail").val();
    var passwd = $(".txtpasswd").val();

    firebase.auth().signInWithEmailAndPassword(email, passwd)
        .catch(function (err) {
            alert("Kullanıcı adı veya parola bulunamadı!");
        });
}

function msgInfo(title, msg) {


    $("#modalTitle").text(title);
    $("#modalMessage").text(msg);
    $("#modalBtnClose2").addClass("hide");
    $("#modalAlert div.modal-body").removeClass('bg-warning');
    $("#modalAlert div.modal-body").addClass('bg-success');
    $("#modalAlert div.modal-header").removeClass("text-danger");
    $("#modalAlert div.modal-header").addClass("text-success");
    $("#modalmessage").removeClass("text-danger");
    $("#modalmessage").addClass("text-success");
    $("#modalTitle").removeClass("text-danger");
    $("#modalTitle").addClass("text-success");
    $("#modalAlert").modal({ backdrop: 'true' });
    $("#modalAlert").modal({ backdrop: 'true', show: 'show' });

}

function msgWarning(title, msg) {


    $("#modalTitle").text(title);
    $("#modalMessage").text(msg);
    $("#modalBtnClose").removeClass("hide");
    //$("#modalBtnClose2").removeClass("hide");
    $("#modalAlert div.modal-body").removeClass('bg-success');
    $("#modalAlert div.modal-body").addClass('bg-warning');
    $("#modalAlert div.modal-header").removeClass("text-success");
    $("#modalAlert div.modal-header").addClass("text-danger");
    $("#modalmessage").removeClass("text-success");
    $("#modalmessage").addClass("text-danger");
    $("#modalTitle").removeClass("text-success");
    $("#modalTitle").addClass("text-danger");
    $("#modalAlert").modal({ backdrop: 'true', show: 'show' });
}

function dosyaYukle(dosya,klasor,id){
    var storageRef = firebase.storage().ref();
    storageRef.child(klasor).child(id).put(dosya).then(function(snapshot) {
        msgInfo("Başarılı", "Dosyanız yüklendi. İşleminize devam edebilirsiniz..");        
    });
}

function resimGoster(klasor,id,imgID){
    var storageRef = firebase.storage().ref();   
    storageRef.child(klasor).child(id).getDownloadURL().then(function(url) {
        var img = $("#"+imgID);
        img.src = url;
      }).catch(function(error) {
        // Handle any errors
      });
}

// function kaydetVeritabani(tablo, id, veri) {
//     firebase.database().ref(tablo + '/' + id).set(veri).then(function (deneme) {
//         msgInfo("Başarılı", "Kayıt tamamlandı. İşleminize devam edebilirsiniz..");
//     }).catch(function (error) {
//         msgInfo("Uyarı", "Kayıt tamamlanamadı. Lütfen girişlerinizi kontrol ediniz.");
//         console.error("ERROR: " + error);
//     });
//     listTable(tablo);
//     $("#myModal").modal('hide');
// }
function kaydetVeritabani(tablo, id, veri) {
    firebase.database().ref(tablo + '/' + id).set(veri).then(function (deneme) {
        msgInfo("Başarılı", "Kayıt tamamlandı. İşleminize devam edebilirsiniz..");
    }).catch(function (error) {
        msgInfo("Uyarı", "Kayıt tamamlanamadı. Lütfen girişlerinizi kontrol ediniz.");
        console.error("ERROR: " + error);
    });
    listTable(tablo);
    $("#myModal").modal('hide');
}

function listTable(tablo) {

    return firebase.database().ref(tablo).once('value').then(function (snapshot) {
        console.log(snapshot.val());
        initLoadedPage();
    });
}

//Şirket Bilgileri
function kaydetSirketBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var sirketAdi = $("#txtSirketAdi").val();
    var idSirket = firebase.database().ref("sirketler").push().key; //sirketAdi.replace(/[^\x00-\x7F]/g, "") + n;
    console.log("hdn",$("#hdnId").val());
    console.log("idSirket",idSirket);
    
    if($("#hdnId").val()!="" && $("#hdnId").val()!=null )
    {
        idSirket=$("#hdnId").val();
        $("#hdnId").val('');
    }
    var sirketAdresi = $("#txtSirketAdresi").val();
    var sirketTelefon = $("#txtSirketTelefon").val();
    var sirketSGKSicilNo = $("#txtSirketSGKSicilNo").val();
    var sirketIlgiliKisi = $("#txtSirketIlgiliKisi").val();
    var sirketTelefonCep = $("#txtSirketTelefonCep").val();
    var sirketEposta = $("#txtSirketEposta").val();
    var sirketIsyeriHekimi = $("#txtSirketIsyeriHekimi").val();
    var sirketIsGuvenligiUzmani = $("#txtSirketIsGuvenligiUzmani").val();

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri = {
        "idSirket": idSirket,
        "sirketAdi": sirketAdi,
        "sirketAdresi": sirketAdresi,
        "sirketTelefon": sirketTelefon,
        "sirketSGKSicilNo": sirketSGKSicilNo,
        "sirketIlgiliKisi": sirketIlgiliKisi,
        "sirketTelefonCep": sirketTelefonCep,
        "sirketEposta": sirketEposta,
        "sirketIsyeriHekimi": sirketIsyeriHekimi,
        "sirketIsGuvenligiUzmani": sirketIsGuvenligiUzmani,
        "kayitEden": firebase.auth().currentUser.uid
    }

    kaydetVeritabani("sirketler", idSirket, veri);
}

//********************** */
function kaydetCalisanBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var calisanAdi = $("#txtCalisanAdi").val();
    var idCalisan = calisanAdi.replace(/[^\x00-\x7F]/g, "") + n;
    if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
    idCalisan=$("#hdnId").val();
    var calisanAdresi = $("#txtCalisanAdresi").val();
    var calisanTelefon = $("#txtCalisanTelefon").val();
    var calisanSGKSicilNo = $("#txtCalisanSGKSicilNo").val();
    var calisanTCNo = $("#txtCalisanTCNo").val();
    var calisanTelefonCep = $("#txtCalisanTelefonCep").val();
    var calisanEposta = $("#txtCalisanEposta").val();
    var calisanIsyeri = $("#txtCalisanIsyeri").val();
    var dosya=$("#fileCalisan")[0].files[0];

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri = {
        "idCalisan": idCalisan,
        "calisanAdi": calisanAdi,
        "calisanAdresi": calisanAdresi,
        "calisanTelefon": calisanTelefon,
        "calisanSGKSicilNo": calisanSGKSicilNo,
        "calisanTCNo": calisanTCNo,
        "calisanTelefonCep": calisanTelefonCep,
        "calisanEposta": calisanEposta,
        "calisanIsyeri": calisanIsyeri,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    dosyaYukle(dosya,'calisanlar',idCalisan);

    kaydetVeritabani("calisanlar", idCalisan, veri);

}


function kaydetPersonelBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var personelAdi = $("#txtPersonelAdi").val();
    var idPersonel = personelAdi.replace(/[^\x00-\x7F]/g, "") + n;

    if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
    idPersonel=$("#hdnId").val();


    var personelGorevi = $("#txtPersonelGorevi").val();
    var personelAdresi = $("#txtPersonelAdresi").val();
    var personelTelefon = $("#txtPersonelTelefon").val();
    var personelTCNo = $("#txtPersonelTCNo").val();
    var personelTelefonCep = $("#txtPersonelTelefonCep").val();
    var personelEposta = $("#txtPersonelEposta").val();

    var veri = {
        "idPersonel": idPersonel,
        "personelAdi": personelAdi,
        "personelGorevi": personelGorevi,
        "personelAdresi": personelAdresi,
        "personelTelefon": personelTelefon,
        "personelTCNo": personelTCNo,
        "personelTelefonCep": personelTelefonCep,
        "personelEposta": personelEposta,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("personeller", idPersonel, veri);

}



function kaydetUygulamaTuruBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var uygulamaTuru = $("#txtUygulamaTuru").val();



    var idUygulamaTuru = uygulamaTuru.replace(/[^\x00-\x7F]/g, "") + n;

    
    if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
    idUygulamaTuru=$("#hdnId").val();

    var uygulamaTuruAciklama = $("#txtUygulamaTuruAciklama").val();

    var veri = {
        "idUygulamaTuru": idUygulamaTuru,
        "uygulamaTuru": uygulamaTuru,
        "uygulamaTuruAciklama": uygulamaTuruAciklama,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("uygulama_turleri", idUygulamaTuru, veri);

}



function kaydetMeslekBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var meslek = $("#txtMeslek").val();
    var idMeslek = meslek.replace(/[^\x00-\x7F]/g, "") + n;

    if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
    idMeslek=$("#hdnId").val();


    var meslekAciklama = $("#txtMeslekAciklama").val();

    var veri = {
        "idMeslek": idMeslek,
        "meslek": meslek,
        "meslekAciklama": meslekAciklama,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("meslekler", idMeslek, veri);

}

function kaydetTetkikBilgisi() {
    var d = new Date();
    var n = d.getTime()

    var tetkik = $("#txtTetkik").val();
    var idTetkik = tetkik.replace(/[^\x00-\x7F]/g, "") + n;
    
    if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
    idTetkik=$("#hdnId").val();

    var fiyat = $("#txtFiyat").val();
    var uygulamaTuru = $("input:radio[name='rdUygulamaTuru']:checked").val();
    var $input = $('input[name="rdUygulamaTuru"]:checked');
    var text = $('label[for=' + $input.attr('id') + ']').text();
    var uygulamaTuruAdi = "" + text;


    var veri = {
        "idTetkik": idTetkik,
        "tetkik": tetkik,
        "fiyat": fiyat,
        "uygulamaTuru": uygulamaTuru,
        "uygulamaTuruAdi": uygulamaTuruAdi,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("tetkikler", idTetkik, veri);

}

