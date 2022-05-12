import _mock from './_mock';
import { randomNumberRange, randomInArray } from './funcs';

// ----------------------------------------------------------------------
export const _deadlineList = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  codeClient: _mock.codeClient(index),
  program: _mock.program(index),
  montant: randomNumberRange(1000000, 9999999),
  lot: _mock.lot(index),
  iLot: _mock.iLot(index),
  deadlineAt: _mock.date(index),
  name: _mock.name.fullName(index),
  email: _mock.email(index),
  phoneNumber: _mock.phoneNumber(index),
}));

export const _deadlineOne = {
  id: _mock.id(1),
  codeClient: _mock.codeClient(1),
  program: _mock.program(1),
  montant: randomNumberRange(1000000, 9999999),
  lot: _mock.lot(1),
  iLot: _mock.iLot(1),
  deadlineAt: _mock.date(1),
  name: _mock.name.fullName(1),
  email: _mock.email(1),
  phoneNumber: _mock.phoneNumber(1),
};
