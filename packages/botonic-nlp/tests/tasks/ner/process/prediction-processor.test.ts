import { tensor, Tensor3D } from '@tensorflow/tfjs-node'

import { PredictionProcessor } from '../../../../src/tasks/ner/process/prediction-processor'
import * as helper from '../../../helpers/tasks/ner/helper'

describe('Prediction processor', () => {
  test('process prediction', async () => {
    const predictionProcessor = new PredictionProcessor(helper.ENTITIES)
    const predictions: Tensor3D = tensor([
      [
        [
          0.9945080876350403,
          0.0003093644918408245,
          0.0035769850946962833,
          0.0001255435054190457,
          0.0014799970667809248,
        ],
        [
          0.7380403280258179,
          0.0005700786714442074,
          0.23637591302394867,
          0.0030084860045462847,
          0.02200509048998356,
        ],
        [
          0.001593800843693316,
          0.005373038817197084,
          0.04230387881398201,
          0.9479659795761108,
          0.002763244556263089,
        ],
        [
          0.0036670025438070297,
          0.9819062948226929,
          0.0007544970721937716,
          0.012610450387001038,
          0.0010617494117468596,
        ],
        [
          0.9968499541282654,
          0.0027840477414429188,
          0.00004213591819279827,
          0.00005813398092868738,
          0.0002657095028553158,
        ],
        [
          0.9999483823776245,
          0.000034533564758021384,
          0.000003933795142074814,
          0.0000023708025764790364,
          0.000010772973837447353,
        ],
        [
          0.9999969005584717,
          0.0000014793348555031116,
          5.749649290009984e-7,
          2.4717687097108865e-7,
          8.119749850266089e-7,
        ],
        [
          0.9999990463256836,
          3.3258342568842636e-7,
          2.1579334941179695e-7,
          9.435587600137296e-8,
          2.797872866722173e-7,
        ],
        [
          0.9999991655349731,
          1.8103040133610193e-7,
          2.1073120137771184e-7,
          9.327066408104656e-8,
          2.692230793854833e-7,
        ],
        [
          0.9999985694885254,
          1.6292408133722347e-7,
          4.832743911720172e-7,
          2.084534287405404e-7,
          5.680018375642248e-7,
        ],
        [
          0.9999942779541016,
          2.3753231914724893e-7,
          0.0000022088217974669533,
          9.678650485511753e-7,
          0.0000022364004053088138,
        ],
        [
          0.9999629259109497,
          6.239723120415874e-7,
          0.000015652763977413997,
          0.000007489421477657743,
          0.000013325858162716031,
        ],
      ],
    ])
    expect(
      predictionProcessor.process(
        ['i', 'love', 'leather', 'jacket'],
        predictions
      )
    ).toEqual([
      {
        confidence: 0.9945080876350403,
        label: 'O',
        predictions: [
          {
            confidence: 0.9945080876350403,
            label: 'O',
          },
          {
            confidence: 0.0003093644918408245,
            label: 'product',
          },
          {
            confidence: 0.0035769850946962833,
            label: 'color',
          },
          {
            confidence: 0.0001255435054190457,
            label: 'material',
          },
          {
            confidence: 0.0014799970667809248,
            label: 'size',
          },
        ],
        text: 'i',
      },
      {
        confidence: 0.7380403280258179,
        label: 'O',
        predictions: [
          {
            confidence: 0.7380403280258179,
            label: 'O',
          },
          {
            confidence: 0.0005700786714442074,
            label: 'product',
          },
          {
            confidence: 0.23637591302394867,
            label: 'color',
          },
          {
            confidence: 0.0030084860045462847,
            label: 'material',
          },
          {
            confidence: 0.02200509048998356,
            label: 'size',
          },
        ],
        text: 'love',
      },
      {
        confidence: 0.9479659795761108,
        label: 'material',
        predictions: [
          {
            confidence: 0.001593800843693316,
            label: 'O',
          },
          {
            confidence: 0.005373038817197084,
            label: 'product',
          },
          {
            confidence: 0.04230387881398201,
            label: 'color',
          },
          {
            confidence: 0.9479659795761108,
            label: 'material',
          },
          {
            confidence: 0.002763244556263089,
            label: 'size',
          },
        ],
        text: 'leather',
      },
      {
        confidence: 0.9819062948226929,
        label: 'product',
        predictions: [
          {
            confidence: 0.0036670025438070297,
            label: 'O',
          },
          {
            confidence: 0.9819062948226929,
            label: 'product',
          },
          {
            confidence: 0.0007544970721937716,
            label: 'color',
          },
          {
            confidence: 0.012610450387001038,
            label: 'material',
          },
          {
            confidence: 0.0010617494117468596,
            label: 'size',
          },
        ],
        text: 'jacket',
      },
    ])
  })
})