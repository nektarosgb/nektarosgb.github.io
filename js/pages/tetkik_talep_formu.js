function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler', ' onClick="hesaplaToplam();"');    

    $("#drpMuayeneTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdMuayeneTuru").val(selectedID);
        $("#hdnMuayeneTuru").val($("#drpMuayeneTuru").children("option:selected").text());
    });
    loadPrintTetkikler();

    $("#drpCariTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdCariTuru").val(selectedID);
        $("#hdnCariTuru").val($("#drpCariTuru").children("option:selected").text());
    });
    $("#btnYazdirHastane").click(function(){
        var divToPrint=document.getElementById('hastaneprint');
        
          var newWin=window.open('','Print-Window');
        
          newWin.document.open();
        
          newWin.document.write('<html><body onload="window.print()">  <link rel="stylesheet" href="../../css/printform/style.css">'+divToPrint.innerHTML+'</body></html>');
        
           newWin.document.close();
        
          setTimeout(function(){newWin.close();},10);
    });

    var gridCalisanlar = $("#grid-calisanlar").bootgrid({
        ajax: false,
        formatters: {
            "commands": function (column, row) {
                return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idCalisan + "\"><span class=\"fa fa-pencil\"></span></button> ";
            }
        }
    }).on("loaded.rs.jquery.bootgrid", function () {
        /* Executes after data is loaded and rendered */
        gridCalisanlar.find(".command-edit").on("click", function (e) {
            var lstVeri = listTable("calisanlar");
            var id = $(this).data("row-id");      
            $("#pnlIsciBilgileri").removeClass("hide");      
            doldurCalisanBilgileri(id);

        }).end();
    });

    firebase.database().ref('calisanlar').once('value').then(function (snapshot) {

        gridCalisanlar.bootgrid("clear");
        var rows = [];
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            cleanelement['id'] = rows.length + 1;
            rows.push(cleanelement);
        });
        gridCalisanlar.bootgrid("append", rows);
    });

    var gridTalepler = $("#grid-tetkiktalepformlari").bootgrid({
        ajax: false,
        formatters: {
            "commands": function (column, row) {
                return "<button type=\"button\" class=\"btn btn-xs btn-default command-edit\" data-row-id=\"" + row.idTetkikTalepFormu + "\"><span class=\"fa fa-pencil\"></span></button> " +               
                popoverBtnDeleteCommandHtml(row.idTetkikTalepFormu)+
                "<button id=\"tblbtndel"+ row.idTetkikTalepFormu +"\" type=\"button\" class=\"btn btn-xs btn-default command-delete hide\" data-row-id=\"" + row.idTetkikTalepFormu + "\"><span class=\"fa fa-trash-o\"></span></button>";
            }
        }
    }).on("loaded.rs.jquery.bootgrid", function () {
        /* Executes after data is loaded and rendered */
        gridTalepler.find(".command-edit").on("click", function (e) {
            var lstVeri = listTable("tetkiktalepformlari");
            var id = $(this).data("row-id");      
            doldurTalepBilgileri(id);
            $('#myModal').modal('show');
            // $('#btnHastane').modal('show');
        }).end().find(".command-delete").on("click", function (e) {            
            var id = $(this).data("row-id");
            firebase.database().ref().child("tetkiktalepformlari").child(id).remove();
            initLoadedPage_tetkik_talep_formu();
        });
    });

    firebase.database().ref('tetkiktalepformlari').once('value').then(function (snapshot) {

        gridTalepler.bootgrid("clear");
        var rows = [];
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            cleanelement['id'] = rows.length + 1;
            rows.push(cleanelement);
        });
        gridTalepler.bootgrid("append", rows);
    });



    $("#btn_TetkikTalepFormuKaydet").click(function () {
        if(!validateFields()){
            return false;
        }
        var muayeneTuruKodu = $("#hdnIdMuayeneTuru").val();
        var muayeneTuru = $("#hdnMuayeneTuru").val();

        var cariHesapTuruKodu = $("#hdnIdCariHesapTuru").val();
        var cariHesapTuru = $("#hdnCariHesapTuru").val();

        var calisanKodu = $("#hdnIdCalisan").val();
        var calisanAdi = $("#txtCalisanAdi").val();

        var isyeriKodu = $("#hdnIdSirket").val();
        var isyeriAdi = $("#txtSirketAdi").val();

        var ucretToplami = parseFloat($("#txtUcretToplami").val());

        var seciliTetkikler = [];

        $('input[type="checkbox"]:checked').each(function () {

            var idTetkik = this.value;

            var tetkik = chkListVerileri["tetkikler"][idTetkik];

            seciliTetkikler.push(tetkik);

        });


        var idTetkikTalepFormu = generateID(calisanAdi + muayeneTuru);

        var bugun = new Date();

        var veri = {
            "idTetkikTalepFormu": idTetkikTalepFormu,
            "muayeneTuruKodu": muayeneTuruKodu,
            "cariHesapTuruKodu": cariHesapTuruKodu,
            "cariHesapTuru": cariHesapTuru,
            "calisanKodu": calisanKodu,
            "calisanAdi": calisanAdi,
            "isyeriKodu": isyeriKodu,
            "isyeriAdi": isyeriAdi,
            "ucretToplami": ucretToplami,
            "seciliTetkikler": seciliTetkikler,
            "tarih": bugun,
            "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
        }

        kaydetVeritabani("tetkiktalepformlari", idTetkikTalepFormu, veri);

        return false;
    });

}

function doldurCalisanBilgileri(selectedID) {
    firebase.database().ref('/calisanlar/' + selectedID).once('value').then(function (snapshot) {

        $("#hdnIdCalisan").val(snapshot.val().idCalisan);
        $("#txtCalisanAdi").val(snapshot.val().calisanAdi);
        $("#txtCalisanAdresi").val(snapshot.val().calisanAdresi);
        $("#txtCalisanTelefon").val(snapshot.val().calisanTelefon);
        $("#txtCalisanSGKSicilNo").val(snapshot.val().calisanSGKSicilNo);
        $("#txtCalisanTCNo").val(snapshot.val().calisanTCNo);
        $("#txtCalisanTelefonCep").val(snapshot.val().calisanTelefonCep);
        $("#txtCalisanEposta").val(snapshot.val().calisanEposta);
        $("#txtCalisanIsyeri").val(snapshot.val().calisanIsyeri);

        //Hastane Print Form
        $("#lbl_grp_calisan_adsoyad").val(snapshot.val().calisanAdi);
        $("#lbl_grp_calisan_tckimlikno").val(snapshot.val().calisanTCNo);
        $("#lbl_grp_calisan_gsm").val(snapshot.val().calisanTelefonCep);
        $("#lbl_grp_calisan_telefon").val(snapshot.val().calisanTelefon);
        //$("#lbl_grp_calisan_gorevi").val(sirket.val().calisanTelefonCep);
        //

        var isyeriKodu = snapshot.val().calisanIsyeriKodu;

        firebase.database().ref('/sirketler/' + isyeriKodu).once('value').then(function (sirket) {
            $("#txtSirketAdi").val(sirket.val().sirketAdi);
            $("#txtSirketAdresi").val(sirket.val().sirketAdresi);
            $("#txtSirketTelefon").val(sirket.val().sirketTelefon);
            $("#txtSirketSGKSicilNo").val(sirket.val().sirketSGKSicilNo);
            $("#txtSirketIlgiliKisi").val(sirket.val().sirketIlgiliKisi);
            $("#txtSirketTelefonCep").val(sirket.val().sirketTelefonCep);
            $("#txtSirketEposta").val(sirket.val().sirketEposta);
            $("#txtSirketIsyeriHekimi").val(sirket.val().sirketIsyeriHekimi);
            $("#txtSirketIsyeriGuvenlikUzmani").val(sirket.val().sirketIsGuvenligiUzmani);

            //Hastane Print
            $("#lbl_grp_calisan_firmaadi").val(sirket.val().sirketAdi);
            $("#lbl_grp_calisan_sgksicilno").val(sirket.val().sirketSGKSicilNo);
            $("#lbl_grp_calisan_adres").val(sirket.val().sirketAdresi);
            $("#lbl_grp_isyeri_telefon").val(sirket.val().sirketTelefon); lbl_grp_isyeri_telefon
            $("#lbl_grp_calisan_eposta").val(sirket.val().sirketEposta);
            $("#lbl_grp_calisan_yetkiliadi").val(sirket.val().sirketIlgiliKisi);
            $("#lbl_grp_calisan_isyerihekimi").val(sirket.val().sirketIsyeriHekimi);
            $("#lbl_grp_calisan_igu").val(sirket.val().sirketIsGuvenligiUzmani);
            
            //
        });

        var meslekKodu = snapshot.val().calisanMeslekKodu;

        secTetkiktlerMeslegeGore(meslekKodu);

        firebase.database().ref('/meslekler/' + meslekKodu).once('value').then(function (meslek) {
            $("#txtCalisanMeslek").val(meslek.val().meslek);
        });

        resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");

        $("#pnlIsciBilgileri").removeClass("hide");
    });
}

function doldurTalepBilgileri(selectedID){
    firebase.database().ref('/tetkiktalepformlari/' + selectedID).once('value').then(function (snapshot) {
            var talepformu=snapshot.val();

            $("#drpMuayeneTuru option").selected=false;
            $("#drpMuayeneTuru option[value="+talepformu.muayeneTuruKodu+"]").selected=true;

            $("#lbl_grp_calisan_muayeneturu").append($("#drpMuayeneTuru option[value="+talepformu.muayeneTuruKodu+"]").val());

            $("#drpCariHesapTuru option").selected=false;
            $("#drpCariHesapTuru option[value="+talepformu.muayeneTuruKodu+"]").selected=true;

            doldurCalisanBilgileri(talepformu.calisanKodu);
            
            var hastanefiyat=parseFloat("0.00");
            var osgbfiyat=0;

            talepformu.seciliTetkikler.forEach(function(tetkik) {
                $("#chkitem" + tetkik.tetkik).prop("checked", true);
                if(tetkik.uygulamaTuru==="GaziHastanesi1511704386506")
                {
                    hastanefiyat+=tetkik.fiyat;
                    $("#lbl_grp_tetkikler_1_"+tetkik.idTetkik).append(" X");
                }
                else if(tetkik.uygulamaTuru==="BirimdeYaplacak1511704375441")
                {
                    osgbfiyat=osgbfiyat+tetkik.fiyat;
                    console.log("fiyat",osgbfiyat);
                    // $("#lbl_grp_tetkikler_"+tetkik.idTetkik).append("X");
                }
            });
            $("#lbl_hst_tutar").append(hastanefiyat+"");

            hesaplaToplam();
    });
}

function secTetkiktlerMeslegeGore(meslekKodu) {
    $("input[type='checkbox']").prop("checked", false);
    firebase.database().ref('Meslektetkikler').orderByChild('meslek').equalTo(meslekKodu).once('value').then(function (snapshot) {
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));

            $("#chkitem" + cleanelement.tetkik).prop("checked", true);
        });

        hesaplaToplam();
    });
}

function hesaplaToplam() {

    var toplam = parseFloat("0.00");

    $('input[type="checkbox"]:checked').each(function () {

        var idTetkik = this.value;

        var txtfiyat = chkListVerileri["tetkikler"][idTetkik]["fiyat"];
        var fiyat = parseFloat(txtfiyat);

        toplam = toplam + fiyat;

    });

    $("#txtUcretToplami").val("" + toplam.toFixed(2));
}


function clearAllFieldsTetkikTalepFormu(){
    return false;
}
