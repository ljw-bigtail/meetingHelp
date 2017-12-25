function Err(dom) {
    this.dom = dom || '';
    this.errMesShow = (mes) => {
        dom.innerHTML = mes;
        dom.className = 'errMes';
        console.log( dom.clientWidth )
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
        setTimeout(() => {
            dom.className = '';
        }, 3000);
    }
}