const data = [{"currency":"bitcoin","price":"6788.048272605917","cryptoTimestamp":"1586131200000"},{"currency":"bitcoin","price":"11066.306240590267","cryptoTimestamp":"1596412800000"},{"currency":"bitcoin","price":"6860.17853570111","cryptoTimestamp":"1586908800000"}]
// console.log("fsdfa");

// console.log(data[1].price);

objs = [{x:10, y:245 },{x:2, y:63 },{x:1, y:56 },{x:4, y:56 },{x:5, y:46 } ]
objs.sort((a,b) => (a.x > b.x) ? 1 : ((b.x > a.x) ? -1 : 0))
let val = "string";

if(val == "string"){
    console.log("empty");
    // val = {"data": "empty"};
    console.log(val);
}else{
    console.log("val:" +val);
    
}

console.log(objs);