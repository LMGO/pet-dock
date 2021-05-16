//生成六位验证码
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
function formatTime (date) {
    date = new Date(parseInt(date));// 时间戳转换成时间格式
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
export function showformattime(i) {
    let start = i;
    let end = new Date().getTime();
    let utc = end - start;
    let day = Math.floor(utc/(24*60*60*1000));// 天
    let hour = Math.floor(utc/(60*60*1000));//小时
    let minute = Math.floor(utc/(60*1000)); // 分
    //一天以上三天以下
    if (day >= 1 && day <= 3) {
        return day + '天前'
    }
    //几个小时前
    else if ( hour >= 1 && hour < 24) {
        return hour + '小时前'
    }
    //几分钟前
    else if ( minute >= 0 && minute < 60) {
        return minute + '分钟前'
    } 
    //其余情况展示时间格式
    else {
        return formatTime(i)
    }
}
// UUID
export const uuid = (type) => {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 15; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[8] = "4";
    s[12] = hexDigits.substr((s[12] & 0x3) | 0x8, 1);
    var uuid = s.join("").toString();
    if(type == 'user') {
        uuid ='user'+ uuid.slice(4)
    } else if(type == 'post') {
        uuid = 'post'+ uuid.slice(4)
    } else if(type == 'art') {
        uuid = 'art'+ uuid.slice(3)
    } else if(type == 'question') {
        uuid = 'ques'+ uuid.slice(4)
    } else if(type == 'answer') {
        uuid = 'answer'+ uuid.slice(5)
    } else if(type == 'post_comment') {
        uuid = 'pc'+ uuid.slice(2)
    } else if(type == 'art_comment') {
        uuid = 'ac'+ uuid.slice(2)
    } else if(type == 'answer_comment') {
        uuid = 'ac'+ uuid.slice(2)
    } else if(type == 'image'||type == 'video') {
        uuid = uuid + hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    } else if(type == 'name') {
        uuid = '用户'+ uuid.slice(6)
    } else if(type == 'topic') {
        uuid = 'topic'+ uuid.slice(5)
    }
    return uuid;
}
  
// 获取当前时间戳
export const getTime = () => {
// return (new Date()).Format("yyyy-MM-dd hh:mm:ss")
return (new Date()).getTime()
}

export function deepCopy (obj) {
    var newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    }
    for(var i in obj){
       newobj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
    }
    return newobj
}


// export default {
//     newcode,
//     showformattime
// }