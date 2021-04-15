export function newcode(){
    let mm = Math.random();
    let code = "";
    if(mm > 0.1){
       code = Math.round(mm*1000000);
    } else {
       mm += 0.1;
       code = Math.round(mm*1000000);
    }
    return code;
}

function formatNumber (n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

 // let date = new Date().getTime() 获取时间戳传入 数据库统一存时间戳
export function formatTime (date) {
    date = new Date(date);// 时间戳转换
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const t1 = [year, month, day].map(formatNumber).join('-')
    const t2 = [hour, minute, second].map(formatNumber).join(':')

    return `${t1} ${t2}`
}

export default {
    newcode
}