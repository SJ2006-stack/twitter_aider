import React, { useState } from 'react'; 

function App() {
  const [companyName, setCompanyName] = useState(''); 
  var [tweetType, setTweetType] = useState('announcement'); 
  const [message, setMessage] = useState(''); 
  const [response, setResponse] = useState(null); 
  const [error, setError] = useState(null); 


 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 
    setResponse(null); 


    try {
      console.log("form is being submitted...."); 
      const res = await fetch('http://127.0.0.1:5001/generate', { // fetching from  week3 api which is running
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // json header
        },
        body: JSON.stringify({ // sending data
          company: companyName,
          tweetType: tweetType,
          message: message,
        }),
      });


      if (!res.ok) { // if things don't work out
        const errorText = await res.text();
        throw new Error(`API request failed: ${errorText}`); 
      }


      const data = await res.json();
      console.log('Full API Response:', data); // for debugging purpose, makes it more convinient to check errors
      setResponse(data); // set the response
    } catch (err) {
      console.log("Error happened:", err); 
      setError(err.message); // set error message
    }
  };


  // Helper to get the response item (handles array or object), i think this is needed
  const getResponseItem = () => {
    if (!response) return null; // if no response, return null
    return Array.isArray(response) && response.length > 0 ? response[0] : response; // check if array or object
  };


  const responseItem = getResponseItem(); // get the item


  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}> {/* main div */}
      <h1>Tweet Generator App</h1> {/* title */}
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
        <label> {/* label for company */}
          Enter a company name:
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)} // update state
            style={{ display: 'block', margin: '10px 0', width: '100%' }} // style
            required // required field
          />
        </label>
        <label>
          Select tweet type: {/* dropdown for type */}
          <select
            value={tweetType}
            onChange={(e) => setTweetType(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
          >
            <option value="announcement">Announcement</option> {/* options */}
            <option value="question">Question</option>
            <option value="general">general</option>
            <option value="update">Update</option>
          </select>
        </label>
        <label>
          Enter your message or topic: {/* message input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ display: 'block', margin: '10px 0', width: '100%' }}
            required
          />
        </label>
        <button type="submit">Predict&Generated </button> {/* submit button */}
      </form>


      {responseItem && responseItem.success && ( // if success
        <div style={{ marginTop: '20px' }}>
          <h2>Generated Tweet and Predicted Likes:</h2> {/* heading */}
          <div
            style={{ // styles for the box
              border: '2px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <p> Tweet Generated Successfully</p> {/* success message */}
            <p style={{ margin: '16px 0' }}>
              "{responseItem.generated_tweet}" {/* the tweet */}
            </p>
            <hr style={{ border: '1px dashed #ccc' }} /> {/* line */}
            <p> Predicted Likes: {responseItem.predicted_likes}</p> {/* likes */}
          </div>
        </div>
      )}


      {response && !responseItem?.success && ( // if not success
        <div style={{ marginTop: '20px', color: 'orange' }}>
          <p><strong>Warning:</strong> Tweet generation was not successful.</p> {/* warning */}
          <p>Details: {responseItem?.error || 'Check console for full response.'}</p> {/* details */}
        </div>
      )}


      {error && <p style={{ color: 'red' }}>Error: {error}</p>} {/* error display */}
    </div>
  );
}


export default App; // export the app
