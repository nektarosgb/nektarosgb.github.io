
function initLoadedPage_main_report() {

    $('.datepicker1').datepicker();
    $('.datepicker2').datepicker();

    loadListVerileri('idTetkik','tetkikler');
    loadListVerileri('idUygulamaturu','uygulama_turleri');
    loadListVerileri('idSirket','sirketler');

    $('#btnMainReportYukle').click(function () {
        var t1 =moment($('.datepicker1').datepicker('getDate')).format('DD-MM-YYYY').getTime();
        var t2 =moment($('.datepicker2').datepicker('getDate')).format('DD-MM-YYYY').getTime();
        loadRptYeniKayitlar(t1, t2);
        loadRptTetkik(t1, t2);
        return false;
    });
}

function loadRptTetkik(t1, t2) {
    var tetkikSay = 0;
    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {

        if (snapshot.seciliTetkikler != null) {
            tetkikSay += snapshot.seciliTetkikler.length;
        }
    });

    $("#txtTetkikSayisi").text(tetkikSay);

    var toplamTutar = parseFloat("0.00");;
    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        if (snapshot.seciliTetkikler != null) {
            snapshot.seciliTetkikler.forEach(idTetkik => {
                var txtfiyat = chkListVerileri["tetkikler"][idTetkik]["fiyat"];
                var fiyat = parseFloat(txtfiyat);
                toplamTutar = toplamTutar + fiyat;
            });
        }
    });

    $("#txtTetkikToplamTutar").text(toplamTutar);

}

function loadRptYeniKayitlar(t1, t2) {
    var firmasay = 0;
    firebase.database().ref('sirketler').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        firmasay++;
    });

    $("#txtSirketSayisi").text(firmasay);

    var calisansay = 0;
    firebase.database().ref('calisanlar').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        calisansay++;
    });

    $("#txtCalisanSayisi").text(calisansay);


    var tetkikFormuSayisi = 0;
    firebase.database().ref('tetkiktalepformlari').orderByChild("timestamp").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        tetkikFormuSayisi++;
    });

    $("#txtTetkikFormuSayisi").text(tetkikFormuSayisi);

}