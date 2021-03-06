function initLoadedPage_meslek_islemleri() {
    
        $("#hdnId").val('');
        var grid = $("#grid-meslekler").bootgrid({
            ajax: false,
            caseSensitive: false,
            formatters: {
                "commands": function (column, row) {
                    return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idMeslek + "\"><span class=\"fa fa-pencil\"></span></button> " +
                        popoverBtnDeleteCommandHtml(row.idMeslek)+
                        "<button id=\"tblbtndel"+ row.idMeslek +"\" type=\"button\" class=\"btn btn-xs btn-default command-delete hide\" data-row-id=\"" + row.idMeslek + "\"><span class=\"fa fa-trash-o\"></span></button>";
                }
            }
        }).on("loaded.rs.jquery.bootgrid", function () {
            /* Executes after data is loaded and rendered */
            grid.find(".command-edit").on("click", function (e) {
                var lstVeri = listTable("meslekler");
                var id = $(this).data("row-id");
                setEditRowMeslek(id);
                // $(this).bootgrid("reload");
    
            }).end().find(".command-delete").on("click", function (e) {
                var id = $(this).data("row-id");
                firebase.database().ref().child("meslekler").child(id).remove();
                initLoadedPage_meslek_islemleri();
            });
        });
    
        firebase.database().ref('meslekler').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
        
        setHeader("Meslek Kaydı İşlemleri");
    }


function setEditRowMeslek(id) {
    firebase.database().ref('/meslekler/' + id).once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#hdnId").val(snapshot.val().idMeslek);
        $("#txtMeslek").val(snapshot.val().meslek);
        $("#txtMeslekAciklama").val(snapshot.val().meslekAciklama);       
        $('#myModal').modal('show');
    });
}

function kaydetMeslekBilgileri() {
    var d = new Date();
    var n = d.getTime()

    var meslek = $("#txtMeslek").val();
    var idMeslek = generateID(meslek);

    if ($("#hdnId").val().trim().length >0){
        idMeslek = $("#hdnId").val();
    }


    var meslekAciklama = $("#txtMeslekAciklama").val();

    var veri = {
        "idMeslek": idMeslek,
        "meslek": meslek,
        "meslekAciklama": meslekAciklama,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("meslekler", idMeslek, veri);
    initLoadedPage_meslek_islemleri();

}


function clearAllFieldsMeslek() {
    $("#hdnId").val('');
    $("#txtMeslek").val("");
    $("#txtMeslekAciklama").val('');    
}