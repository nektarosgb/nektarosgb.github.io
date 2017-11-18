function initLoadedPage_tetkik_islemleri() {
    
        $("#hdnId").val('');
        var grid = $("#grid-tetkikler").bootgrid({
            ajax: false,
            formatters: {
                "commands": function (column, row) {
                    return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idTetkik + "\"><span class=\"fa fa-pencil\"></span></button> " +
                        "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idTetkik + "\"><span class=\"fa fa-trash-o\"></span></button>";
                }
            }
        }).on("loaded.rs.jquery.bootgrid", function () {
            /* Executes after data is loaded and rendered */
            grid.find(".command-edit").on("click", function (e) {
                var lstVeri = listTable("tetkikler");
                var id = $(this).data("row-id");
                setEditTetkik(id);
                // $(this).bootgrid("reload");
    
            }).end().find(".command-delete").on("click", function (e) {
                var id = $(this).data("row-id");
                firebase.database().ref().child("tetkikler").child(id).remove();
                initLoadedPage_tetkik_islemleri();
            });
        });
    
        firebase.database().ref('tetkikler').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
        
        LoadDrop('drpUygulamaTuru','idTetkik','tetkik','tetkikler','');
        setHeader("Tetkik İşlemleri");
    }


function setEditTetkik(id) {
    firebase.database().ref('/tetkikler/' + id).once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#hdnId").val(snapshot.val().idTetkik);
        $("#txtTetkik").val(snapshot.val().tetkik);
        $("#txtFiyat").val(snapshot.val().fiyat);
        $("#drpUygulamaTuru select").val(snapshot.val().uygulamaTuru);    
        $('#myModal').modal('show');
    });
}

function kaydetCalisanBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var tetkik = $("#txtTetkik").val();
    var idTetkik = tetkik.replace(/[^\x00-\x7F]/g, "") + n;
    if ($("#hdnId").val().trim().length >0){
        idTetkik = $("#hdnId").val();
    }
        
    var fiyat = $("#txtFiyat").val();
    var uygulamaTuru = $("#drpUygulamaTuru").val();

    //(Firma Adı, adresi, tel, SGK sicil No, İlgili Kişi, Cep, Email ve İşyeri Hekimi, İş güvenliği Uzmanı)

    var veri = {
        "idTetkik": idTetkik,
        "tetkik": tetkik,
        "fiyat": fiyat,
        "uygulamaTuru": uygulamaTuru,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("tetkikler", idTetkik, veri);

    initLoadedPage_tetkik_islemleri();

}


function clearAllFieldsCalisan() {
    $("#hdnId").val('');
    $("#txtTetkik").val("");
    $("#txtFiyat").val('');
    $("#drpUygulamaTuru select").val("Seçiniz");   
}