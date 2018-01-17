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
            callback && callback();
        }, _time);
    }
    this.init = (dom, mes) => {
        dom.innerHTML = mes;
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
    }

    // ——————————————————————————

    this.tipShow = (mes, callback, callback1) => {
        dom.style.display = 'block';
        dom.querySelector('.mesMain').innerHTML = mes;
        dom.querySelector('.next').addEventListener('click', (a) => {
            callback && callback(a);
        });
        dom.querySelector('.close').addEventListener('click', () => {
            if (callback1) {
                this.tipHide(callback1());
            } else {
                this.tipHide();
            }
        });
    }
    this.tipHide = (callback) => {
        dom.style.display = 'none';
        callback && callback();
    }

}