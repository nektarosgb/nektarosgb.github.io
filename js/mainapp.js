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

function setHeader(value) {
    $("#topheaderId").empty();
    $("#topheaderId").append("<p>" + value + "</p>");
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

function dosyaYukle(dosya, klasor, id) {
    if (dosya == null) {
        return;
    }
    var storageRef = firebase.storage().ref();
    storageRef.child(klasor).child(id).put(dosya).then(function (snapshot) {
        msgInfo("Başarılı", "Dosyanız yüklendi. İşleminize devam edebilirsiniz..");
    });
}

function resimGoster(klasor, id, imgID) {
    var storageRef = firebase.storage().ref();
    storageRef.child(klasor).child(id).getDownloadURL().then(function (url) {
        var img = $("#" + imgID);        
        img.attr("src",url);
    }).catch(function (error) {
        console.log(error);
        img.attr("src","/css/images/no-picture.png");
    });
}

function resimTemizle(imgID) {
    var img = $("#" + imgID);
    img.src = "";
}

function generateID(text){
    var d = new Date();
    var n = d.getTime()
    text=text.replace(/[^\x00-\x7F]/g, "").split(' ').join('')+ n;
    text = text.replace(/[{()}]/g, '');
    text = text.replace(/[\[\]']+/g, '');
    text = text.replace(/\(|\)/g,'')
    return text;
}

function kaydetVeritabani(tablo, id, veri) {
    firebase.database().ref(tablo + '/' + id).set(veri).then(function (deneme) {
        msgInfo("Başarılı", "Kayıt tamamlandı. İşleminize devam edebilirsiniz..");
    }).catch(function (error) {
        msgInfo("Uyarı", "Kayıt tamamlanamadı. Lütfen girişlerinizi kontrol ediniz.");
        console.error("ERROR: " + error);
    });
    //listTable(tablo);
    $("#myModal").modal('hide');
}




function listTable(tablo) {

    return firebase.database().ref(tablo).once('value').then(function (snapshot) {
        console.log(snapshot.val());
    });
}

function LoadDrop(dropId, id, text, tablo, selected) {
    $('#' + dropId)
        .find('option')
        .remove()
        .end()
        .append('<option value="0">Seçiniz</option>');
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            if (selected === cleanelement[id])
                $("#" + dropId).append("<option value=" + cleanelement[id] + " selected>" + cleanelement[text] + "</option>");
            else
                $("#" + dropId).append("<option value=" + cleanelement[id] + ">" + cleanelement[text] + "</option>");
        });
    });
}

var chkListVerileri={};

function loadCheckBoxList(lstChkID, idColumn, column, tablo,event) {
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
        chkListVerileri[tablo]={};
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            var li = $('<li class="list-group-item checkboxfit">'+cleanelement[column]+'<div class="material-switch pull-left"><input id="chkitem' + cleanelement[idColumn] + '"'+event+' name="chk' + tablo+ '" value='+cleanelement[idColumn]+' type="checkbox" /><label for="chkitem' + cleanelement[idColumn] + '" class="label-success"></label></div></li>');
            $("#" + lstChkID).append(li);
            chkListVerileri[tablo][cleanelement[idColumn]]= cleanelement;
        });
    });
}

function loadPrintTetkikler(){
    firebase.database().ref("tetkikler").once('value').then(function (snapshot) {
        prntVerileri[tetkikler]={};
        var sayac=0;
        var sayac2=0;
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            var contain="<div class='calisan-tetkikler-group-container'>";
            var calisan_tetkikler_group_container="";
            if(sayac%4 !=0 || sayac==0)
            {
                contain+="<div class='group-tetkikler-label'>"+cleanelement["tetkik"]+"</div>";
                contain+=" <div class='group-tetkikler-cevap'><label id='lbl_grp_tetkikler_"+cleanelement["idTetkik"]+"'1></label> </div>";
            }
            else{
                contain+="</div>";
                if(sayac==4 || sayac2%2==0)
                {
                    contain+="<div class='takoz'></div>"
                }
                sayac2++;
            }
            sayac++;
        });
                // var li = $('<li class="list-group-item checkboxfit">'+cleanelement[column]+'<div class="material-switch pull-left"><input id="chkitem' + cleanelement[idColumn] + '"'+event+' name="chk' + tablo+ '" value='+cleanelement[idColumn]+' type="checkbox" /><label for="chkitem' + cleanelement[idColumn] + '" class="label-success"></label></div></li>');
                $("#prnt_hastane").append(contain);
    });
}



function exceleAktar(gridID) {
    $('#' + gridID).tableExport({ type: 'excel', fileName: 'NEKTAR' });
}

function pdfeAktar(gridID) {
    $('#' + gridID).tableExport({ type: 'pdf', fileName: 'NEKTAR' });
}

function wordeAktar(gridID) {
    $('#' + gridID).tableExport({ type: 'doc', fileName: 'NEKTAR' });
}

function pngyeAktar(gridID) {
    $('#' + gridID).tableExport({ type: 'png', fileName: 'NEKTAR' });
}

function csvyeAktar(gridID) {
    $('#' + gridID).tableExport({ type: 'csv', fileName: 'NEKTAR' });
}


function validateRequiredFields(){
    var allright=true;
    $(".required").each(function(r){
        if(this.value===""){
            $("#"+this.id).addClass("invalid");
            allright=false;
        }else{
            $("#"+this.id).removeClass("invalid");
        }
    }); 

    $(".requireddrp").each(function(r){
        if(this.value==="0"){
            $("#"+this.id).addClass("invalid");
            allright=false;
        }else{
            $("#"+this.id).removeClass("invalid");
        }
    }); 
    
    return allright;
}

function validateNumberFields(){

    var allright=true;


    $(".isnumber").each(function(n){
        var num=parseFloat(this.value);
        if(isNan(this.value) || num==0){
            $("#"+this.id).addClass("invalid");
            allright = false;
        }else{
            $("#"+this.id).removeClass("invalid");
        }
    });

    return allright;
}

function validateFields(){
    var statusreq=validateRequiredFields();
    var statusnum=validateRequiredFields();

    return statusreq && statusnum;
}


// function kaydetTetkikBilgisi() {
//     var d = new Date();
//     var n = d.getTime()

//     var tetkik = $("#txtTetkik").val();
//     var idTetkik = generateID(tetkik);

//     if($("#hdnId").val()!=='' ||$("#hdnId").val()!==null )
//     idTetkik=$("#hdnId").val();

//     var fiyat = $("#txtFiyat").val();
//     var uygulamaTuru = $("input:radio[name='rdUygulamaTuru']:checked").val();
//     var $input = $('input[name="rdUygulamaTuru"]:checked');
//     var text = $('label[for=' + $input.attr('id') + ']').text();
//     var uygulamaTuruAdi = "" + text;


//     var veri = {
//         "idTetkik": idTetkik,
//         "tetkik": tetkik,
//         "fiyat": fiyat,
//         "uygulamaTuru": uygulamaTuru,
//         "uygulamaTuruAdi": uygulamaTuruAdi,
//         "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
//     }

//     kaydetVeritabani("tetkikler", idTetkik, veri);

// }

