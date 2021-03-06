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
    if (dosya != null) {
    var storageRef = firebase.storage().ref();
    storageRef.child(klasor).child(id).put(dosya).then(function (snapshot) {
        msgInfo("Başarılı", "Dosyanız yüklendi. İşleminize devam edebilirsiniz..");
    });
}
}

function resimGoster(klasor, id, imgID) {
    var img = $("#" + imgID);
    var storageRef = firebase.storage().ref();
    storageRef.child(klasor).child(id).getDownloadURL().then(function (url) {
        img.attr("src", url);
    }).catch(function (error) {
        console.log(error);
        img.attr("src", "../css/images/no-picture.png");
    });
}

function resimTemizle(imgID) {
    // var img = $("#" + imgID);
    $("#"+imgID).attr("src", "../css/images/no-picture.png");
    // img.src = "";
    // img.remove('src');
}

function generateID(text) {
    var d = new Date();
    var n = GetTimeStamp(d);
    text = text.replace(/[^\x00-\x7F]/g, "").split(' ').join('') + n;
    text = text.replace(/[{()}]/g, '');
    text = text.replace(/[\[\]']+/g, '');
    text = text.replace(/\(|\)/g, '')
    return text;
}

$("#a_signout").click(function(){
    firebase.auth().signOut().then(function() {
        Response.redirect("index.html");
      }).catch(function(error) {
          alert("Hata :" +error);
      });
});

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



function GetTimeStamp(dt)
{
    var newdate =$.datepicker.formatDate('dd/MM/yy', dt);
    var timestmp =Date.parse(newdate);
    
    return timestmp;
}
function listTable(tablo) {

    return firebase.database().ref(tablo).once('value').then(function (snapshot) {
        //console.log(snapshot.val());
    });
}

function LoadDrop(dropId, id, text, tablo, selected) {
    firebase.database().ref(tablo).once('value').then(function (snapshot) {

        $('#' + dropId).empty();
        $('#' + dropId)
        .find('option')
        .end()
        .append('<option value="0">Seçiniz</option>');

        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            if (selected === cleanelement[id])
                $("#" + dropId).append("<option value=" + cleanelement[id] + " selected>" + cleanelement[text] + "</option>");
            else
                $("#" + dropId).append("<option value=" + cleanelement[id] + ">" + cleanelement[text] + "</option>");
        });
    });
}

var chkListVerileri = {};

function loadListVerileri(idColumn, tablo) {
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
        chkListVerileri[tablo] = {};
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            chkListVerileri[tablo][cleanelement[idColumn]] = cleanelement;
        });
    });
}


function loadCheckBoxList(lstChkID, idColumn, column, tablo, event) {
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
        chkListVerileri[tablo] = {};
        $("#" + lstChkID).empty();
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            var li = $('<li class="list-group-item checkboxfit">' + cleanelement[column] + '<div class="material-switch pull-left"><input id="chkitem' + cleanelement[idColumn] + '"' + event + ' name="chk' + tablo + '" value=' + cleanelement[idColumn] + ' type="checkbox" /><label for="chkitem' + cleanelement[idColumn] + '" class="label-success"></label></div></li>');
            $("#" + lstChkID).append(li);
            chkListVerileri[tablo][cleanelement[idColumn]] = cleanelement;
        });
    });
}
function loadCheckedList(lstChkID, idColumn, column, tablo, event) {
    tablo= 'tetkiktalepformlari';
    firebase.database().ref(tablo).once('value').then(function (snapshot) {
        chkListVerileri[tablo] = {};
        $("#" + lstChkID).empty();
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            var li = $('<li class="list-group-item checkboxfit">' + cleanelement['seciliTetkikler'] + '<div class="material-switch pull-left"><input id="chkitem' + cleanelement[idColumn] + '"' + event + ' name="chk' + tablo + '" value=' + cleanelement[idColumn] + ' type="checkbox" /><label for="chkitem' + cleanelement[idColumn] + '" class="label-success"></label></div></li>');
            $("#" + lstChkID).append(li);
            chkListVerileri[tablo][cleanelement[idColumn]] = cleanelement;
        });
    });
}

function loadPrintTetkikler() {
    firebase.database().ref("tetkikler").once('value').then(function (snapshot) {
        var sayac = 1;
        var sayac2 = 0;
        var contain = "<div class='calisan-tetkikler-group-container'>";
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));

            contain += "<div class='group-tetkikler-label'>" + cleanelement["tetkik"] + "</div>";
            contain += " <div class='group-tetkikler-cevap'><label id='lbl_grp_tetkikler_1_" + cleanelement["idTetkik"] + "'></label> </div>";

            if (sayac % 4 == 0 && sayac != 0) {
                contain += "</div>";
                if (sayac2 % 2 == 0) {
                    contain += "<div class='takoz'></div><div class='calisan-tetkikler-group-container'>"
                }
                else {
                    contain += "<div class='calisan-tetkikler-group-container'>";
                }
                sayac2++;
            }

            sayac++;
        });
        // var li = $('<li class="list-group-item checkboxfit">'+cleanelement[column]+'<div class="material-switch pull-left"><input id="chkitem' + cleanelement[idColumn] + '"'+event+' name="chk' + tablo+ '" value='+cleanelement[idColumn]+' type="checkbox" /><label for="chkitem' + cleanelement[idColumn] + '" class="label-success"></label></div></li>');
        $("#prnt_hastane").append(contain);
        $("#prnt_nektar").append(contain.replace('_1_', '_2_'));
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


function validateRequiredFields() {
    var allright = true;
    $(".required").each(function (r) {
        if (this.value === "") {
            $("#" + this.id).addClass("invalid");
            allright = false;
        } else {
            $("#" + this.id).removeClass("invalid");
        }
    });

    $(".requireddrp").each(function (r) {
        if (this.value === "0") {
            $("#" + this.id).addClass("invalid");
            allright = false;
        } else {
            $("#" + this.id).removeClass("invalid");
        }
    });

    return allright;
}

function validateNumberFields() {

    var allright = true;


    $(".isnumber").each(function (n) {
        var num = parseFloat(this.value);
        if (isNan(this.value) || num == 0) {
            $("#" + this.id).addClass("invalid");
            allright = false;
        } else {
            $("#" + this.id).removeClass("invalid");
        }
    });

    return allright;
}

function validateFields() {
    var statusreq = validateRequiredFields();
    var statusnum = validateRequiredFields();

    return statusreq && statusnum;
}


function popoverBtnDeleteCommandHtml(rowid) {

    //data-container=\"body\" 
    var popoverDeleteCommandHtml = "data-html=\"true\" data-original-title=\"Onaylıyormusunuz ?\" data-toggle=\"popover\" data-placement=\"top\" data-content='<button id=\"btndel" + rowid + "\" type=\"button\" onclick=\"triggerDelete(this);return false;\" class=\"btn btn-success btn-block\" data-row-id=\"" + rowid + "\">Seçili Kaydı Sil</button>'";
    var btnhtml = "<button id='btn" + rowid + "' type=\"button\" onclick='showConfirmation(this);' class=\"btn btn-xs btn-default\" " + popoverDeleteCommandHtml + "><span class=\"fa fa-trash-o\"></span></button>";
    return btnhtml;
}

function showConfirmation(btn) {
    $("#" + btn.id).popover();
}

function triggerDelete(btn) {
    $("#tbl" + btn.id).trigger("click");
}

$('body').on('click', function (e) {
    if ($(e.target).data('toggle') !== 'popover'
        && $(e.target).parents('.popover.in').length === 0) {
        $('[data-toggle="popover"]').popover('hide');
    }
});


