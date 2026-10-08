import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, toHex, adjust, autoInk, mix, shade } from '../src/color.js';

test('parses short and long hex', () => {
  assert.deepEqual(parseColor('#fff'), [255, 255, 255]);
  assert.deepEqual(parseColor('41C4FF'), [0x41, 0xc4, 0xff]);
  assert.equal(parseColor('nope'), null);
});

test('round-trips through hex', () => {
  assert.equal(toHex(parseColor('#41c4ff')), '#41c4ff');
});

test('adjust keeps a colour at neutral settings', () => {
  const c = adjust('#41c4ff', { brightness: 1, saturation: 1 });
  const [a, b] = [parseColor(c), parseColor('#41c4ff')];
  a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) <= 1));
});

test('brightness and shade move lightness the right way', () => {
  const sum = (h) => parseColor(h).reduce((a, b) => a + b, 0);
  assert.ok(sum(adjust('#41c4ff', { brightness: 1.5 })) > sum('#41c4ff'));
  assert.ok(sum(adjust('#41c4ff', { brightness: 0.5 })) < sum('#41c4ff'));
  assert.ok(sum(shade('#41c4ff', -0.2)) < sum('#41c4ff'));
});

test('ink is dark on light bodies and light on dark ones', () => {
  assert.equal(autoInk('#f4f2fa'), '#17151f');
  assert.equal(autoInk('#111111'), '#f7f5ff');
});

test('mix interpolates', () => {
  assert.equal(mix('#000000', '#ffffff', 0.5), '#808080');
});
