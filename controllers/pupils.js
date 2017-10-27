const Pupil = require('../models/pupil');

function homeworksIndex(req, res, next) {
  Pupil
    .findById(req.params.id)
    .exec()
    .then(pupil => res.json(pupil.homeworks))
    .catch(next);
}

function homeworksShow(req, res, next) {
  Pupil
    .findById(req.params.id)
    .exec()
    .then(pupil => {
      const hw = pupil.homeworks.id(req.params.homeworkId);
      return res.json(hw);
    })
    .catch(next);
}

function homeworksUpdate(req, res, next) {
  Pupil
    .findById(req.params.id)
    .exec()
    .then(pupil => {
      let updatedHomework = null;
      pupil.homeworks = pupil.homeworks.map(hw => {
        if(hw.id === req.params.homeworkId) {
          updatedHomework = Object.assign(hw, req.body);
          return updatedHomework;
        } else {
          return hw;
        }
      });
      return pupil.save().then(() => res.json(updatedHomework));
    })
    .catch(next);
}

function homeworksProblemUpdate(req, res, next) {
  Pupil
    .findById(req.params.id)
    .exec()
    .then(pupil => {
      let currentProblem = null;
      const hw = pupil.homeworks.id(req.params.homeworkId);
      hw.problems.map(prob => {
        if(prob.id === req.params.problemId) {
          currentProblem = Object.assign(prob, req.body);
          return currentProblem;
        } else {
          return prob;
        }
      });
      return pupil.save().then(() => res.json(currentProblem));
    })
    .catch(next);
}

module.exports = {
  homeworksIndex,
  homeworksShow,
  homeworksUpdate,
  homeworksProblemUpdate
};
