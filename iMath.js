const iMath={};

iMath.sum=function(num1,num2){
  num1=num1.split('').reverse();
  num2=num2.split('').reverse();
  let n1,n2;
  if(num1.length>num2.length)n1=num1,n2=num2
  else n1=num2,n2=num1;
  let remain=0;
  let result=[];
  n1.forEach((v,i)=>{
    let vsum=parseInt(v)+parseInt(n2[i]||0)+remain;
    let p=[];
    if(vsum>=10 && i<n1.length-1){
      p=String(vsum).split('');
      vsum=parseInt(p[1]);
    }
    result.push(vsum);
    remain=parseInt(p[0]||0);
  })
  return result.reverse().join('').replace(/^0+/g,'');
}

iMath.subtract=function(num1,num2){
  num1=num1.replace(/^0+/g,'').split('').reverse();
  num2=num2.replace(/^0+/g,'').split('').reverse();
  let n1,n2;
  if(num1.length>num2.length)n1=num1,n2=num2
  else n1=num2,n2=num1;
  for(let i=0;i<n1.length-n2.length;i++){
    n2.push(0);
  }
  let need=0;
  let result=[];
  num1.forEach((v,i)=>{
    let v1=parseInt(v)-need;
    let v2=parseInt(num2[i]||0);
    if(v1<v2 && i<num1.length-1){
      v1+=10;
      need=1;
    }
    else need=0;
    result.push(v1-v2);
  })
  return result.reverse().join('').replace(/^0+/g,'');
}

iMath.multiply=function(num1,num2){
  
}

iMath.divide=function(num1,num2){
  
}

iMath.eval=function(str){
  const numbers=str.split(/[\+\-\/\*]/);
  const symbols=str.replace(/[0-9]/g,'').split();
  let result;
  symbols.forEach((v,i)=>{
    if(v=='+')result=iMath.sum(numbers[i*2],numbers[i+1])
    else if(v=='-')result=iMath.subtract(numbers[i*2],numbers[i+1])
  });
  //throw Error("Unable to solve");
  return result;
}

iMath.random=function(from,to,float=false){
  let result=Math.random()*(to-from)+from;
  return float?result:Math.round(result);
}