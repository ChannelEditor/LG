   var _MoveElement, initialY; // initialY

    const isTouchDevice = () => {
      try {
        //We try to create TouchEvent (it would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        return true;
      } catch (e) {
        return false;
      }
    };

    /* Events fired on the drag target */
    document.ondragstart = function(e) {
        _MoveElement = e.target;
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('text/html',_MoveElement.outerHTML);
        e.target.style.opacity = '0.5';

        initialY = isTouchDevice() ? e.touches[0].clientY : e.clientY;
        //initialX = isTouchDevice() ? e.touches[0].clientX : e.clientX;
    };

    /* Hareket */
    document.ondragover = function(e) {
        e.preventDefault();
    };

    /* Giriş */
    document.ondragenter = function(event) {
        event.preventDefault();
        event.target.classList.add("dragenter");
    };

    /* Çıkış */
    document.ondragleave = function(event) {
        event.preventDefault();
        event.target.classList.remove("dragenter");
    };

    /* Seçili Taşınan */
    document.ondragend = function(event) {
        event.preventDefault();
        event.target.style.opacity = "";
    };

    /* Taşımanın Bittiği Seçili */
    document.ondrop = function(event) {
      event.preventDefault();
      if( !event.target.hasAttribute("draggable") ) /* Taşıma Alanı Dışında ise durdur */
        return false;

      let newY = isTouchDevice() ? event.touches[0].clientY : event.clientY;
      //let newX = isTouchDevice() ? event.touches[0].clientX : event.clientX;

      event.target.classList.remove("dragenter");

      if (initialY < newY) {
       event.target.insertAdjacentHTML('afterend', event.dataTransfer.getData('text/html'));
      }else{
        event.target.insertAdjacentHTML('beforebegin', event.dataTransfer.getData('text/html'));
      }

      legacybroadcast.channelList.move( _MoveElement.dataset.num, event.target.dataset.num );
      _MoveElement.remove();
      ReOrderList();
    };