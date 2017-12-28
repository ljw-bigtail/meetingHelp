(()=>{
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet')

    console.log(username)
    console.log(meet)
})()