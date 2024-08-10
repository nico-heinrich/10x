import Dexie from 'dexie';

export const db = new Dexie('user');
db.version(1).stores({
  preferences: 'setting, value',
});
