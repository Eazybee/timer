import * as React from "react"; // in modern version, you don't need to import 
import * as ReactDOM from "react-dom";
import { Component, ClassAttributes } from "react";

const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number;
}

// define state type and add it instead of `any`
class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any; // should be number
  laps: any[]; // should be number[]

  constructor(props: StopwatchProps) {
    super(props);
    this.state = {
      secondsElapsed: props.initialSeconds,
      lastClearedIncrementer: null,
    };
  
    // it is good practice to declare/initialize all class property in the constructor
    // Also incrementer property should be part of the state based on how it is used
    // Also laps should be part of the state based on how it is used
    this.laps = [];

    // You need to bind the handleFunctions or use arrow function
    // this.handleStartClick = this.handleStartClick.bind(this);
    // this.handleStopClick = this.handleStopClick.bind(this);
    // this.handleResetClick = this.handleResetClick.bind(this);
    // this.handleLabClick = this.handleLabClick.bind(this);
    // this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleStartClick() {
    // FIRST ISSUE
    // This will cause memory leakage
    // if i click on start, this function will be called but no state is update untill atleast 1000ms,
    // Hence, no re-render immediately, giving me room to click on start multiple time before the 1000ms
    // The problem is `this.incrementer` will be intialized without clearing the old Interval running.
    // SOLUTION: clear interval before reassignment and add incrementer to the state.
      
    // SECOND ISSUE
    // setInterval goes into the callback and will only call the callback function AT LEAST after 1000ms
    // This means that based on the callback queue, it can take more than 1000ms before it triggers, making this counter not perfect
    // ALSO, when updating the UI this frequent, it is better to use requestAnimationFrame. Read more https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout
    // SOLUTION: use Refresh Animation frame, Take time stamps and calculate the difference
    this.incrementer = setInterval(
      () =>
        this.setState({
          secondsElapsed: this.state.secondsElapsed + 1,
        }),
      1000
    );
  }

  handleStopClick() {
    clearInterval(this.incrementer);
    this.setState({
      lastClearedIncrementer: this.incrementer,
    });
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.laps = [], // use ';'  remove comma
      this.setState({
        secondsElapsed: 0,
      });
  }

  handleLabClick() { // handleLapsClick : spelling 
    this.laps = this.laps.concat([this.state.secondsElapsed]);
    // Make laps part of the state so that it is reactive, rather than call forceUpdate
    this.forceUpdate();
  }

  handleDeleteClick(index: number) {
    return () => this.laps.splice(index, 1);
  }

  render() {
    const { secondsElapsed, lastClearedIncrementer } = this.state;

    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
        {secondsElapsed === 0 || this.incrementer === lastClearedIncrementer ? (
          <button
            type="button"
            className="start-btn"
            onClick={this.handleStartClick}
          >
            start
          </button>
        ) : (
          <button
            type="button"
            className="stop-btn"
            onClick={this.handleStopClick}
          >
            stop
          </button>
        )}
        {secondsElapsed !== 0 && this.incrementer !== lastClearedIncrementer ? (
          <button type="button" onClick={this.handleLabClick}>
            lap
          </button>
        ) : null}
        {secondsElapsed !== 0 && this.incrementer === lastClearedIncrementer ? (
          <button type="button" onClick={this.handleResetClick}>
            reset
          </button>
        ) : null}
        <div className="stopwatch-laps">
          {this.laps && 
          /** add key when generating component in a loop */
            this.laps.map((lap, i) => (
              <Lap
                index={i + 1}
                lap={lap}
                onDelete={this.handleDeleteClick(i)}
              />
            ))}
        </div>
      </div>
    );
  }
}

const Lap = (props: { index: number; lap: number; onDelete: () => {} }) => ( // onDelete should return void
  <div key={props.index} className="stopwatch-lap"> {/** You don't need the key here */}
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={props.onDelete}> X </button>
  </div>
);

ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  document.getElementById("content")
);
