function initLoadedPage_meslek_tetkik_islemleri() {
    loadCheckBoxList('lstTetkikler', 'idTetkik', 'tetkik', 'tetkikler',' ');
    firebase.database().ref('Meslektetkikler').once('value').then(function (snapshot) {
        var rows = [];
        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            cleanelement['id'] = rows.length + 1;
            rows.push(cleanelement);
        });
    });
    $("#drpMeslek").change(function () {
        var meslekId = $("#drpMeslek").val();
        $("input[type='checkbox']").prop("checked", false);
        firebase.database().ref('Meslektetkikler').orderByChild('meslek').equalTo(meslekId).once('value').then(function (snapshot) {
            if (snapshot == null) {
                return;
            }
            snapshot.forEach(function (element) {
                var cleanelement = JSON.parse(JSON.stringify(element));

                $("#chkitem" + cleanelement.tetkik).prop("checked", true);
            });


            // $("#drpUygulamaTuru select").val(snapshot.val().uygulamaTuru);    
            // $("#drpUygulamaTuru select[value='"+snapshot.val().uygulamaTuru +"']").attr("selected",true);
            //  $("#drpMeslek").val(snapsh  ot.val().uygulamaTuru ).find("option[value=" + snapshot.val().uygulamaTuru +"]").attr('selected', true);
            $('#myModal').modal('show');
        });
    });
    LoadDrop('drpMeslekTetkik', 'idMeslek', 'meslek', 'meslekler', '');
    setHeader("Mesleğe Göre Tetkik Belirleme İşlemleri");
}

function setEditTetkikMeslek(id) {

}

function silMeslekTetkikKayitlari(meslek) {

    var ref = firebase.database().ref("Meslektetkikler");
    var meslekId = $("#drpMeslekTetkik").val();
    //ref.orderByChild("meslek").equalTo(meslek).remove();


    ref.orderByChild('meslek').equalTo(meslekId).once('value').then(function (snapshot) {

        snapshot.forEach(function (element) {
            var cleanelement = JSON.parse(JSON.stringify(element));
            firebase.database().ref("Meslektetkikler/"+cleanelement.idMeslekTetkik).child(cleanelement.idMeslekTetkik);
        });
    });
}

function kaydetMeslekTetkikBilgisi() {
    var d = new Date();
    var n =GetTimeStamp(d);

    var meslek = $("#drpMeslek").val();

    silMeslekTetkikKayitlari( meslek);

    $('#mt_TetkikListe input[type="checkbox"]:checked').each(function () {

        var idstr = meslek + this.value;
        var idMeslekTetkik = idstr.replace(/[^\x00-\x7F]/g, "") + n;

        var veri = {
            "idMeslekTetkik": idMeslekTetkik,
            "tetkik": this.value,
            "meslek": meslek,
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