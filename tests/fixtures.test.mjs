import test from "node:test";
import assert from "node:assert/strict";
import { buildPeopleRows, createDeterministicClock, createSeededRandom } from "./fixtures.mjs";

test("createSeededRandom returns deterministic sequences for a seed", () => {
  const a = createSeededRandom(99);
  const b = createSeededRandom(99);

  const sequenceA = [a(), a(), a()];
  const sequenceB = [b(), b(), b()];

  assert.deepEqual(sequenceA, sequenceB);
});

test("buildPeopleRows advances deterministic timestamps using a shared clock", () => {
  const clock = createDeterministicClock({ startAt: "2024-03-01T00:00:00.000Z", stepMs: 500 });
  const rows = buildPeopleRows({ count: 3, seed: 7, clock });

  assert.deepEqual(
    rows.map((row) => row.createdAt),
    [
      "2024-03-01T00:00:00.000Z",
      "2024-03-01T00:00:00.500Z",
      "2024-03-01T00:00:01.000Z"
    ]
  );
  assert.deepEqual(
    rows.map((row) => row.id),
    [1, 2, 3]
  );
});
