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
            //$("#modalBtnClose").addClass("hide");
            $("#modalBtnClose2").addClass("hide");
            $("#modalAlert div.modal-body").removeClass('bg-warning');
            $("#modalAlert div.modal-body").addClass('bg-success');
            $("#modalAlert div.modal-header").removeClass("text-danger");
            $("#modalAlert div.modal-header").addClass("text-success");
            $("#modalmessage").removeClass("text-danger");
            $("#modalmessage").addClass("text-success");
            $("#modalTitle").removeClass("text-danger");
            $("#modalTitle").addClass("text-success");
            $("#modalAlert").modal({ backdrop: 'static' });
            $("#modalAlert").modal({ backdrop: 'static', show: 'show' });
        
        }
        
        function msgWarning(title, msg) {
        
        
            $("#modalTitle").text(title);
            $("#modalMessage").text(msg);
            $("#modalBtnClose").removeClass("hide");
            $("#modalBtnClose2").removeClass("hide");
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
    
    function kaydetVeritabani(tablo, id, veri) {
        firebase.database().ref(tablo + '/' + id).set(veri).then(function(deneme){
            msgInfo("Başarılı","Kayıt tamamlandı. İşleminize devam edebilirsiniz..");
        }).catch(function(error) {
            msgInfo("Uyarı","Kayıt tamamlanamadı. Lütfen girişlerinizi kontrol ediniz.");
            console.error("ERROR: " + error);
        });
        listTable(tablo);
    }
    
    function listTable(tablo) {
    
        return firebase.database().ref(tablo).once('value').then(function (snapshot) {
            console.log(snapshot.val());
        });
    }
    
    function kaydetSirketBilgileri() {
        var d = new Date();
        var n = d.getTime()
    
        var sirketAdi = $("#txtSirketAdi").val();
        var idSirket = sirketAdi.replace(/[^\x00-\x7F]/g, "") + n;
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
    
    function kaydetCalisanBilgileri() {
        var d = new Date();
        var n = d.getTime()
    
        var calisanAdi = $("#txtCalisanAdi").val();
        var idCalisan = calisanAdi.replace(/[^\x00-\x7F]/g, "") + n;
        var calisanAdresi = $("#txtCalisanAdresi").val();
        var calisanTelefon = $("#txtCalisanTelefon").val();
        var calisanSGKSicilNo = $("#txtCalisanSGKSicilNo").val();
        var calisanTCNo = $("#txtCalisanTCNo").val();
        var calisanTelefonCep = $("#txtCalisanTelefonCep").val();
        var calisanEposta = $("#txtCalisanEposta").val();
        var calisanIsyeri = $("#txtCalisanIsyeri").val();
    
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
    
        kaydetVeritabani("calisanlar", idCalisan, veri);
    
    }


    function kaydetPersonelBilgileri() {
        var d = new Date();
        var n = d.getTime()
    
        var personelAdi = $("#txtPersonelAdi").val();
        var idPersonel = personelAdi.replace(/[^\x00-\x7F]/g, "") + n;
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
    
        var tetkik=$("#txtTetkik").val();    
        var idTetkik=tetkik.replace(/[^\x00-\x7F]/g, "")+n;
        var fiyat=$("#txtFiyat").val();    
        var uygulamaTuru =$("input:radio[name='rdUygulamaTuru']:checked").val();
        var $input = $('input[name="rdUygulamaTuru"]:checked');
        var text = $('label[for='+$input.attr('id')+']').text();
        var uygulamaTuruAdi =text;
    
    
        var veri={
            "idTetkik":idTetkik,
            "tetkik":tetkik,
            "fiyat":fiyat,
            "uygulamaturu":uygulamaturu,
            "uygulamaTuruAdi":uygulamaTuruAdi,
            "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
        }
    
        kaydetVeritabani("tetkikler",idTetkik,veri);
    
    }

