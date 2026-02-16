const DEFAULT_SEED = 61;

const MODULUS = 2 ** 32;
const MULTIPLIER = 1664525;
const INCREMENT = 1013904223;

export const createSeededRandom = (seed = DEFAULT_SEED) => {
  let state = seed >>> 0;
  return () => {
    state = (MULTIPLIER * state + INCREMENT) % MODULUS;
    return state / MODULUS;
  };
};

export const createDeterministicClock = ({
  startAt = "2024-01-01T00:00:00.000Z",
  stepMs = 1_000
} = {}) => {
  let current = new Date(startAt).getTime();
  return {
    now() {
      return new Date(current).toISOString();
    },
    tick(steps = 1) {
      current += steps * stepMs;
      return this.now();
    }
  };
};

export const buildPeopleRows = ({
  count,
  seed = DEFAULT_SEED,
  clock = createDeterministicClock()
}) => {
  const rand = createSeededRandom(seed);
  const roles = ["Engineer", "Designer", "PM"];
  const cities = ["Austin", "Seattle", "Denver"];

  return Array.from({ length: count }, (_, index) => {
    const id = index + 1;
    const role = roles[Math.floor(rand() * roles.length)];
    const city = cities[Math.floor(rand() * cities.length)];
    const createdAt = index === 0 ? clock.now() : clock.tick();

    return {
      id,
      name: `Person ${String(id).padStart(5, "0")}`,
      role,
      city,
      createdAt
    };
  });
};

export const buildCsvFile = ({
  name = "people.csv",
  type = "text/csv",
  size = 128
} = {}) => ({ name, type, size });
