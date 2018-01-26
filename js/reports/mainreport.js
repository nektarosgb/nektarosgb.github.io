
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

    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        var tetkikSay = 0;
        var toplamTutar = parseFloat("0.00");
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            if (cleanelement.seciliTetkikler != null) {

                var array = $.map(cleanelement.seciliTetkikler, function(value, index) {
                    return [value];
                });

                tetkikSay+=array.length;
    
                var aratop=parseFloat("0.00");
                array.forEach(function (item) {
                    var txtfiyat = ""+item.fiyat;
                    var fiyat = parseFloat(txtfiyat);
                    aratop = aratop + fiyat;
                });

                toplamTutar = toplamTutar + aratop;
            }
        });
        $("#txtTetkikSayisi").text(tetkikSay);
        $("#txtTetkikToplamTutar").text(toplamTutar);
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