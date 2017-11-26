function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler',' onClick="hesaplaToplam();"');
    LoadDrop('drpUygulamaTuru', 'idUygulamaTuru', 'uygulamaTuru', 'uygulama_turleri', 'Birimde Yaplacak1511085852689');
    LoadDrop('drpCalisan', 'idCalisan', 'calisanAdi', 'calisanlar', '0');
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
    });

}

function secTetkiktlerMeslegeGore(meslekKodu) {
    $("input[type='checkbox']").prop("checked", false);
    firebase.database().ref('Meslektetkikler').orderByChild('meslek').equalTo(meslekKodu).once('value').then(function (snapshot) {
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));

            $("#chkitem" + cleanelement.tetkik).prop("checked", true);
        });

        hesaplaToplam() ;
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

    $("#txtUcretToplami").val(""+toplam.toFixed(2));
}

