function initLoadedPage_tetkik_talep_formu() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler');
    LoadDrop('drpUygulamaTuru', 'idUygulamaTuru', 'uygulamaTuru', 'uygulama_turleri', 'Birimde Yaplacak1511085852689');
    LoadDrop('drpCalisan', 'idCalisan', 'calisanAdi', 'calisanlar', '0');
    $("#drpCalisan").change(function () {
        firebase.database().ref('/calisanlar/' + this.selectedOptions[0].value).once('value').then(function (snapshot) {

            $("#hdnIdCalisan").val(snapshot.val().idCalisan);
            $("#txtCalisanAdi").val(snapshot.val().calisanAdi);
            $("#txtCalisanAdresi").val(snapshot.val().calisanAdresi);
            $("#txtCalisanTelefon").val(snapshot.val().calisanTelefon);
            $("#txtCalisanSGKSicilNo").val(snapshot.val().calisanSGKSicilNo);
            $("#txtCalisanTCNo").val(snapshot.val().calisanTCNo);
            $("#txtCalisanTelefonCep").val(snapshot.val().calisanTelefonCep);
            $("#txtCalisanEposta").val(snapshot.val().calisanEposta);
            $("#txtCalisanIsyeri").val(snapshot.val().calisanIsyeri);
            resimGoster("calisanlar", snapshot.val().idCalisan, "imgCalisan");
        });
    });

}