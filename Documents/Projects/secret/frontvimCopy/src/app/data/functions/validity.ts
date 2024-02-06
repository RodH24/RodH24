export function isRoleCurrentlyAvailable(price: string): number {
  if(typeof price !== 'string') return price;
  price = price ? price : '0';
  return Number(price.replace(/[^0-9.-]+/g, ''));
}
