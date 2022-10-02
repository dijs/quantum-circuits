import styles from '../styles/Home.module.css';
import classnames from 'classnames';
import { Ops, compute } from './shared';

export function Bit({ value, onToggle, label }) {
  return (
    <label
      onClick={() => onToggle && onToggle()}
      className={classnames(styles.bitInput, { [styles.on]: value })}
    >
      {label}
    </label>
  );
}

export function Operation({ type, onChange }) {
  return (
    <div
      onClick={() => onChange()}
      className={classnames(styles.op, {
        [styles.control]: type === Ops.Control,
        [styles.flip]: type === Ops.Flip,
        [styles.none]: type === Ops.None,
      })}
    />
  );
}

export function Step({ ops, onChange }) {
  return (
    <div className={styles.step}>
      {ops.map((op, idx) => (
        <Operation key={idx} type={op} onChange={() => onChange(idx)} />
      ))}
    </div>
  );
}

export function Test({
  input,
  output,
  operations,
  onInputToggle,
  onOutputToggle,
  onRemove,
}) {
  const expected = output.join('');
  const actual = compute(input, operations)
    .map((e) => (e ? 1 : 0))
    .join('');
  const pass = actual === expected;

  const a = Number.parseInt(input.slice(0, 2).reverse().join(''), 2);
  const b = Number.parseInt(input.slice(2, 4).reverse().join(''), 2);
  const c = Number.parseInt(output.slice(2, 4).reverse().join(''), 2);

  return (
    <div className={classnames(styles.test, { [styles.pass]: pass })}>
      <div onClick={onRemove} className={styles.removeTest}>
        ➕
      </div>
      <div className={styles.testInput}>
        <header>IN</header>
        <div className={styles.hint}>
          {a},{b}
        </div>
        {input.map((value, i) => (
          <Bit key={i} value={value} onToggle={() => onInputToggle(i)} />
        ))}
      </div>
      <div className={styles.testExpected}>
        <header>OUT</header>
        <div className={styles.hint}>{c}</div>
        {output.map((value, i) => (
          <Bit key={i} value={value} onToggle={() => onOutputToggle(i)} />
        ))}
      </div>
    </div>
  );
}
