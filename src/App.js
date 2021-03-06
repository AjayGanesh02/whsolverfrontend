import { useState } from 'react';
import Results from './components/results/results';
import Board from './components/board/board';
import Switch from "react-switch";
import ClipLoader from "react-spinners/ClipLoader";
import './app.scss';

function App() {

  const APIURL = 'https://api.whsolver.ajayganesh.com/solve?board='

  //handle user inputs
  const [input, setInput] = useState("");
  const [prevInput, setPrevInput] = useState("");
  const [sortres, setSortres] = useState(true);
  const [boardInput, setBoardInput] = useState(false);
  const [textInput, setTextInput] = useState(true);

  //hold results
  const [results, setResults] = useState([]);

  //hold conditional display logic
  //loading is whether the results are being fetched/rendered
  //submitted is whether a valid input was submitted
  //error is whether the fetch returned an error or not
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  

  const handleInput = (e) => {
    setInput(e.target.value);
  }

  const handleToggle = () => {
    setSortres(!sortres);
  }

  const handleSubmit = async (e) => {
    //prevent default form submission
    e.preventDefault();

    //clear previous results
    setLoading(true);
    setResults([]);
    setSubmitted(false);

    //get results from API and assign
    const response = await fetch(`${APIURL}${input}` + (sortres ? '&sort=true' : '&sort=false'));
    const jsonresponse = await response.json();
    if (jsonresponse.data[0] === "Invalid board string") {
      setError(true);
      setSubmitted(false);
    } else {
      setPrevInput(input)
      setInput("");
      setError(false);
      setResults(jsonresponse.data);
      setSubmitted(true);
    }
    setLoading(false);

  }

  return (
    <div className="App">

      <header>
        <div className='textbox'>
          <h1>Word Hunt Solver</h1>
          <h3>by Ajay Ganesh</h3>
          <p>This site finds the possible words that can be made from a 4x4 grid of letters.
            It can be used for games in the style of the iMessage game Word Hunt.
            <br />
          </p>
        </div>
      </header>

      <main>
        <div className='form'>
          <form onSubmit={handleSubmit}>
            { textInput ? 
              <label>
              Enter your board as a string of 16 non-separated letters:<br />
              <input className='text' type="text" value={input} onChange={handleInput} maxLength={16} />
            </label>
            :<></>}
            {boardInput ?
            <label>
              Enter your board below:<br />

            </label> 
            :<></>}
            <br />
            <label>
              Sort results by length:<br />
              <Switch className='toggle' onChange={handleToggle} checked={sortres} height={20} width={50} />
            </label>
            <br />
            <label>
              <input className='submit' type="submit" value="Submit" />
            </label>
          </form>
        </div>

        {input && textInput ? <Board input={input} big={true} />:<></>}

        <div className='results'>
          {error ? <div className='error'><p>Invalid Board submitted. Please try again.</p></div>: <></>}
          <Results results={results} submitted={submitted} board={prevInput} />
          <ClipLoader color='green' loading={loading} />
        </div>


        <div className='textbox'>
          <h3>How does this site work?</h3>
          <p>Your board string is sent to a python API at <a href="https://api.whsolver.ajayganesh.com">api.whsolver.ajayganesh.com</a>.
            Here, a depth first search algorithm tries every possible combination of letters, stopping if the first few characters don't make a legal word.
            This info is sorted by word length if the sort toggle is turned on. 
            Pro tip: if the toggle is turned off, the solver returns words that start
            near the top left corner of the board first. This way, the words are arranged in a manner that arranges their starting locations
            in order, which might lead to you entering them in faster!
            <br /><br />
            The React frontend code for this site can be found <a href="https://github.com/AjayGanesh02/whsolverfrontend">here</a>, 
            and the Python API code can be found <a href="https://github.com/AjayGanesh02/whsolverbackend">here</a>.</p>
        </div>

      </main>
    </div>
  );
}

export default App;
