import React from "react";

const questions = [
  "Do you experience recurring skin redness?",
  "Does your skin often burn or sting?",
  "Does your skin often feel itchy?",
  "Do you repeatedly react to skincare products?",
];

export default function SensitivityQuestions({ answers, onChange, disabled }) {
  return <fieldset className="sensitivity-questions" disabled={disabled}>
    <legend>Skin sensitivity (optional)</legend>
    <p>Answer all four or skip this section. Each Yes adds one point; two or more means sensitivity reported. This self-report is separate from your photo estimate and is not a diagnosis.</p>
    {questions.map((question, index) => <label key={question}>
      <span>{question}</span>
      <select value={answers[index]} onChange={event => onChange(answers.map((answer, i) => i === index ? event.target.value : answer))}>
        <option value="">Choose</option><option value="0">No</option><option value="1">Yes</option>
      </select>
    </label>)}
    <button type="button" onClick={() => onChange(["", "", "", ""])}>Skip sensitivity questions</button>
  </fieldset>;
}
