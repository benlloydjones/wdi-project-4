import React from 'react';
import Axios from 'axios';
import Auth from '../../lib/Auth';
import AutosizeInput from 'react-input-autosize';

import ProblemCreateWrapper from './ProblemCreateWrapper';

import '../../scss/partials/_createHomeworkStyles.scss';

class CreateHomework extends React.Component {

  state =
    {
      homework: {
        name: '',
        hasBeenSubmitted: false,
        problems: [],
        setDate: new Date(),
        dueDate: (new Date()).toISOString().slice(0, 10)
      },
      newProblemVisible: false,
      errors: null
    };

  componentDidMount() {
    this.addProblemToHw();
  }

  componentDidUpdate() {
    this.scrollToCreateProblem();
  }

  addProblemToHw = () => {
    this.setState(prevState => {
      const problems = prevState.homework.problems.concat({
        feedback: null,
        description: '',
        starterCode: '#Starter Code...',
        pupilCode: '#Starter Code...'
      });
      const resultObj = Object.assign({}, prevState);
      resultObj.homework.problems = problems;
      return resultObj;
    });
  }

  handleChangeHomework = ({ target: { name, value }}) => {
    const oldHomework = Object.assign({}, this.state.homework);
    oldHomework[name] = value;
    this.setState({ homework: oldHomework }, () => console.log(this.state));
  }

  createHomework = (e) => {
    e.preventDefault();
    const newHomework = this.state.homework;
    newHomework.setDate = new Date();
    newHomework.teacherId = Auth.getPayload().teacherId;
    Axios
      .post('/api/homeworks', newHomework)
      .then(() => this.props.history.push('/pupils'))
      .catch(err => console.log(err));
  };

  handleChangeProblem = ({ target: { name, value }}, index) => {
    this.setState(prevState => {
      const newProblems = prevState.homework.problems.map((prob, i) => {
        if (i === index) {
          if( name !== 'starterCode') {
            return Object.assign(prob, {[name]: value });
          } else {
            return Object.assign(prob, {[name]: value, pupilCode: value });
          }
        } else {
          return prob;
        }
      });
      const newState = Object.assign({}, prevState);
      newState.homework.problems = newProblems;
      return newState;
    }, () => console.log(this.state));
  }

  handleCodeBlockChange = (codeValue) => {
    const problem = Object.assign(this.state.problem, {starterCode: codeValue, pupilCode: codeValue});
    this.setState(prevState => {
      const newState = Object.assign({} , prevState);
      newState.problem = problem;
      return newState;
    });
  }

  deleteProblem(index) {
    const currentHomework = Object.assign({}, this.state.homework);
    const updatedProblems = currentHomework.problems.filter((problem, problemIndex) => problemIndex !== index);
    currentHomework.problems = updatedProblems;
    this.setState({ homework: currentHomework });
  }

  scrollToCreateProblem = () => {
    // this.createProblem.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <main className="container homework">
        <div className="homework-background"></div>
        <div className="homework-wrapper">

          <div className="main-title top-space">
            <div className="title-input">
              <div className='title-input-wrapper'>
                <AutosizeInput
                  className="title is-1"
                  name="name"
                  value={this.state.homework.name}
                  placeholder="Homework name"
                  onChange={this.handleChangeHomework}
                  autoFocus
                  autoComplete="off"
                />
                <i className="fa fa-pencil" />
              </div>
            </div>
            <div className="date-input">
              <p>Due date: </p>
              <input
                name="dueDate"
                className="input"
                type="date"
                value={this.state.homework.dueDate}
                onChange={this.handleChangeHomework}
              />
            </div>
          </div>

          {this.state.homework && this.state.homework.problems.map((problem, i) => {
            return (
              <div key={i}>
                <ProblemCreateWrapper
                  questionNum = {i + 1}
                  {...problem}
                  handleChange={(e) => this.handleChangeProblem(e, i)}
                  deleteProb={() => this.deleteProblem(i)}
                />
              </div>
            );
          })}

          {!this.state.newProblemVisible && <a className="with20margin" onClick={this.addProblemToHw}>Add another question</a>}
          <button className="button is-info" onClick={this.createHomework}>Create and Set Homework</button>
        </div>
      </main>
    );
  }
}

export default CreateHomework;
