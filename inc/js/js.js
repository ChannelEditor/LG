var xmlDoc, legacybroadcast, filename;

window.onload = function() {

    document.getElementsByClassName("lists")[0].onmousedown = function() {
        this.querySelectorAll(".icon-delete").forEach(a => 
            a.onclick = function(e) {
                e.preventDefault();
                let select = e.target.parentElement.parentElement;
                legacybroadcast.channelList.splice(select.dataset.num, 1);
                select.remove();
                //legacybroadcast.channelList
                ReOrderList();
            }
        );
    };

    include("inc/js/file.js");
    include("inc/js/move.js");
}

function ReOrderList(){
    document.querySelectorAll(".list").forEach(function(item, i) {
        legacybroadcast.channelList[i].majorNumber = i+1;
        item.dataset.num = i;
        item.querySelector(".x1 b").innerText = i+1;
    });
}

function download() {

    xmlDoc.documentElement.querySelector("legacybroadcast").textContent = JSON.stringify( legacybroadcast );

    var element = document.createElement('a'),
        xmlString = new XMLSerializer().serializeToString( xmlDoc );
    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(xmlString));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function include(url) {
  var script  = document.createElement('script');
  script.src  = url;
  script.type = 'text/javascript';
  script.defer = true;
  document.getElementsByTagName('head').item(0).appendChild(script);
}

Array.prototype.move = function(from,to){
  this.splice(to,0,this.splice(from,1)[0]);
  return this;
}; // array.move(3,1);