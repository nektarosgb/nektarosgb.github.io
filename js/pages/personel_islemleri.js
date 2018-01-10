function initLoadedPage_personel_islemleri() {

    $("#hdnId").val('');
    var grid = $("#grid-personeller").bootgrid({
        ajax: false,
        formatters: {
            "commands": function (column, row) {
                return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idPersonel + "\"><span class=\"fa fa-pencil\"></span></button> " +
                    "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idPersonel + "\"><span class=\"fa fa-trash-o\"></span></button>";
                    popoverBtnDeleteCommandHtml(row.idPersonel)+
                    "<button id=\"tblbtndel"+ row.idPersonel +"\" type=\"button\" class=\"btn btn-xs btn-default command-delete hide\" data-row-id=\"" + row.idPersonel + "\"><span class=\"fa fa-trash-o\"></span></button>";
            }
        }
    }).on("loaded.rs.jquery.bootgrid", function () {
        /* Executes after data is loaded and rendered */
        grid.find(".command-edit").on("click", function (e) {
            var lstVeri = listTable("personeller");
            var id = $(this).data("row-id");
            setEditRowPersonel(id);
            // $(this).bootgrid("reload");

        }).end().find(".command-delete").on("click", function (e) {
            var id = $(this).data("row-id");
            firebase.database().ref().child("personeller").child(id).remove();
            initLoadedPage_personel_islemleri();
        });
    });

    firebase.database().ref('personeller').once('value').then(function (snapshot) {

        grid.bootgrid("clear");
        var rows = [];
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            cleanelement['id'] = rows.length + 1;
            rows.push(cleanelement);
        });
        grid.bootgrid("append", rows);
    });
    
    setHeader("Personel İşlemleri");

        $('.datepicker').datepicker();
}


function setEditRowPersonel(id) {
    firebase.database().ref('/personeller/' + id).once('value').then(function (snapshot) {
        if (snapshot == null) {
            return;
        }
        $("#hdnId").val(snapshot.val().idPersonel);
        $("#txtPersonelAdi").val(snapshot.val().personelAdi);
        $("#txtPersonelGorevi").val(snapshot.val().personelGorevi);
        $("#txtPersonelKayitTarihi").val(snapshot.val().personelKayitTarihi);
        $("#txtPersonelTCNo").val(snapshot.val().personelTCNo);
        $("#txtPersonelTelefonCep").val(snapshot.val().personelTelefonCep);
        $("#txtPersonelEposta").val(snapshot.val().personelEposta);
        $('#myModal').modal('show');
    });
}

function kaydetPersonelBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var personelAdi = $("#txtPersonelAdi").val();
    var idPersonel = generateID(personelAdi);

    if ($("#hdnId").val().trim().length > 0) {
        idPersonel = $("#hdnId").val();
    }

    var personelGorevi = $("#txtPersonelGorevi").val();
    var personelAdresi = $("#txtPersonelAdresi").val();
    var personelKayitTarihi = $("#txtPersonelKayitTarihi").val();
    var personelTCNo = $("#txtPersonelTCNo").val();
    var personelTelefonCep = $("#txtPersonelTelefonCep").val();
    var personelEposta = $("#txtPersonelEposta").val();

    var veri = {
        "idPersonel": idPersonel,
        "personelAdi": personelAdi,
        "personelGorevi": personelGorevi,
        "personelAdresi": personelAdresi,
        "personelKayitTarihi": personelKayitTarihi,
        "personelTCNo": personelTCNo,
        "personelTelefonCep": personelTelefonCep,
        "personelEposta": personelEposta,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"],
        "kayitTarihi":d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear(),
    }

    kaydetVeritabani("personeller", idPersonel, veri);
    initLoadedPage_personel_islemleri();
}


function clearAllFieldsPersonel() {
    $("#hdnId").val('');
    $("#txtPersonelAdi").val("");
    $("#txtPersonelGorevi").val('');
    $("#txtPersonelKayitTarihi").val('');
    $("#txtPersonelTCNo").val('');
    $("#txtPersonelTelefonCep").val('');
    $("#txtPersonelEposta").val('');
        
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    $('#txtPersonelKayitTarihi').val(today);
}