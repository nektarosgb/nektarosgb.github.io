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
    if(dosya==null){
        return;
    }
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

function resimTemizle(imgID){
    var img = $("#"+imgID);
    img.src = "";
}

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
    });
}

function LoadDrop(dropId,id,text,tablo,selected)
{
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
                snapshot.forEach(function (element) {
                    var cleanelement = JSON.parse(JSON.stringify(element));
                    if(selected===cleanelement[id])
                        $("#"+dropId).append("<option value="+cleanelement[id]+" selected>"+cleanelement[text]+"</option>");
                    else
                         $("#"+dropId).append("<option value="+cleanelement[id]+">"+cleanelement[text]+"</option>");
                });
            });
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

