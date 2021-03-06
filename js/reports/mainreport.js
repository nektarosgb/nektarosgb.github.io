
function initLoadedPage_main_report() {

    $('.datepicker1').datepicker();
    $('.datepicker2').datepicker();

    loadListVerileri('idTetkik', 'tetkikler');
    loadListVerileri('idUygulamaturu', 'uygulama_turleri');
    loadListVerileri('idSirket', 'sirketler');

    

    $('#btnMainReportYukle').click(function () {
        var t1 = GetTimeStamp($('.datepicker1').datepicker('getDate'));//$('.datepicker1').datepicker('getDate').getTime();
        var t2 = GetTimeStamp($('.datepicker2').datepicker('getDate'));
        loadRptYeniKayitlar(t1, t2);
        loadRptTetkik(t1, t2);
        return false;
    });
}

function loadRptTetkik(t1, t2) {

    var gridfirmalaragore = $("#grid-firmalaragore").bootgrid({
        ajax: false,
        caseSensitive: false        
    });

    var gridcarihesaplaragore = $("#grid-carihesaplaragore").bootgrid({
        ajax: false,
        caseSensitive: false        
    });


    var gridmuayeneturunegore = $("#grid-muayeneturunegore").bootgrid({
        ajax: false,
        caseSensitive: false        
    });

    var griduygulamaturunegore = $("#grid-uygulamaturunegore").bootgrid({
        ajax: false,
        caseSensitive: false        
    });


    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        var tetkikSay = 0;
        var toplamTutar = parseFloat("0.00");

        var firmabasina={};
        var carihesapagore={};
        var muayeneTuruneGore={};
        var uygulamaTuruneGore={};


        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            if (cleanelement.seciliTetkikler != null) {

                if(firmabasina[cleanelement.isyeriKodu]==null){
                    firmabasina[cleanelement.isyeriKodu]={
                        "isyeriKodu":cleanelement.isyeriKodu,
                        "isyeriAdi":cleanelement.isyeriAdi,
                        "talepFormuSay":0,
                        "tetkikSay":0,
                        "talepFormuTutar":0.0
                    };
                }

                if(carihesapagore[cleanelement.cariHesapTuruKodu]==null){
                    carihesapagore[cleanelement.cariHesapTuruKodu]={
                        "cariHesapTuruKodu":cleanelement.cariHesapTuruKodu,
                        "cariHesapTuru":cleanelement.cariHesapTuru,
                        "talepFormuSay":0,
                        "tetkikSay":0,
                        "talepFormuTutar":0.0
                    };
                }

                if(muayeneTuruneGore[cleanelement.muayeneTuruKodu]==null){
                    muayeneTuruneGore[cleanelement.muayeneTuruKodu]={
                        "muayeneTuruKodu":cleanelement.muayeneTuruKodu,
                        "muayeneTuru":cleanelement.muayeneTuru,
                        "talepFormuSay":0,
                        "tetkikSay":0,
                        "talepFormuTutar":0.0
                    };
                }

                

                var array = $.map(cleanelement.seciliTetkikler, function(value, index) {
                    return [value];
                });

                tetkikSay+=array.length;
                firmabasina[cleanelement.isyeriKodu]["tetkikSay"]+=array.length;
                firmabasina[cleanelement.isyeriKodu]["talepFormuSay"]++;
                carihesapagore[cleanelement.cariHesapTuruKodu]["tetkikSay"]+=array.length;
                carihesapagore[cleanelement.cariHesapTuruKodu]["talepFormuSay"]++;
                muayeneTuruneGore[cleanelement.muayeneTuruKodu]["tetkikSay"]+=array.length;
                muayeneTuruneGore[cleanelement.muayeneTuruKodu]["talepFormuSay"]++;
    
                var aratop=parseFloat("0.00");
                array.forEach(function (item) {
                    var txtfiyat = ""+item.fiyat;
                    var fiyat = parseFloat(txtfiyat);
                    aratop = aratop + fiyat;

                    if(uygulamaTuruneGore[item.uygulamaTuru]==null){
                        uygulamaTuruneGore[item.uygulamaTuru]={
                            "uygulamaTuruKodu":item.uygulamaTuru,
                            "uygulamaTuru":item.uygulamaTuru,
                            "tetkikSay":0,
                            "talepFormuTutar":0.0
                        };
                    }

                    uygulamaTuruneGore[item.uygulamaTuru]["tetkikSay"]++;
                    uygulamaTuruneGore[item.uygulamaTuru]["talepFormuTutar"]+=fiyat;

                });
                firmabasina[cleanelement.isyeriKodu]["talepFormuTutar"]+=aratop;
                carihesapagore[cleanelement.cariHesapTuruKodu]["talepFormuTutar"]+=aratop;
                muayeneTuruneGore[cleanelement.muayeneTuruKodu]["talepFormuTutar"]+=aratop;
                toplamTutar = toplamTutar + aratop;
            }
        });
        $("#txtTetkikSayisi").text(tetkikSay);
        $("#txtTetkikToplamTutar").text(toplamTutar);

        var firmabasinaarr = $.map(firmabasina, function(value, index) {
            return [value];
        });
        gridfirmalaragore.bootgrid("append", firmabasinaarr);


        var carihesapagorearr = $.map(carihesapagore, function(value, index) {
            return [value];
        });

        gridcarihesaplaragore.bootgrid("append", carihesapagorearr);

        var muayeneTuruneGorearr = $.map(muayeneTuruneGore, function(value, index) {
            return [value];
        });

        gridmuayeneturunegore.bootgrid("append",muayeneTuruneGorearr);


        firebase.database().ref('uygulama_turleri').once('value').then(function (snapshot) {
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                uygulamaTuruneGore[cleanelement.idUygulamaTuru]["uygulamaTuru"]=cleanelement.uygulamaTuru;
            });

            var uygulamaTuruneGorearr = $.map(uygulamaTuruneGore, function(value, index) {
                return [value];
            });
    
            griduygulamaturunegore.bootgrid("append",uygulamaTuruneGorearr);

        });
    });



}

function loadRptYeniKayitlar(t1, t2) {
    var firmasay = 0;
    firebase.database().ref('sirketler').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {

        snapshot.forEach(function (element) {
            firmasay++;
        });
        $("#txtSirketSayisi").text(firmasay);

    });



    var calisansay = 0;
    firebase.database().ref('calisanlar').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        snapshot.forEach(function (element) {
            calisansay++;
        });
        $("#txtCalisanSayisi").text(calisansay);
    });




    var tetkikFormuSayisi = 0;
    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {

        snapshot.forEach(function (element) {
            tetkikFormuSayisi++;
        });

        $("#txtTetkikFormuSayisi").text(tetkikFormuSayisi);

    });

}