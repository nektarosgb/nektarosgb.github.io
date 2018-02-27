function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler', ' onClick="hesaplaToplam();"');    

    $('.datepicker').datepicker();

    $("#drpMuayeneTuru").unbind();
    $("#drpMuayeneTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdMuayeneTuru").val(selectedID);
        $("#hdnMuayeneTuru").val($("#drpMuayeneTuru").children("option:selected").text());
    });

    loadPrintTetkikler();

    $("#drpCariTuru").unbind();
    $("#drpCariTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdCariHesapTuru").val(selectedID);
        $("#hdnCariHesapTuru").val($("#drpCariTuru").children("option:selected").text());
    });
    // $("#btnYazdirHastane").unbind();
    $("#btnYazdirHastane").click(function(){
        var divToPrint=document.getElementById('modalHastane');
        
          var newWin=window.open('','Print-Window');
        
          newWin.document.open();
        
          newWin.document.write('<html><body onload="window.print()">  <link rel="stylesheet" href="../../css/printform/style.css"> <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"> <link rel="stylesheet" href="dist/css/AdminLTE.min.css">'+divToPrint.innerHTML+'</body></html>');
        
           newWin.document.close();
        
        //   setTimeout(function(){newWin.close();},30);
    });
    // $("#btnYazdirNektar").unbind();
    $("#btnYazdirNektar").click(function(){
        var divToPrint=document.getElementById('modalNektar');
        
          var newWin=window.open('','Print-Window');
        
          newWin.document.open();
        
          newWin.document.write('<html><body onload="window.print()">  <link rel="stylesheet" href="../../css/printform/style.css"> <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"> <link rel="stylesheet" href="dist/css/AdminLTE.min.css">'+divToPrint.innerHTML+'</body></html>');
        
           newWin.document.close();
        
        //   setTimeout(function(){newWin.close();},30);
    });
    // $("#btnYazdirSaglik").unbind();
    $("#btnYazdirSaglik").click(function(){       
         var divToPrint=document.getElementById('modalSaglik');
        
    var newWin=window.open('','Print-Window');
  
    newWin.document.open();
  
    newWin.document.write('<html><body onload="window.print()"> <link rel="stylesheet" href="../../css/printform/stylesheet.css">  <link rel="stylesheet" href="../../css/printform/style.css"> <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"> <link rel="stylesheet" href="dist/css/AdminLTE.min.css">'+divToPrint.innerHTML+'</body></html>');
  
     newWin.document.close();
  
    // setTimeout(function(){newWin.close();},30);
});
    

    $("#btnHastane").click(function(){
        var newWindow = window.open("", "", "height=800,width=600,status=yes,toolbar=no,menubar=no,location=no");  
        var divToPrint=document.getElementById('modalHastane');
        newWindow.document.write('<html><body onload="window.print()">  <link rel="stylesheet" href="../../css/printform/style.css"> <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"> <link rel="stylesheet" href="dist/css/AdminLTE.min.css">'+divToPrint.innerHTML+'</body></html>');
        setTimeout(function(){newWindow.close();},10);
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
            doldurCalisanBilgileri(id,true);

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
        // searchSettings: {
        //     delay: 100,
        //     characters: 3,
        //     caseSensitive: false
        // },
        ajax: false,
        caseSensitive: false,
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
            clearPrint();
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



    $("#btn_TetkikTalepFormuKaydet").unbind();
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
        var kayitTarihi=$("#txtTetkikTalepKayitTarihi").val();

        var ucretToplami = parseFloat($("#txtUcretToplami").val());

        var seciliTetkikler = [];
        var d= new Date();
        var timestamp=GetTimeStamp(d);

        $('#divtetkikler input[type="checkbox"]:checked').each(function () {

            var idTetkik = this.value;

            var tetkik = chkListVerileri["tetkikler"][idTetkik];

            seciliTetkikler.push(tetkik);

        });

        

        var idTetkikTalepFormu = generateID(calisanAdi + muayeneTuru);

        var doingUpdate=false;
        if ($("#hdnIdTetkikTalepFormu").val().trim().length > 0) {
            idTetkikTalepFormu = $("#hdnIdTetkikTalepFormu").val();
            doingUpdate=true;
        }

        var bugun = new Date();
        var kayittarihi=$("#txtTetkikTalepKayitTarihi").val();

        var veri = {
            "idTetkikTalepFormu": idTetkikTalepFormu,
            "muayeneTuruKodu": muayeneTuruKodu,
            "muayeneTuru":muayeneTuru,
            "cariHesapTuruKodu": cariHesapTuruKodu,
            "cariHesapTuru": cariHesapTuru,
            "calisanKodu": calisanKodu,
            "calisanAdi": calisanAdi,
            "isyeriKodu": isyeriKodu,
            "isyeriAdi": isyeriAdi,
            "ucretToplami": ucretToplami,
            "seciliTetkikler": seciliTetkikler,
            "tarih": kayittarihi,
            "kayitEden": firebase.auth().currentUser.providerData[0]["email"],
            "kayitTarihi":kayitTarihi,
            "guncellemeTarihi":bugun.getDate()+"/"+(bugun.getMonth()+1)+"/"+bugun.getFullYear(),
            "timestamp":timestamp
        }

        kaydetVeritabani("tetkiktalepformlari", idTetkikTalepFormu, veri);
        initLoadedPage_tetkik_talep_formu();
        return false;
    });

}

function doldurCalisanBilgileri(selectedID,secMeslegeGore) {
    firebase.database().ref('/calisanlar/' + selectedID).once('value').then(function (snapshot) {

        $("#hdnIdCalisan").val(snapshot.val().idCalisan);
        $("#txtCalisanAdi").val(snapshot.val().calisanAdi);
        $("#txtCalisanAdresi").val(snapshot.val().calisanAdresi);
        $("#txtCalisanTelefon").val(snapshot.val().calisanTelefon);
        $("#txtCalisanTCNo").val(snapshot.val().calisanTCNo);
        $("#txtCalisanTelefonCep").val(snapshot.val().calisanTelefonCep);
        $("#txtCalisanEposta").val(snapshot.val().calisanEposta);
        $("#txtCalisanIsyeri").val(snapshot.val().calisanIsyeri);
        $("#hdnIdSirket").val(snapshot.val().calisanIsyeriKodu);

        //Hastane Print Form
        $("#lbl_grp_calisan_adsoyad").empty().append(snapshot.val().calisanAdi);
        $("#lbl_grp_calisan_tckimlikno").empty().append(snapshot.val().calisanTCNo);
        $("#lbl_grp_calisan_gsm").empty().append(snapshot.val().calisanTelefonCep);
        $("#lbl_grp_calisan_telefon").empty().append(snapshot.val().calisanTelefon);
        
        resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisanMuayene");
        //$("#lbl_grp_calisan_gorevi").val(sirket.val().calisanTelefonCep);
        //
        $("#lbl_form_adsoyad").empty().append(snapshot.val().calisanAdi);
        $("#lbl_form_tc").empty().append(snapshot.val().calisanTCNo);
        $("#lbl_form_gsm").empty().append(snapshot.val().calisanTelefonCep);

        //Muayene Formu 
        $("#lbl_pmp_adsoyad").empty().append(snapshot.val().calisanAdi);
        $("#lbl_pmp_tc").empty().append(snapshot.val().calisanTCNo);
        $("#lbl_pmp_tel").empty().append(snapshot.val().calisanTelefonCep);
        $("#lbl_pmp_adres").empty().append(snapshot.val().calisanAdresi);

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
            $("#lbl_grp_calisan_firmaadi").empty().append(sirket.val().sirketAdi);
            $("#lbl_grp_calisan_sgksicilno").empty().append(sirket.val().sirketSGKSicilNo);
            $("#lbl_grp_calisan_adres").empty().append(sirket.val().sirketAdresi);
            $("#lbl_grp_isyeri_telefon").empty().append(sirket.val().sirketTelefon); 
            $("#lbl_grp_calisan_eposta").empty().append(sirket.val().sirketEposta);
            $("#lbl_grp_calisan_yetkiliadi").empty().append(sirket.val().sirketIlgiliKisi);
            $("#lbl_grp_calisan_isyerihekimi").empty().append(sirket.val().sirketIsyeriHekimi);
            $("#lbl_grp_calisan_igu").empty().append(sirket.val().sirketIsGuvenligiUzmani);
            
            //Periyodik Muayene Print

            $("#lbl_pmp_unvan").empty().append(sirket.val().sirketAdi);
            $("#lbl_pmp_adres").empty().append(sirket.val().sirketAdresi);
            $("#lbl_pmp_tel").empty().append(sirket.val().sirketTelefon);
            $("#lbl_pmp_sicil").empty().append(sirket.val().sirketSGKSicilNo);
            $("#lbl_pmp_eposta").empty().append(sirket.val().sirketEposta);


            // Nektar Print
            
        $("#lbl_form_firma").append(snapshot.val().sirketAdi);

        });

        var meslekKodu = snapshot.val().calisanMeslekKodu;
        //var kayitId=snapshot.val().idCalisan;

        if(secMeslegeGore){
            secTetkiktlerMeslegeGore(meslekKodu);
        }
        
        //secTetkiktlerMeslegeGore(kayitId);

        firebase.database().ref('/meslekler/' + meslekKodu).once('value').then(function (meslek) {
            $("#txtCalisanMeslek").val(meslek.val().meslek);
        });
        resimTemizle("imgCalisan");
        resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");

        $("#pnlIsciBilgileri").removeClass("hide");
    });
}

function clearPrint()
{
    $(".lblval").empty();
    $("#lbl_grp_calisan_firmacarivalue").empty();
    $("#lbl_grp_calisan_hst_tutar").empty();
}

function doldurTalepBilgileri(selectedID){

    firebase.database().ref('/tetkiktalepformlari/' + selectedID).once('value').then(function (snapshot) {
            var talepformu=snapshot.val();
            $("#hdnIdTetkikTalepFormu").val(snapshot.val().idTetkikTalepFormu);
            $("#drpMuayeneTuru option").selected=false;
            //$("#drpMuayeneTuru option[value="+talepformu.muayeneTuruKodu+"]").selected=true;
            
            $("#hdnMuayeneTuru").val(talepformu.muayeneTuru);
            $("#drpMuayeneTuru").val(talepformu.muayeneTuruKodu);
            $("#hdnIdMuayeneTuru").val(talepformu.muayeneTuruKodu);

            $("#drpCariTuru").val(talepformu.cariHesapTuruKodu);
            $("#hdnCariHesapTuru").val(talepformu.cariHesapTuru);
            $("#hdnIdCariHesapTuru").val(talepformu.cariHesapTuruKodu);
            
            $("#lbl_grp_calisan_firmacarivalue").append($("#drpMuayeneTuru option[value="+talepformu.muayeneTuruKodu+"]").val());

            $("#drpCariHesapTuru option").selected=false;
            $("#drpCariHesapTuru option[value="+talepformu.muayeneTuruKodu+"]").selected=true;

            $("#txtTetkikTalepKayitTarihi").val(talepformu.kayitTarihi);

            doldurCalisanBilgileri(talepformu.calisanKodu,false);
            
            var hastanefiyat=parseFloat("0.00");
            var osgbfiyat=parseFloat("0.00");

        if(talepformu.seciliTetkikler!=null)
        {
            $("input[type='checkbox']").prop("checked", false);
            talepformu.seciliTetkikler.forEach(function(tetkik) {
                $("#chkitem" + tetkik.idTetkik).prop("checked", true);
                if(tetkik.uygulamaTuru==="GaziHastanesi1511704386506")
                {
                    hastanefiyat+=parseFloat(tetkik.fiyat);
                    $("#lbl_grp_tetkikler_1_"+tetkik.idTetkik).empty(" X");
                    $("#lbl_grp_tetkikler_1_"+tetkik.idTetkik).append(" X");
                }
                else if(tetkik.uygulamaTuru==="BirimdeYaplacak1511704375441")
                {
                    osgbfiyat=osgbfiyat+parseFloat(tetkik.fiyat);
                    $("#lbl_grp_tetkikler_2_"+tetkik.idTetkik).empty(" X");
                    $("#lbl_grp_tetkikler_2_"+tetkik.idTetkik).append(" X");
                }
            });
        }
            $("#lbl_grp_calisan_hst_tutar").append(hastanefiyat+"");

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


function secTetkiktlerMeslegeGore2(meslekKodu) {
    $("input[type='checkbox']").prop("checked", false);
    firebase.database().ref('/tetkiktalepformlari').equalTo(meslekKodu).once('value').then(function (snapshot) {
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            var chcItems = cleanelement['seciliTetkikler'];
            chcItems.forEach(function (items) {
                $("#chkitem" + items.idTetkik).prop("checked", true);
            });
        });

        hesaplaToplam();
    });
}

function hesaplaToplam() {

    var toplam = parseFloat("0.00");

    $('#divtetkikler input[type="checkbox"]:checked').each(function (e) {
        var idTetkik = this.value;
        var txtfiyat = chkListVerileri["tetkikler"][idTetkik]["fiyat"];
        var fiyat = parseFloat(txtfiyat);
        toplam = toplam + fiyat;
    });

    $("#txtUcretToplami").val("" + toplam.toFixed(2));
}


function clearAllFieldsTetkikTalepFormu(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) ;

    $('#txtTetkikTalepKayitTarihi').val(today);
    $("#hdnIdTetkikTalepFormu").val('');

    return false;
}
