export const Ops = {
  None: -1,
  Control: 0,
  Flip: 1,
};

export function compute(inputBits, operations) {
  let outputBits = inputBits.map((v) => v);
  for (const ops of operations) {
    const controlsSatisfied = ops.every(
      (op, idx) => op !== Ops.Control || (op === Ops.Control && outputBits[idx])
    );
    if (controlsSatisfied) {
      outputBits = outputBits.map((value, idx) =>
        ops[idx] === Ops.Flip ? !value : value
      );
    }
  }
  return outputBits;
}
