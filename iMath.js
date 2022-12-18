const iMath={
  _operators: /[\+\-×\*÷:]/, 
  _definition:[
    [['+'],'sum'], 
    [['-'],'subtract'], 
    [['*','×'],'multiply'], 
    [['/',':'],'divide']
  ] 
};

iMath._sort=function(num1,num2){
  return num1.length>num2.length?[num1,num2]:[num2,num1];
}
iMath._align=function(num1,num2,onlyCountComma=false){
  let n1=num1.indexOf('.')<=0?0:num1.indexOf('.');
  let n2=num2.indexOf('.')<=0?0:num2.indexOf('.');
  if(!onlyCountComma){
    for(let i=0;i<n2;i++)num1.unshift('0');
    for(let i=0;i<n1;i++)num2.unshift('0');
  }
  
  if(num1.indexOf('.')>=0)num1.splice(num1.indexOf('.'),1);
  if(num2.indexOf('.')>=0)num2.splice(num2.indexOf('.'),1);
  
  return [num1,num2,n1+n2];
}
iMath._identify=symbol=>{
  let result;
  iMath._definition.forEach(v=>{
    v[0].forEach(w=>{
      if(symbol==w){
        result=v[1];
        return;
      }
    })
  })
  return result;
}

iMath.trim=num=>num.replace(/^0+\d/g,'').replace(/\.0*$/g,'');

iMath.sum=function(num1,num2){
  num1=num1.split('').reverse();
  num2=num2.split('').reverse();
  [num1,num2,comma]=iMath._align(num1,num2);
  let n1,n2;
  [n1,n2]=iMath._sort(num1,num2);
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
  if(comma>0)result.splice(comma,0,'.')
  return iMath.trim(result.reverse().join(''));
}

iMath.subtract=function(num1,num2){
  num1=num1.replace(/^0+/g,'').split('').reverse();
  num2=num2.replace(/^0+/g,'').split('').reverse();
  [num1,num2,comma]=iMath._align(num1,num2);
  console.log([num1, num2]) 
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
  if(comma>0)result.splice(comma,0,'.')
  return iMath.trim(result.reverse().join(''));
}

iMath.multiply=function(num1,num2){
  num1=num1.split('').reverse();
  num2=num2.split('').reverse();
  let comma=0;
  [num1,num2,comma]=iMath._align(num1,num2,true);
  let n1,n2;
  [n1,n2]=iMath._sort(num1,num2);
  let result=[];
  n1.forEach((v,i)=>{
    let r='';
    let remain=0;
    let vsum;
    n2.forEach((w,j)=>{
      let vsum=parseInt(v)*parseInt(w)+remain;
      let p=[];
      if(vsum>=10 && j<n2.length-1){
        p=String(vsum).split('');
        vsum=parseInt(p[1]);
      }
      r=vsum+r;
      remain=parseInt(p[0]||0);
    }) 
    for(let k=0;k<i;k++)r+='0';
    result.push(r);
  })
  result=result.reduce((a,b)=>iMath.sum(b,a),'0').split('');
  if(comma>0)result.splice(result.length-comma,0,'.');
  return iMath.trim(result.join(''));
}

iMath.divide=function(num1,num2){
  return Number(num1)/Number(num2);
}

iMath.eval=function(str){
  const line=str.split("\n");
  let equations=[];
  line.forEach(v=>{
    let component=[''];
    v=v.split('');
    for(let i=0;i<v.length;i++){
      if(iMath._operators.test(v[i]) || iMath._operators.test(v[i-1]))component.push(v[i]);
      else component[component.length-1]+=v[i];
    }
    equations.push(component);
  })
  
  let total="";
  equations.forEach(v=>{
    let result=[...v];
    for(i=0;i<v.length;i++){
      let count=0;
      console.log([...v])
      if(iMath._operators.test(v[i])){
        v.splice(i-1,3,iMath[iMath._identify(v[i])](v[i-1],v[i+1]));
        count++;
        i-=count;
      }
    } 
   total=v;
  })
  return total[0];
}

iMath.random=function(from,to,float=false){
  let result=Math.random()*(to-from)+from;
  return float?result:Math.round(result);
}