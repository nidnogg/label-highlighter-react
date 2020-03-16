export const generateKey = pre => {
  return `${ pre }_${ new Date().getTime() }`;
}

export const printContent = contentObjArr => {
  let toPrint = contentObjArr[0];
  if(contentObjArr.length > 1) {
    for (let index = 1; index < contentObjArr.length; index++) {
      toPrint = toPrint.concat(`; ${contentObjArr[index]}`);
    }
  } 
  return toPrint;
}