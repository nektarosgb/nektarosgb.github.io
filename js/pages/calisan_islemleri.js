function initLoadedPage_calisan_islemleri() {
    
        $("#hdnId").val('');
        var grid = $("#grid-calisanlar").bootgrid({
            ajax: false,
            formatters: {
                "commands": function (column, row) {
                    return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-pencil\"></span></button> " +
                        "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-trash-o\"></span></button>";
                }
            }
        }).on("loaded.rs.jquery.bootgrid", function () {
            /* Executes after data is loaded and rendered */
            grid.find(".command-edit").on("click", function (e) {
                var lstVeri = listTable("calisanlar");
                var id = $(this).data("row-id");
                setEditRowCalisan(id);
                // $(this).bootgrid("reload");
    
            }).end().find(".command-delete").on("click", function (e) {
                var id = $(this).data("row-id");
                firebase.database().ref().child("calisanlar").child(id).remove();
                initLoadedPage_calisan_islemleri();
            });
        });
    
        firebase.database().ref('calisanlar').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
        
        $("#topheaderId").append("<p>Çalışan Bilgileri</p>");
    }


function setEditRowCalisan(id) {
    firebase.database().ref('/calisanlar/' + id).once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#hdnId").val(snapshot.val().idCalisan);
        $("#txtCalisanAdi").val(snapshot.val().calisanAdi);
        $("#txtCalisanAdresi").val(snapshot.val().calisanAdresi);
        $("#txtCalisanTelefon").val(snapshot.val().calisanTelefon);
        $("#txtCalisanSGKSicilNo").val(snapshot.val().calisanSGKSicilNo);
        $("#txtCalisanTCNo").val(snapshot.val().calisanTCNo);
        $("#txtCalisanTelefonCep").val(snapshot.val().calisanTelefonCep);
        $("#txtCalisanEposta").val(snapshot.val().calisanEposta);
        $("#txtCalisanIsyeri").val(snapshot.val().calisanIsyeri);
        $("#fileCalisan").val('');  
        resimGoster("calisanlar",snapshot.val().idCalisan,"imgCalisan");     
        $('#myModal').modal('show');
    });
}

function kaydetCalisanBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var calisanAdi = $("#txtCalisanAdi").val();
    var idCalisan = calisanAdi.replace(/[^\x00-\x7F]/g, "") + n;
    if ($("#hdnId").val().trim().length >0){
        idCalisan = $("#hdnId").val();
    }
        
    var calisanAdresi = $("#txtCalisanAdresi").val();
    var calisanTelefon = $("#txtCalisanTelefon").val();
    var calisanSGKSicilNo = $("#txtCalisanSGKSicilNo").val();
    var calisanTCNo = $("#txtCalisanTCNo").val();
    var calisanTelefonCep = $("#txtCalisanTelefonCep").val();
    var calisanEposta = $("#txtCalisanEposta").val();
    var calisanIsyeri = $("#txtCalisanIsyeri").val();
    var dosya = $("#fileCalisan")[0].files[0];

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
    dosyaYukle(dosya, 'calisanlar', idCalisan);

    initLoadedPage_calisan_islemleri();

}


function clearAllFieldsCalisan() {
    $("#hdnId").val('');
    $("#txtCalisanAdi").val("");
    $("#txtCalisanAdresi").val('');
    $("#txtCalisanTelefon").val('');
    $("#txtCalisanSGKSicilNo").val('');
    $("#txtCalisanTCNo").val('');
    $("#txtCalisanTelefonCep").val('');
    $("#txtCalisanEposta").val('');
    $("#txtCalisanIsyeri").val('');
    $("#fileCalisan").val('');
    resimTemizle("imgCalisan");
}