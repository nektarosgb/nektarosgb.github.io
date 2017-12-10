function initLoadedPage_calisan_islemleri() {

    $("#hdnId").val('');

    LoadDrop('drpIsyeri', 'idSirket', 'sirketAdi', 'sirketler', '0');
    LoadDrop('drpMeslek', 'idMeslek', 'meslek', 'meslekler', '0');

    $("#drpIsyeri").change(function () {

        var selectedID = this.selectedOptions[0].value;

        if (selectedID == '0') {
            $("#hdnIdSirket").val('');
            clearAllFieldsCalisan();
            return;
        } else {
            $("#hdnIdSirket").val(selectedID);
            $("#txtCalisanIsyeri").val($("#drpIsyeri").children("option:selected").text());
        }
    });

    $("#drpMeslek").change(function () {

        var selectedID = this.selectedOptions[0].value;

        if (selectedID == '0') {
            $("#hdnIdMeslek").val('');
            clearAllFieldsCalisan();
            return;
        } else {
            $("#hdnIdMeslek").val(selectedID);
        }
    });



    var grid = $("#grid-calisanlar").bootgrid({
        ajax: false,
        formatters: {
            "commands": function (column, row) {
                return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-pencil\"></span></button> " +
                    "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-trash-o\"></span></button>";
                    popoverBtnDeleteCommandHtml(row.idCalisan)+
                    "<button id=\"tblbtndel"+ row.idCalisan +"\" type=\"button\" class=\"btn btn-xs btn-default command-delete hide\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-trash-o\"></span></button>";
                    
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
            firebase.database().ref().child("tetkiktalepformlari").child(id).remove();
            initLoadedPage_tetkik_talep_formu();
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

    setHeader("Çalışan İşlemleri");

    $("#frm_calisan").validate();
    $("#frm_calisan").validate({
        rules: {
            txtCalisanAdi: "required",
            drpMeslek: "required",
            txtCalisanTCNo:"required"
        },
        messages: {
            txtCalisanAdi: "Lütfen Çalışan İsmi Giriniz",
            drpMeslek: "Lütfen Çalışana Ait Meslek Seçiniz",
            txtCalisanTCNo:"Lütfen Çalışana Ait TC No Giriniz"
        }
    });
    $("#btn_CalisanKaydet").click( function() {
        if(!validateFields()){
            return false;
        }
        //$("#frm_calisan").valid();
        var d = new Date();
        var n = d.getTime()
    
        var calisanAdi = $("#txtCalisanAdi").val();
        var idCalisan = generateID(calisanAdi);
        if ($("#hdnId").val().trim().length > 0) {
            idCalisan = $("#hdnId").val();
        }
    
        var calisanMeslekKodu = $("#hdnIdMeslek").val();
        var calisanAdresi = $("#txtCalisanAdresi").val();
        var calisanTelefon = $("#txtCalisanTelefon").val();
        var calisanSGKSicilNo = $("#txtCalisanSGKSicilNo").val();
        var calisanTCNo = $("#txtCalisanTCNo").val();
        var calisanTelefonCep = $("#txtCalisanTelefonCep").val();
        var calisanEposta = $("#txtCalisanEposta").val();
        var calisanIsyeriKodu = $("#hdnIdSirket").val();
        var calisanIsyeri = $("#txtCalisanIsyeri").val();
        var dosya = $("#fileCalisan")[0].files[0];
    
        //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)
    
        var veri = {
            "idCalisan": idCalisan,
            "calisanAdi": calisanAdi,
            "calisanMeslekKodu": calisanMeslekKodu,
            "calisanAdresi": calisanAdresi,
            "calisanTelefon": calisanTelefon,
            "calisanSGKSicilNo": calisanSGKSicilNo,
            "calisanTCNo": calisanTCNo,
            "calisanTelefonCep": calisanTelefonCep,
            "calisanEposta": calisanEposta,
            "calisanIsyeri": calisanIsyeri,
            "calisanIsyeriKodu": calisanIsyeriKodu,
            "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
        }
    
        kaydetVeritabani("calisanlar", idCalisan, veri);
        dosyaYukle(dosya, 'calisanlar', idCalisan);
    
        initLoadedPage_calisan_islemleri();
    });
}


function setEditRowCalisan(id) {
    firebase.database().ref('/calisanlar/' + id).once('value').then(function (snapshot) {
        if (snapshot == null) {

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


        // $("#drpSirket").val(snapshot.val().calisanIsyeriKodu).change();
        ///$("#drpSirket").find("option[value=" + snapshot.val().calisanIsyeriKodu +"]").attr('selected', true);
        $("#hdnIdSirket").val(snapshot.val().calisanIsyeriKodu);

        LoadDrop('drpIsyeri', 'idSirket', 'sirketAdi', 'sirketler', snapshot.val().calisanIsyeriKodu);
        LoadDrop('drpMeslek', 'idMeslek', 'meslek', 'meslekler', snapshot.val().calisanMeslekKodu);

        $("#fileCalisan").val('');
        resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");
        $('#myModal').modal('show');
    });
}

function kaydetCalisanBilgileri() {


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
    $("#hdnIdSirket").val('');
    resimTemizle("imgCalisan");
}