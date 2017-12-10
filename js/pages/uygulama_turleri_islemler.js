function initLoadedPage_uygulama_turleri_islemleri() {
    
        $("#hdnId").val('');
        var grid = $("#grid-uygulamaTurleri").bootgrid({
            ajax: false,
            formatters: {
                "commands": function (column, row) {
                    return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idUygulamaTuru + "\"><span class=\"fa fa-pencil\"></span></button> " +
                        "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idUygulamaTuru + "\"><span class=\"fa fa-trash-o\"></span></button>";

                        popoverBtnDeleteCommandHtml(row.idUygulamaTuru)+
                        "<button id=\"tblbtndel"+ row.idUygulamaTuru +"\" type=\"button\" class=\"btn btn-xs btn-default command-delete hide\" data-row-id=\"" + row.idUygulamaTuru + "\"><span class=\"fa fa-trash-o\"></span></button>";
                }
            }
        }).on("loaded.rs.jquery.bootgrid", function () {
            /* Executes after data is loaded and rendered */
            grid.find(".command-edit").on("click", function (e) {
                var lstVeri = listTable("uygulama_turleri");
                var id = $(this).data("row-id");
                setEditRowUygulamaTurleri(id);
                // $(this).bootgrid("reload");
    
            }).end().find(".command-delete").on("click", function (e) {
                var id = $(this).data("row-id");
                firebase.database().ref().child("uygulama_turleri").child(id).remove();
                initLoadedPage_uygulama_turleri_islemleri();
            });
        });
    
        firebase.database().ref('uygulama_turleri').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
        setHeader("Uygulama Türleri");
    }


function setEditRowUygulamaTurleri(id) {
    firebase.database().ref('/uygulama_turleri/' + id).once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#hdnId").val(snapshot.val().idUygulamaTuru);
        $("#txtUygulamaTuru").val(snapshot.val().uygulamaTuru);
        $("#txtUygulamaTuruAciklama").val(snapshot.val().uygulamaTuruAciklama);       
        $('#myModal').modal('show');
    });
}


function kaydetUygulamaTuruBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var uygulamaTuru = $("#txtUygulamaTuru").val();



    var idUygulamaTuru = generateID(uygulamaTuru);
    if ($("#hdnId").val().trim().length >0){
        idUygulamaTuru = $("#hdnId").val();
    }

    var uygulamaTuruAciklama = $("#txtUygulamaTuruAciklama").val();

    var veri = {
        "idUygulamaTuru": idUygulamaTuru,
        "uygulamaTuru": uygulamaTuru,
        "uygulamaTuruAciklama": uygulamaTuruAciklama,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("uygulama_turleri", idUygulamaTuru, veri);
    initLoadedPage_uygulama_turleri_islemleri();
}



function clearAllFieldsUygulamaTurleri() {
    $("#hdnId").val('');
    $("#txtUygulamaTuru").val("");
    $("#txtUygulamaTuruAciklama").val('');    
}