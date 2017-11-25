function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler');
    LoadDrop('drpUygulamaTuru', 'idUygulamaTuru', 'uygulamaTuru', 'uygulama_turleri', 'Birimde Yaplacak1511085852689');
    LoadDrop('drpCalisan', 'idCalisan', 'calisanAdi', 'calisanlar', '0');
    $("#drpCalisan").change(function () {

        var selectedID=this.selectedOptions[0].value;

        if(selectedID=='0'){
            $("#hdnIdCalisan").val('');
            clearAllFieldsCalisan();
            return;
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

            var isyeriKodu=snapshot.val().calisanIsyeriKodu;

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

            resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");
        });
    });

}