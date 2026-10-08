import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BotSim, jumpCurve, restPose, STATES, REST } from '../src/engine.js';

const finite = (pose) => Object.values(pose).every(Number.isFinite);

test('every state produces finite poses over time', () => {
  for (const s of STATES) {
    const sim = new BotSim(0.3, s, {});
    for (let i = 0; i < 2000; i++) assert.ok(finite(sim.update(1 / 60)), `${s} frame ${i}`);
  }
});

test('state switches cross-fade without jumps', () => {
  const sim = new BotSim(0.5, 'default', {});
  for (let i = 0; i < 60; i++) sim.update(1 / 60);
  let prev = { ...sim.pose };
  sim.setState('sleeping');
  for (let i = 0; i < 90; i++) {
    const p = sim.update(1 / 60);
    assert.ok(Math.abs(p.eyeOpen - prev.eyeOpen) < 0.5);
    assert.ok(Math.abs(p.pitch - prev.pitch) < 0.2);
    prev = { ...p };
  }
  assert.equal(sim.pose.sleep, 1);
});

test('jump curve starts and ends on the ground', () => {
  assert.equal(jumpCurve(0, 1).y, 0);
  assert.equal(jumpCurve(1, 1).y, 0);
  assert.ok(jumpCurve(0.47, 1).y < -0.9);
});

test('rest poses', () => {
  assert.equal(restPose('sleeping').eyeOpen, 0);
  assert.deepEqual(Object.keys(restPose('working')).sort(), Object.keys(REST).sort());
});

test('same seed, same motion', () => {
  const a = new BotSim(0.42, 'working', {}), b = new BotSim(0.42, 'working', {});
  for (let i = 0; i < 300; i++) { a.update(1 / 60); b.update(1 / 60); }
  assert.deepEqual(a.pose, b.pose);
});
