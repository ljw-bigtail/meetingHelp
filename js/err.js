function Err(dom) {
    this.dom = dom;
    this.errMesShow = (mes, callback) => {
        this.init(dom, mes);
        dom.className = 'errMes';   
        // 二次修正 
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
        setTimeout(() => {
            dom.className = '';
            if(callback){
                callback();
            }
        }, 3000);
    }
    this.init = (dom, mes)=>{
        dom.innerHTML = mes;
        dom.style.marginLeft = -(dom.clientWidth / 2) + 'px';
    }
}