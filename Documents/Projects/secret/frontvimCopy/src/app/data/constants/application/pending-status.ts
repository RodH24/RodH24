const PendingStatus: Map<string,{
    dbName: string;
    toShow: string;
    class: string;
  }> = new Map();

PendingStatus.set('pending', {
  dbName: 'pendiente',
  toShow: 'Pendiente',
  class: 'warning',
})
.set('rejected', {
  dbName: 'rechazada',
  toShow: 'Rechazada',
  class: 'danger',
})

.set('entered', {
  dbName: 'entregada',
  toShow: 'Entregada',
  class: 'success',
});

export default PendingStatus;
