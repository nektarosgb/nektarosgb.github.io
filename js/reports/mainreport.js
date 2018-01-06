
function initLoadedPage_main_report() {

    $('.datepicker1').datepicker();
    $('.datepicker2').datepicker();

    $('#btnMainReportYukle').click(function () {
        var t1 = $('.datepicker1').datepicker('getDate');
        var t2 = $('.datepicker2').datepicker('getDate');
        loadRptYeniKayitlar(t1, t2);
    });
}

function loadRptYeniKayitlar(t1, t2) {
    var firmasay = 0;
    firebase.database().ref('sirketler').orderByChild("kayitTarihi").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        firmasay++;
    });

    $("#txtSirketSayisi").text(firmasay);

    var calisansay = 0;
    firebase.database().ref('calisanlar').orderByChild("kayitTarihi").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        calisansay++;
    });

    $("#txtCalisanSayisi").text(calisansay);


    var tetkikFormuSayisi = 0;
    firebase.database().ref('tetkiktalepformlari').orderByChild("kayitTarihi").startAt(t1).endAt(t2).once('value').then(function (snapshot) {
        tetkikFormuSayisi++;
    });

    $("#txtTetkikFormuSayisi").text(tetkikFormuSayisi);

}