import React, { useState } from 'react';
import axios from 'axios';

const FeelingInputComponent = ({ onSuggest }) => {
  const [text, setText] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "The user will give his current health condition. Suggest a specialist doctor or general physician based on the user's input. Respond with just one word like 'Cardiologist' or 'General physician'.",
            },
            {
              role: "user",
              content: `I am having ${text}. Suggest me the respective doctor specialist regarding to the disease given. Just return the doctor specialist in one word.`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
          },
        }
      );

      const doctorSuggestion = res.data.choices[0].message.content.trim();
      setResponse(doctorSuggestion);

      // 🔔 Notify parent (CheckHealth.js)
      if (onSuggest) {
        onSuggest(doctorSuggestion);
      }
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <div style={{ margin: "250px" }}>
      <h2 className="text-2xl font-semibold text-center mb-4">
        Describe how you are feeling
      </h2>
      <div className="form-floating">
        <textarea
          className="form-control w-full h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          id="floatingTextarea"
          placeholder="fever, headache"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <label htmlFor="floatingTextarea"> </label>
      </div>

      <button
        className="text-white px-6 py-2 rounded"
        style={{
          backgroundColor: "#00008B",
          position: "absolute",
          right: "750px",
        }}
        onClick={handleSubmit}
      >
        Suggest me
      </button>

      {response && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <strong>Suggestion:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default FeelingInputComponent;
