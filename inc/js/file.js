var file_drop = document.querySelector('.files');

file_drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    event.target.classList.add("dragover");
});

file_drop.addEventListener('drop', (e) => {
    e.preventDefault();
    SelectFile( e.dataTransfer.files[0] );
    event.target.classList.remove("dragover");
});

document.getElementById('inputfile').onchange = function(){
    SelectFile( this.files[0] )
}

function SelectFile(file) {
    let fr = new FileReader();
    filename = file.name;
    fr.onload = function () {

        let parser = new DOMParser();
        xmlDoc = parser.parseFromString(fr.result,"application/xml");

        let select = xmlDoc.documentElement.querySelector("legacybroadcast");
        legacybroadcast = JSON.parse(select.textContent);
        select.textContent = "";
        let json = legacybroadcast.channelList,
        yaz ="";

        /* Kanal sıralamasına göre sırala */
        let x = json.filter(eleman => eleman.majorNumber > 0).sort(function(a, b){
            return a.majorNumber - b.majorNumber;
        }); 
        /* Kanal numarası olmayanları bul */ 
        let xx =  json.filter(eleman => eleman.majorNumber <= 0); 
        /* İkisini Birlşetir */
        json = x.concat(xx);

        json.forEach(function(item, i) {
            let sat = searchJSON(legacybroadcast.satelliteList, item.satelliteId, item.physicalNumber),
                type = (item.serviceType == 2) ? "radio" : (item.videoStreamType == 36) ? "uhd" : (item.videoStreamType == 27 ) ? "hd" : (item.videoStreamType == 0 ) ? "unk" : "sd",
                paid = (item.scrambled === true) ? "paid" : "none",
                deleted = (item.deleted === true) ? " deleted" : "";

            yaz += Channel_List({
                k: i,
                i: item.majorNumber,
                c: item.channelName,
                f: item.frequency,
                s: sat.symbolRate,
                p: sat.polarization,
                t: type,
                w: paid,
                d: deleted
            });
        });
        
        document.querySelector('.lists').innerHTML = yaz;
        legacybroadcast.channelList = json;
        document.querySelector('.download').classList.remove("none");
    }
    fr.readAsText(file);
}

function searchJSON(obj, sat_id, cha_id) {
  var res = Object.values( obj ).filter(person => person[ "satelliteId" ] === sat_id);
  return Object.values( res[0].TransponderList ).filter(person => person[ "channelIdx" ] === cha_id)[0];
}

function Channel_List(e) {
    return '<div class="list'+e.d+'" data-num="'+e.k+'" draggable="true">\
            <div class="x1"><b>'+e.i+'</b></div>\
            <div class="x2">'+e.c+'</div>\
            <div class="x3"><i class="icon-'+e.t+'"></i></div>\
            <div class="x4">'+e.f+'</div>\
            <div class="x5">'+e.p+'</div>\
            <div class="x6">'+e.s+'</div>\
            <div class="x7"><i class="icon-'+e.w+'"></i></div>\
            <div class="x8">\
                <i class="icon-edit"></i>\
                <i class="icon-delete"></i>\
                <i class="icon-move"></i>\
            </div>\
        </div>';
}