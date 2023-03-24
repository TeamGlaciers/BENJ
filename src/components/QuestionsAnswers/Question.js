import React, {useState, useEffect} from 'react';
import Answer from './Answer.js';
import QaStatus from '../sharedComponents/QaStatus.js';
import HelpfulQA from './HelpfulQA.js';
import {useSelector, useDispatch} from 'react-redux';
import questionsAnswersSlice from '../../reducers/questionsAnswersSlice.js'
import { apiPutRequest } from "../../helpers/api.js";
import axios from 'axios';

// Question component to house:
// Answer and HelpfulStatus components
const Question = ({loadMore, setLoadMore, handleAddAnswer, product, moreQuestions}) => {

  const filteredQuestions = useSelector((state) => state.questionsAnswersReducer.filteredQuestions);

  const [displayAnswers, setDisplayAnswers] = useState(true);
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState(null);
  let [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  var firstFour = filteredQuestions.slice(0,4);

  let getFirstTwo = (question) => {
    let firstTwo = Object.keys(question.answers).slice(0,2);
    return firstTwo;
  }

  let handleHelpfulCount = (question) => {
    return {
      helpfulCount: question.question_helpfulness
    };
  };

  const token = process.env.API_KEY;

  const headers = {
    'Authorization': token
  };

  var handleQuestionHelpfulClick = (e, question) => {

    let id = question.question_id;
    console.log(id, question)

    if (!loading) {
      setLoading(true);
      apiPutRequest(`/qa/questions/${question.question_id}/helpful`)
        .then(() => {
          dispatch(questionsAnswersSlice.actions.incrementHelpfulness({ question_id: question.question_id }));
        })
        .catch((err) => {
          console.log("error occured when trying to increase helpfulness", err);
        })
        .finally(() => setLoading(false));
    }
  };

  var handleQuestionReportClick = () => {

  };

  var handleQuestionDisplay = (e, index) => {
    e.preventDefault();
    // setDisplayAnswers(!displayAnswers);
    setClickedQuestionIndex(clickedQuestionIndex === index ? null: index);
    setLoadMore(false);
  };

  return (
    <div className='max-h-[700px] overflow-y-auto'>
      {moreQuestions ?
      <div>
      {firstFour.map((question, index) => {
        return (
          <div key={question.question_id + '/' + question.question_helpfulness} className='question py-10 max-h-[600px] overflow-y-auto'>
            <h3>
              <span className='QAheader text-lg'>Q: </span>
              <a key={index} className ='questionHeader font-bold text-lg' onClick={(e) => handleQuestionDisplay(e, index)} href=''>{question.question_body}</a>
              <span className='float-right'>
                <HelpfulQA
                  handleHelpfulClick={(e) => handleQuestionHelpfulClick(e, question)}
                  data={handleHelpfulCount(question)}
                  handleAddAnswer={handleAddAnswer}
                  question={question} />
              </span>
            </h3>
            <Answer answers={question.answers}
              QaStatus={QaStatus}
              loadMore={loadMore}
              firstTwo={getFirstTwo(question)}
              setLoadMore={setLoadMore}
              displayAnswers={displayAnswers && clickedQuestionIndex === index} />
          </div>
        )
      })}
    </div>
    :
    <div>
      {filteredQuestions.map((question, index) => {
        return (
          <div key={question.question_id + '/' + question.question_helpfulness} className='question py-10 max-h-[600px] overflow-y-auto'>
            <h3>
              <span className='QAheader text-lg'>Q: </span>
              <a key={index} className ='questionHeader font-bold text-lg' onClick={(e) => handleQuestionDisplay(e, index)} href=''>{question.question_body}</a>
              <span className='float-right'>
                <HelpfulQA
                  handleHelpfulClick={(e) => handleQuestionHelpfulClick(e, question)}
                  data={handleHelpfulCount(question)}
                  handleAddAnswer={handleAddAnswer}
                  question={question} />
              </span>
            </h3>
            <Answer answers={question.answers}
              QaStatus={QaStatus}
              loadMore={loadMore}
              firstTwo={getFirstTwo(question)}
              setLoadMore={setLoadMore}
              displayAnswers={displayAnswers && clickedQuestionIndex === index} />
          </div>
        )
      })}
    </div>}
    </div>
  );

};

export default Question;