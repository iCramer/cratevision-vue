const deepCopy = (obj: any) => {
  if(!obj) {
    return undefined;
  }
  else {
    return JSON.parse(JSON.stringify(obj));
  }
}

export default deepCopy;
