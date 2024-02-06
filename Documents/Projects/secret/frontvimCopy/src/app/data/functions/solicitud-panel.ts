// // v1
export function validateKeyOnSelectedQPEU(object: any): string {
  if (!object || object.clave === '-') {
    return 'All';
  } else {
    return object.clave;
  }
}

// v2
export function validateKeyOnSelectedQ(object: string | null): string {
  if (!object || object === '-') {
    return 'All';
  } else {
    return object;
  }
}
