function initLoadedPage() {
    
        $("#hdnId").val('');
        var grid = $("#grid-sirketler").bootgrid({
            ajax: false,
            formatters: {
                "commands": function (column, row) {
                    return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idSirket + "\"><span class=\"fa fa-pencil\"></span></button> " +
                        "<button type=\"button\" class=\"btn btn-xs btn-default command-delete\" data-row-id=\"" + row.idSirket + "\"><span class=\"fa fa-trash-o\"></span></button>";
                }
            }
        }).on("loaded.rs.jquery.bootgrid", function () {
            /* Executes after data is loaded and rendered */
            grid.find(".command-edit").on("click", function (e) {
                var lstVeri = listTable("sirketler");
                var id = $(this).data("row-id");
                setSirketEditRow(id);
                // $(this).bootgrid("reload");
    
            }).end().find(".command-delete").on("click", function (e) {
                var id = $(this).data("row-id");
                firebase.database().ref().child("sirketler").child(id).remove();
                initLoadedPage();
            });
        });
    
        firebase.database().ref('sirketler').once('value').then(function (snapshot) {
    
            grid.bootgrid("clear");
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
            grid.bootgrid("append", rows);
        });
    }
    
    
    function setSirketEditRow(id) {
        firebase.database().ref('/sirketler/' + id).once('value').then(function (snapshot) {
            $("#hdnId").val(snapshot.val().idSirket);
            $("#txtSirketAdi").val(snapshot.val().sirketAdi);
            $("#txtSirketAdresi").val(snapshot.val().sirketAdresi);
            $("#txtSirketTelefon").val(snapshot.val().sirketTelefon);
            $("#txtSirketSGKSicilNo").val(snapshot.val().sirketSGKSicilNo);
            $("#txtSirketIlgiliKisi").val(snapshot.val().sirketIlgiliKisi);
            $("#txtSirketTelefonCep").val(snapshot.val().sirketTelefonCep);
            $("#txtSirketEposta").val(snapshot.val().sirketEposta);
            $("#txtSirketIsyeriHekimi").val(snapshot.val().sirketIsyeriHekimi);
            $("#txtSirketIsyeriGuvenlikUzmani").val(snapshot.val().sirketIsGuvenligiUzmani);
            $('#myModal').modal('show');
        });
        // ...
    }
    
    function kaydetSirketBilgileri() {
        var d = new Date();
        var n = d.getTime()
    
        var sirketAdi = $("#txtSirketAdi").val();
        var idSirket = firebase.database().ref("sirketler").push().key; //sirketAdi.replace(/[^\x00-\x7F]/g, "") + n;
    
        if ($("#hdnId").val().trim().length >0){
            idSirket = $("#hdnId").val();
        }
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
        initLoadedPage();
    }
    function clearAllFields() {
        $("#hdnId").val('');
        $("#txtSirketAdresi").val("");
        $("#txtSirketAdi").val('');
        $("#txtSirketTelefon").val('');
        $("#txtSirketSGKSicilNo").val('');
        $("#txtSirketIlgiliKisi").val('');
        $("#txtSirketTelefonCep").val('');
        $("#txtSirketEposta").val('');
        $("#txtSirketIsyeriHekimi").val('');
        $("#txtSirketIsGuvenligiUzmani").val('');
    }
    
    
    