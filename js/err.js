function Err(dom, time) {
    let _time = time || 2000;
    this.dom = dom;
    this.errMesShow = (mes, callback) => {
        this.init(dom, mes);
        dom.className = 'errMes';
        // 二次修正 
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
        setTimeout(() => {
            dom.className = '';
            if (callback) {
                callback();
            }
        }, _time);
    }
    this.init = (dom, mes) => {
        dom.innerHTML = mes;
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
    }
}