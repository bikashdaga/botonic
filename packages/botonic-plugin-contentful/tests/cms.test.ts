import { instance, mock } from 'ts-mockito';
import * as cms from '../src';
import { ModelType } from '../src';

test('TEST: callbackMap multiple callbacks', () => {
  let callback1 = mock(cms.Callback);
  let sut = new cms.CallbackMap().addCallback('id1', callback1);
  expect(sut.getCallback('id1')).toBe(callback1);

  let callback2 = mock(cms.Callback);
  sut.addCallback('id2', callback2);
  expect(sut.getCallback('id2')).toBe(callback2);
});

test('TEST: callbackMap fixed callback', () => {
  let callback = instance(mock(cms.Callback));
  let sut = cms.CallbackMap.forAllIds(callback);
  expect(sut.getCallback(Math.random().toString())).toBe(callback);
});

test('TEST: regexForModelType', async () => {
  let callback = cms.Callback.ofModel(ModelType.CAROUSEL, 'id1');
  expect(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cms.Callback.regexForModelType(ModelType.CAROUSEL).test(callback.payload!)
  ).toBeTruthy();
});
