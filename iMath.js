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

iMath._checkDecimal=function(num1,num2,onlyCountComma=false){
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
  if(!result)throw "Eval failed: Invalid math expression"
  return result;
}

iMath.trim=function(num){
  if(num.includes('NaN'))throw "Calculation failed: NaN resulted";
  num=num.replace(/^0+/g,'').replace(/\.0*$/g,'');
  if(num.includes('.')){
    if(/^\./.test(num))num='0'+num;
    num=num.replace(/0+$/g,'');
  }
  return num;
}

iMath.sum=function(num1,num2){
  if(num1[0]=='-')return iMath.subtract(num2,num1.slice(1));
  if(num2[0]=='-')return iMath.subtract(num1,num2.slice(1));
  
  num1=num1.split('').reverse();
  num2=num2.split('').reverse();
  [num1,num2,decimal]=iMath._checkDecimal(num1,num2);
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
  if(decimal>0)result.splice(decimal,0,'.')
  return iMath.trim(result.reverse().join(''));
}

iMath.subtract=function(num1,num2){
  if(num1[0]=='-')return '-'+iMath.sum(num1.slice(1),num2)
  if(num2[0]=='-')return iMath.sum(num1,num2.slice(1))
  
  let negative=false;
  num1=num1.replace(/^0+/g,'').split('').reverse();
  num2=num2.replace(/^0+/g,'').split('').reverse();
  [num1,num2,decimal]=iMath._checkDecimal(num1,num2);
  
  let n1,n2;
  if(num1.length>num2.length)[n1,n2]=[[...num1],[...num2]];
  else if(num1.length==num2.length){
    let n1bigger=false;
    for(let i=num1.length-1;i>=0;i--){
      if(num1[i]>num2[i]){
        n1bigger=true;
        break;
      }
      else if(num1[i]<num2[i]){
        n1bigger=false;
        negative=true;
        break;
      }
    }
    [n1,n2]=n1bigger?[[...num1],[...num2]]:[[...num2],[...num1]];
  }
  else{
    negative=true;
    [n1,n2]=[[...num2],[...num1]]
  }
  if(n1.length!=n2.length){
    for(let i=0;i<n1.length-n2.length+1;i++){
      n2.push('0');
    }
  }
  let need=0;
  let result=[];
  n1.forEach((v,i)=>{
    let v1=parseInt(v)-need;
    let v2=parseInt(n2[i]||0);
    if(v1<v2 && i<n1.length-1){
      v1+=10;
      need=1;
    }
    else need=0;
    result.push(v1-v2);
  })
  if(decimal>0)result.splice(decimal,0,'.')
  return (negative?'-':'')+iMath.trim(result.reverse().join(''));
}

iMath.multiply=function(num1,num2){
  let negative=false;
  if(num1[0]=='-'){
    negative=true;
    num1=num1.slice(1);
  }
  if(num2[0]=='-'){
    negative=!negative;
    num2=num2.slice(2)
  }
  num1=num1.split('').reverse();
  num2=num2.split('').reverse();
  let decimal=0;
  [num1,num2,decimal]=iMath._checkDecimal(num1,num2,true);
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
  if(decimal>0)result.splice(result.length-decimal,0,'.');
  return (negative?'-':'')+iMath.trim(result.join(''));
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
      if(iMath._operators.test(v[i]) || !iMath._operators.test(v[i]) && iMath._operators.test(v[i-1]) && !iMath._operators.test(v[i-2])) component.push(v[i]);
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