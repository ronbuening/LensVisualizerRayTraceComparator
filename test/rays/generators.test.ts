// The ray generators that need nothing but numbers: lattices and fans on a plane in front of a lens.
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  cellCentres,
  cellCount,
  collimatedFan,
  collimatedGrid,
  divergingGrid,
  fieldDirection,
} from "../../src/rays/generators.ts";
import type { RayBundle } from "../../src/rays/generators.ts";

/** Ray `ray` of a bundle as `[origin, direction, weight]`. */
function rayOf(bundle: RayBundle, ray: number): [number[], number[], number] {
  return [
    [...bundle.origins.subarray(3 * ray, 3 * ray + 3)],
    [...bundle.directions.subarray(3 * ray, 3 * ray + 3)],
    bundle.weights[ray],
  ];
}

function bytes(bundle: RayBundle): string {
  return [bundle.origins, bundle.directions, bundle.weights]
    .map((values) => Buffer.from(values.buffer, values.byteOffset, values.byteLength).toString("hex"))
    .join("|");
}

test("an odd number of cells is raised to the next even one, unless the centre is asked for", () => {
  assert.deepEqual(
    [1, 2, 3, 32, 33].map((cells) => cellCount(cells)),
    [2, 2, 4, 32, 34],
  );
  assert.deepEqual(
    [1, 2, 3, 33].map((cells) => cellCount(cells, true)),
    [1, 2, 3, 33],
  );
  for (const cells of [0, -2, 2.5, NaN, Infinity]) {
    assert.throws(() => cellCount(cells), { message: `rays: a lattice needs at least 1 cell, got ${cells}` });
  }
});

test("cell centres are spread symmetrically to the last bit, and none of an even count is at the centre", () => {
  const { centres, step } = cellCentres(4, 5);
  assert.equal(step, 2.5);
  assert.deepEqual(centres, [-3.75, -1.25, 1.25, 3.75]);
  // A half width and a count that give no exact step: the mirror cells are still exact negatives of each other.
  for (const [count, halfWidth] of [
    [6, 1.1],
    [32, 10.0000001],
    [34, 7 / 3],
    [3, 0.3],
  ] as const) {
    const lattice = cellCentres(count, halfWidth);
    assert.equal(lattice.centres.length, count);
    lattice.centres.forEach((centre, index) => {
      assert.ok(centre === -lattice.centres[count - 1 - index], `${count} cells over ${halfWidth}, cell ${index}`);
      if (index > 0) assert.ok(centre > lattice.centres[index - 1]);
      assert.ok(Math.abs(centre) < halfWidth);
    });
    assert.equal(lattice.centres.includes(0), count % 2 === 1);
    assert.ok(Math.abs(lattice.step - (2 * halfWidth) / count) < 1e-15);
  }
  for (const halfWidth of [0, -1, NaN, Infinity])
    assert.throws(() => cellCentres(4, halfWidth), /a half width above 0/);
});

test("a field at a positive angle sends its rays toward -y, as unit vectors", () => {
  assert.deepEqual(fieldDirection(0), [0, 0, 1]);
  assert.ok(Object.is(fieldDirection(0)[1], 0), "no -0 for the axis");
  const [x, y, z] = fieldDirection(30);
  assert.equal(x, 0);
  assert.ok(Math.abs(y - -0.5) < 1e-15 && Math.abs(z - Math.sqrt(3) / 2) < 1e-15);
  assert.deepEqual(fieldDirection(-30), [0, -y, z]);
  for (const angle of [-89, -45, -0.001, 12.5, 60, 89.999]) {
    const direction = fieldDirection(angle);
    assert.ok(Math.abs(Math.hypot(...direction) - 1) < 1e-15, String(angle));
    assert.ok(direction[2] > 0 && Math.sign(direction[1]) === -Math.sign(angle), String(angle));
  }
  for (const angle of [90, -90, 120, NaN]) assert.throws(() => fieldDirection(angle), /between -90 and 90 degrees/);
});

test("a collimated lattice crosses its plane at the cell centres, row by row, and starts on the launch plane", () => {
  const grid = collimatedGrid({ fieldAngleDeg: 0, cells: 4, halfWidth: 8, planeZ: 0, launchZ: -10 });
  assert.deepEqual([grid.columns, grid.rows, grid.step], [4, 4, 4]);
  assert.equal(grid.weights.length, 16);
  assert.deepEqual([...grid.weights], new Array(16).fill(1));
  // Rows ascend in y, and within a row the columns ascend in x.
  assert.deepEqual(rayOf(grid, 0), [[-6, -6, -10], [0, 0, 1], 1]);
  assert.deepEqual(rayOf(grid, 1), [[-2, -6, -10], [0, 0, 1], 1]);
  assert.deepEqual(rayOf(grid, 4), [[-6, -2, -10], [0, 0, 1], 1]);
  assert.deepEqual(rayOf(grid, 15), [[6, 6, -10], [0, 0, 1], 1]);
  // No ray on the axis, in the meridional plane or in the sagittal plane.
  for (let ray = 0; ray < 16; ray++) assert.ok(grid.origins[3 * ray] !== 0 && grid.origins[3 * ray + 1] !== 0);
  // No zero of an axial bundle is a negative zero.
  assert.ok([...grid.origins, ...grid.directions].every((value) => !Object.is(value, -0)));
});

test("an oblique collimated lattice starts higher by the slope times the way to its plane", () => {
  const options = { fieldAngleDeg: 20, cells: 6, halfWidth: 9, planeZ: 2, launchZ: -18 };
  const grid = collimatedGrid(options);
  const direction = fieldDirection(20);
  const { centres } = cellCentres(6, 9);
  for (let row = 0; row < 6; row++) {
    for (let column = 0; column < 6; column++) {
      const [origin, aimed, weight] = rayOf(grid, row * 6 + column);
      assert.deepEqual(aimed, [...direction]);
      assert.equal(weight, 1);
      assert.equal(origin[2], -18);
      // Carried along its direction to the lattice plane, the ray is at its cell centre.
      const way = (2 - origin[2]) / aimed[2];
      assert.ok(Math.abs(origin[0] + way * aimed[0] - centres[column]) < 1e-13, `cell ${row}, ${column}`);
      assert.ok(Math.abs(origin[1] + way * aimed[1] - centres[row]) < 1e-13, `cell ${row}, ${column}`);
      // A positive field is an object toward +y: its rays come down from above.
      assert.ok(origin[1] > centres[row]);
    }
  }
  // A lattice off the axis is the same lattice moved.
  const moved = collimatedGrid({ ...options, center: [1.5, -4] });
  for (let ray = 0; ray < 36; ray++) {
    assert.ok(Math.abs(moved.origins[3 * ray] - grid.origins[3 * ray] - 1.5) < 1e-13);
    assert.ok(Math.abs(moved.origins[3 * ray + 1] - grid.origins[3 * ray + 1] + 4) < 1e-13);
  }
  assert.throws(() => collimatedGrid({ ...options, launchZ: 2 }), /the launch plane 2 is not in front of the plane 2/);
});

test("a lattice through its centre is only made when it is asked for", () => {
  const even = collimatedGrid({ fieldAngleDeg: 0, cells: 3, halfWidth: 6, planeZ: 0, launchZ: -5 });
  assert.equal(even.columns, 4);
  const odd = collimatedGrid({ fieldAngleDeg: 0, cells: 3, halfWidth: 6, planeZ: 0, launchZ: -5, throughCenter: true });
  assert.deepEqual([odd.columns, odd.rows, odd.weights.length], [3, 3, 9]);
  // The middle ray is the axis itself, and its row and its column lie in the planes of symmetry.
  assert.deepEqual(rayOf(odd, 4), [[0, 0, -5], [0, 0, 1], 1]);
  assert.equal(odd.origins[3 * 1], 0);
  assert.equal(odd.origins[3 * 3 + 1], 0);
});

test("a diverging lattice starts at the object point, is aimed at the cell centres and weighs the solid angle", () => {
  const objectPoint = [0, 30, -400] as const;
  const grid = divergingGrid({ objectPoint, cells: 4, halfWidth: 10, planeZ: 0 });
  assert.deepEqual([grid.columns, grid.rows, grid.step], [4, 4, 5]);
  const { centres } = cellCentres(4, 10);
  let straightest = 0;
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 4; column++) {
      const [origin, direction, weight] = rayOf(grid, row * 4 + column);
      assert.deepEqual(origin, [...objectPoint]);
      assert.ok(Math.abs(Math.hypot(...direction) - 1) < 1e-15);
      assert.ok(direction[2] > 0);
      const way = 400 / direction[2];
      assert.ok(Math.abs(origin[0] + way * direction[0] - centres[column]) < 1e-12);
      assert.ok(Math.abs(origin[1] + way * direction[1] - centres[row]) < 1e-12);
      // The solid angle of a cell, relative to one straight ahead of the point: the cube of the cosine.
      assert.ok(Math.abs(weight - direction[2] ** 3) < 1e-15, `cell ${row}, ${column}`);
      assert.ok(weight > 0 && weight <= 1);
      straightest = Math.max(straightest, weight);
    }
  }
  // The object is above the lattice: the top row is nearest to straight ahead, and weighs most.
  assert.equal(straightest, grid.weights[12 + 1]);
  assert.ok(grid.weights[12] > grid.weights[0]);
  assert.throws(
    () => divergingGrid({ objectPoint: [0, 0, 5], cells: 2, halfWidth: 1, planeZ: 0 }),
    /not in front of 0/,
  );
});

test("a fan lies on one line through the centre of its placement, along x or along y", () => {
  const options = { fieldAngleDeg: 10, cells: 5, halfWidth: 6, planeZ: 0, launchZ: -20 };
  const sagittal = collimatedFan({ ...options, axis: "x" });
  const meridional = collimatedFan({ ...options, axis: "y" });
  // Five cells are raised to six: no ray of a fan passes through the centre unless it is asked for.
  assert.equal(sagittal.weights.length, 6);
  const { centres } = cellCentres(6, 6);
  const rise = 20 * Math.tan((10 * Math.PI) / 180);
  for (let ray = 0; ray < 6; ray++) {
    assert.equal(sagittal.origins[3 * ray], centres[ray]);
    assert.ok(Math.abs(sagittal.origins[3 * ray + 1] - rise) < 1e-13);
    assert.equal(meridional.origins[3 * ray], 0);
    assert.ok(Math.abs(meridional.origins[3 * ray + 1] - (centres[ray] + rise)) < 1e-13);
    assert.deepEqual(rayOf(sagittal, ray)[1], [...fieldDirection(10)]);
    assert.equal(sagittal.weights[ray], 1);
    assert.equal(sagittal.origins[3 * ray + 2], -20);
  }
  const through = collimatedFan({ ...options, axis: "y", fieldAngleDeg: 0, throughCenter: true });
  assert.equal(through.weights.length, 5);
  assert.deepEqual(rayOf(through, 2), [[0, 0, -20], [0, 0, 1], 1]);
});

test("the generators are deterministic: the same request gives the same bytes", () => {
  const grid = () => collimatedGrid({ fieldAngleDeg: 17.3, cells: 32, halfWidth: 11.25, planeZ: 0, launchZ: -12.5 });
  const diverging = () => divergingGrid({ objectPoint: [0, 85.5, -500], cells: 32, halfWidth: 13.5, planeZ: 0 });
  const fan = () => collimatedFan({ axis: "y", fieldAngleDeg: -5, cells: 21, halfWidth: 4, planeZ: 1, launchZ: -9 });
  for (const make of [grid, diverging, fan]) assert.equal(bytes(make()), bytes(make()));
  assert.equal(grid().weights.length, 1024);
  assert.notEqual(
    bytes(grid()),
    bytes(
      collimatedGrid({ fieldAngleDeg: 17.3, cells: 32, halfWidth: 11.25, planeZ: 0, launchZ: -12.500000000000002 }),
    ),
  );
});
