import React from 'react';
import { Ops, compute } from './shared';
import { useState, useEffect } from 'react';

export const DataContext = React.createContext();

export function DataProvider({ children }) {
  const [inputBits, setInputBits] = useState([0, 1, 0, 1]);

  const [name, setName] = useState('Untitled');

  useEffect(() => {
    const last = localStorage.getItem('current');
    if (last) {
      setName(last);
    }
  }, [setName]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const [operations, setOperations] = useState([
    [Ops.None, Ops.Control, Ops.Flip, Ops.None],
  ]);

  let outputBits = compute(inputBits, operations);

  const [tests, setTests] = useState([]);

  function changeOperation(stepIndex, bitIndex) {
    setOperations((steps) =>
      steps.map((step, i) => {
        if (i === stepIndex) {
          return step.map((op, j) => {
            if (j === bitIndex) {
              // Cycle through operation types
              return (op + 1) % Object.keys(Ops).length;
            } else {
              return op;
            }
          });
        } else {
          return step;
        }
      })
    );
  }

  function toggleTestBit(type, testIndex, bitIndex) {
    setTests(
      tests.map((test, ti) => {
        if (ti === testIndex) {
          const newTest = { ...test };
          newTest[type][bitIndex] = newTest[type][bitIndex] ? 0 : 1;
          return newTest;
        } else {
          return test;
        }
      })
    );
  }

  function removeTest(testIndex) {
    setTests(tests.filter((_, i) => i !== testIndex));
  }

  function addTest() {
    setTests([
      ...tests,
      {
        input: Array(inputBits.length).fill(0),
        output: Array(inputBits.length).fill(0),
      },
    ]);
  }

  function removeBit() {
    const len = inputBits.length - 1;
    setInputBits(inputBits.slice(0, len));
    setOperations(operations.map((ops) => ops.slice(0, len)));
  }

  function addBit() {
    setInputBits([...inputBits, 0]);
    setOperations(operations.map((ops) => [...ops, Ops.None]));
  }

  function save() {
    const data = JSON.parse(localStorage.getItem('save') || '{}');
    data[name] = {
      inputBits,
      operations,
      tests,
    };
    localStorage.setItem('save', JSON.stringify(data, null, 3));
    localStorage.setItem('current', name);
  }

  function load() {
    const data = JSON.parse(localStorage.getItem('save') || '{}');
    if (data[name]) {
      setInputBits(data[name].inputBits);
      setOperations(data[name].operations);
      setTests(data[name].tests);
      localStorage.setItem('current', name);
    }
  }

  function clear() {
    setInputBits(inputBits.fill(0));
    setOperations(operations.map((ops) => ops.map(() => Ops.None)));
    setTests([]);
  }

  const value = {
    name,
    inputBits,
    setInputBits,
    setName,
    tests,
    outputBits,
    operations,
    changeOperation,
    toggleTestBit,
    addTest,
    removeTest,
    removeBit,
    addBit,
    save,
    clear,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
