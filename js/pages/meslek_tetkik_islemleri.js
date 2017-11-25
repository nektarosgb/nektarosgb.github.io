function initLoadedPage_meslek_tetkik_islemleri() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler');
        firebase.database().ref('Meslektetkikler').once('value').then(function (snapshot) {
            var rows = [];
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));
                cleanelement['id'] = rows.length + 1;
                rows.push(cleanelement);
            });
        });
        $("#drpMeslek").change(function () {
            var meslekId=$("#drpMeslek").val();
            setEditTetkikMeslek(meslekId);
        });
        LoadDrop('drpMeslek','idMeslek','meslek','meslekler','');
        setHeader("Mesleğe Göre Tetkik Belirleme İşlemleri");
    }

function setEditTetkikMeslek(id) {
    firebase.database().ref('/Meslektetkikler/meslek').startAt(id).endAt(id).once('value').then(function (snapshot) {
        if(snapshot==null){
            return;
        }
        $("#chkitem"+snapshot.val().idTetkik).setAttribute("checked", "checked");
        // $("#drpUygulamaTuru select").val(snapshot.val().uygulamaTuru);    
        // $("#drpUygulamaTuru select[value='"+snapshot.val().uygulamaTuru +"']").attr("selected",true);
        //  $("#drpMeslek").val(snapsh  ot.val().uygulamaTuru ).find("option[value=" + snapshot.val().uygulamaTuru +"]").attr('selected', true);
        $('#myModal').modal('show');
    });
}

function kaydetTetkikBilgisi() {
    var d = new Date();
    var n = d.getTime()

    var meslek = $("#drpMeslek").val();
    var idMeslekTetkik = meslek.replace(/[^\x00-\x7F]/g, "") + n;

    $('#mt_TetkikListe input:checked').each(function() {
    var veri = {
        "idMeslekTetkik": idMeslekTetkik,
        "tetkik": this.value,
        "meslek":meslek,
        "kayitEden": firebase.auth().currentUser.providerData[0]["email"]
    }

    kaydetVeritabani("Meslektetkikler", idMeslekTetkik, veri);
});
    // clearAllFieldsTetkik()

}


function clearAllFieldsTetkik() {
    $("#hdnId").val('');
    $("#txtTetkik").val("");
    $("#txtFiyat").val('');
    $("#drpUygulamaTuru select").val("Seçiniz");   
    $("#drpUygulamaTuru").val("Seçiniz").find("option[value=0]").attr('selected', true);
}