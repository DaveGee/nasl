
var i = 0;

export default function atomicCounter(offset = 0) {
  // TODO use backendless counter api
  return (offset + i++).toString(16).toUpperCase();
};