const test = require('node:test');
const assert = require('node:assert/strict');
const {questions, failures, evaluateAnswer} = require('../game-rules.js');
const expected = ['possession','waiting','erased','reversed','diary','replacement','refusal'];
test('seven questions have four unique options and exactly one answer', () => {
  assert.equal(questions.length, 7);
  for (const q of questions) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(o => o[0])).size, 4);
    assert.equal(q.options.filter(o => o[0] === q.answer).length, 1);
  }
});
test('all correct answers lead only to archive after question seven', () => {
  questions.forEach((q,i) => assert.deepEqual(evaluateAnswer(i,q.answer), {valid:true,correct:true,question:i+1,ending:i===6?'archive':null}));
});
test('every wrong option maps to its question-specific bad ending', () => {
  questions.forEach((q,i) => q.options.filter(([v]) => v !== q.answer).forEach(([v]) => {
    const result = evaluateAnswer(i,v);
    assert.equal(result.correct,false);
    assert.equal(result.question,i+1);
    assert.equal(result.ending,expected[i]);
  }));
  assert.equal(new Set(failures.map(r => r.ending)).size,7);
});
test('missing and unrecognised answers never enter an ending', () => {
  for(const index of [-1,0,6,7]) for(const value of [undefined,'','not-an-option']) assert.deepEqual(evaluateAnswer(index,value),{valid:false});
});
