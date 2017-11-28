function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler', ' onClick="hesaplaToplam();"');

    LoadDrop('drpCalisan', 'idCalisan', 'calisanAdi', 'calisanlar', '0');

    $("#drpMuayeneTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdMuayeneTuru").val(selectedID);
        $("#hdnMuayeneTuru").val($("#drpMuayeneTuru").children("option:selected").text());
    });

    $("#drpCariTuru").change(function () {
        var selectedID = this.selectedOptions[0].value;
        $("#hdnIdCariTuru").val(selectedID);
        $("#hdnCariTuru").val($("#drpCariTuru").children("option:selected").text());
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
            doldurCalisanBilgileri(id);

        }).end().find(".command-delete").on("click", function (e) {
            var id = $(this).data("row-id");
            firebase.database().ref().child("calisanlar").child(id).remove();
            initLoadedPage_calisan_islemleri();
        });
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


    $("#drpCalisan").change(function () {

        var selectedID = this.selectedOptions[0].value;

        if (selectedID == '0') {
            $("#hdnIdCalisan").val('');
            clearAllFieldsCalisan();
            $("#pnlIsciBilgileri").addClass("hide");
            return;
        } else {
            $("#pnlIsciBilgileri").removeClass("hide");
        }

        doldurCalisanBilgileri(selectedID);
    });

    $("#btn_TetkikTalepFormuKaydet").click(function () {

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
        });

        var meslekKodu = snapshot.val().calisanMeslekKodu;

        secTetkiktlerMeslegeGore(meslekKodu);

        firebase.database().ref('/meslekler/' + meslekKodu).once('value').then(function (meslek) {
            $("#txtCalisanMeslek").val(meslek.val().meslek);
        });

        resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");
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

