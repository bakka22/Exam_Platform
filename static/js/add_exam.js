$(document).ready(function(event) {
    var questionCount = 0;
    var i = 0;
    choicesCounter = {0: 0, 1: 0, 2: 0}
    function deleteElement(event, ...elements) {
        event.preventDefault();
        elements.forEach(element => {
            if (element) {
                element.remove();
            }
        });
    }

    //--------------- add existing questions --------------
    function addExistingQuestion(i, contentValue, choicesValues, correctAnswersValues) {
        var choiceNumber = 0;
        var calcIdx = i;
        let question = $(`<div id="question${i}"><h4>Question ${i + 1}</h4></div>`);
        let deleteQuestion = $('<button>Delete Question</button>');
        let content = $(`<h6>Content</h6> <input value="${contentValue}" type="text" name="content${i}" required>`);
        let choices  = $(`<div id="choices${i}"></div>`);
        let time_limit = $(`<h6>time_limit</h6> <input value="4" type="text" name="time_limit${i}" required>`);
        let add_choice = $(`<button type="button" id="button${i}">Add Choice</button>`);
        // Append inputs to the question div
        question.append(deleteQuestion);
        question.append(time_limit);
        question.append(content);
        question.append('<h6>Choices</h6>');
        console.log('choiceNumber:', choiceNumber);
        for (; choiceNumber < choicesValues.length; choiceNumber++) {
            let choice = `<input value="${choicesValues[choiceNumber]}" type="text" id="choices${i}-${choiceNumber}" required >`;
            let correctAnswer;
            if (choiceNumber + 1 === +correctAnswersValues) {
                correctAnswer = `<input type="radio" name="correct${i}" value="${choiceNumber + 1}" required checked><br>`;
            } else {
                correctAnswer = `<input type="radio" name="correct${i}" value="${choiceNumber + 1}" required><br>`;
            }
            choices.append($(choice));
            choices.append($(correctAnswer));
            console.log(`before add to ${i}` + choicesCounter[i]);
            choicesCounter[i] += 1;
        }
        question.append(choices);
        question.append(add_choice);
        add_choice.click(function(event) {
            choicesCounter[i] += 1;
            let chn = choicesCounter[i]
            event.preventDefault();
            const newChoice = `<input value="dasd" type="text" placeholder="Choice${chn}" id="choices${i}-${chn}" required>`;
            const newCorrectAnswer = `<input type="radio" name="correct${i}" value="${chn + 1}" required><br>`
            console.log(`choices${i}-${chn}`);
            $(choices).append($(newChoice));
            $(choices).append($(newCorrectAnswer));
        });
        questions.append(question);
        deleteQuestion.click(function (event) {
            event.preventDefault();
            questionCount--;
            let collectorIdx = calcIdx + 1;
            let contents = [];
            let choicesList = [];
            let correctAnswersList = [];
            j = 0;
            for (; collectorIdx <= questionCount; collectorIdx++) {
                console.log('collectorIdx: ', collectorIdx);
                console.log('j: ', j);
                console.log($(`#choices0-1`).val());
                contents.push($(`#content${collectorIdx}`).val() || "");
                console.log(contents[j]);
                let questionChoices = [];
                let x = 0;
                console.log(`choices${collectorIdx}: `, $(`#choices${collectorIdx}`).length);
                for (; x <= choicesCounter[collectorIdx]; x++) {
                    questionChoices.push($(`#choices${collectorIdx}-${x}`).val() || "");
                    console.log(`choices${collectorIdx}-${x}`, $(`#choices${collectorIdx}-${x}`).val());
                }
                choicesList.push(questionChoices);
                correctAnswersList[j] = $(`#correct${collectorIdx}`).val();
                console.log(correctAnswersList[j]);
                j++;
            }
            collectorIdx = calcIdx;
            for (; collectorIdx <= questionCount; collectorIdx++) {
                deleteElement(event, $(`#question${collectorIdx}`));
            }
            j = 0;
            collectorIdx = calcIdx;
            console.log(questionCount, collectorIdx);
            for (; collectorIdx < questionCount; collectorIdx++) {
                console.log(`${collectorIdx}/${questionCount}`);
                console.log('one iter');
                console.log(`choicesList ${j}`, choicesList[j]);
                choicesCounter[collectorIdx] = -1;
                addExistingQuestion(collectorIdx, contents[j], choicesList[j], correctAnswersList[j]);
                j++;
            }
        });
    }

    //-------------- create form --------------
    const form = $('<form method="POST" class="exam-score-form" id="questions"></form>');
    form.on('submit', function () {
        const number_of_questions = `<input type="hidden" name="number_of_questions" value="${questionCount}">`;
        form.append($(number_of_questions));
        for (let j = 0; j < questionCount; j++){
            let choice = '';
            console.log(choicesCounter[j]);
            for (let x = 0; x <= choicesCounter[j]; x++){
                choice += $(`#choices${j}-${x}`).val() + '|;|;';
            }
            console.log(choice);
            choice = `<input type=hidden name="choices${j}" value="${choice}">`;
            // let correctAnswer =`<input type=hidden name="correct${j}" value="1">`;
            form.append(choice);
            // form.append(correctAnswer);
        }
    });

    //-----------add hidden inputs---------------
    const exam_name = `<label>Exam name<input type="text" name="exam_name"></label>`;
    // const examiner = `<input type="hidden" name="examiner" value="maha">`;
    form.append($(exam_name));
    form.append($('#examiner'));
    const questions = $('<div id="questions"></div>');
    //--------------- add questions --------------
    function addQuestion(i) {
        var choiceNumber = choicesCounter[i];
        var question = $(`<div id="question${i}"><h4>Question ${i + 1}</h4></div>`);
        var calcIdx = i;
        console.log(question.text());
        let deleteQuestion = $('<button>Delete Question</button>');
        let content = $(`<h6>Content</h6> <input type="text" name="content${i}" id="content${i}" required>`);
        let choices  = $(`<div id="choices${i}"></div>`);
        let choice = $(`<input type="text" placeholder="Choice${choiceNumber}" id="choices${i}-${choiceNumber}" required >`);
        let correctAnswer = $(`<input type="radio" name="correct${i}" value="${choiceNumber + 1}" required>`);
        let deleteChoice = $('<button>Delete Choice</button><br>');
        let time_limit = $(`<h6>time_limit</h6> <input type="text" name="time_limit${i}" required>`);
        let add_choice = $(`<button type="button" id="button${i}">Add Choice</button>`);
        deleteChoice.click(function (event) {
            deleteElement(event, choice, correctAnswer, deleteChoice);
            choicesCounter[i]--;
        });
        // Append inputs to the question div
        question.append(deleteQuestion);
        question.append(time_limit);
        question.append(content);
        question.append('<h6>Choices</h6>');
        choices.append($(choice));
        choices.append($(correctAnswer));
        choices.append(deleteChoice);
        question.append(choices);
        question.append(add_choice);
        add_choice.click(function(event) {
            choicesCounter[i] += 1;
            let chn = choicesCounter[i];
            event.preventDefault();
            const newChoice = $(`<input type="text" placeholder="Choice${chn + 1}" id="choices${i}-${chn}" required>`);
            const newCorrectAnswer = $(`<input type="radio" name="correct${i}" value="${chn + 1}" required>`);
            let deleteChoice2 = $('<button>Delete Choice</button><br>');
            deleteChoice2.click(function (event) {
                deleteElement(event, newChoice, newCorrectAnswer, deleteChoice2);
                choicesCounter[i]--;
            });
            console.log(`choices${i}-${chn}`);
            $(choices).append($(newChoice));
            $(choices).append($(newCorrectAnswer));
            $(choices).append($(deleteChoice2));
        });
        questions.append(question);
        questionCount++;
        deleteQuestion.click(function (event) {
            event.preventDefault();
            questionCount--;
            let collectorIdx = calcIdx + 1;
            let contents = [];
            let choicesList = [];
            let correctAnswersList = [];
            j = 0;
            for (; collectorIdx <= questionCount; collectorIdx++) {
                console.log('collectorIdx: ', collectorIdx);
                console.log('j: ', j);
                console.log($(`#choices0-1`).val());
                contents.push($(`#content${collectorIdx}`).val() || "");
                console.log(contents[j]);
                let questionChoices = [];
                let x = 0;
                console.log(`choices${collectorIdx}: `, $(`#choices${collectorIdx}`).length);
                for (; x <= choicesCounter[collectorIdx]; x++) {
                    questionChoices.push($(`#choices${collectorIdx}-${x}`).val() || "");
                    console.log(`choices${collectorIdx}-${x}`, $(`#choices${collectorIdx}-${x}`).val());
                }
                choicesList.push(questionChoices);
                correctAnswersList.push($(`#correct${collectorIdx}`).val());
                console.log('correct:', $(`#correct${collectorIdx}`).val());
                console.log(correctAnswersList[j]);
                j++;
            }
            collectorIdx = calcIdx;
            for (; collectorIdx <= questionCount; collectorIdx++) {
                deleteElement(event, $(`#question${collectorIdx}`));
            }
            j = 0;
            collectorIdx = calcIdx;
            console.log(questionCount, collectorIdx);
            for (; collectorIdx < questionCount; collectorIdx++) {
                console.log(`${collectorIdx}/${questionCount}`);
                console.log('one iter');
                console.log(`choicesList ${j}`, choicesList[j]);
                choicesCounter[collectorIdx] = -1;
                addExistingQuestion(collectorIdx, contents[j], choicesList[j], correctAnswersList[j]);
                j++;
            }
        });
    }

    //-------------Generate 3 questions--------------
    for (; i < 3; i++) {
        addQuestion(i);
    }



    //-------------Append the submit button to the form--------------
    form.append(questions);
    const add_question = $('<button>Add Question</button>');
    add_question.click(function (event) {
        event.preventDefault();
        choicesCounter[questionCount] = 0;
        addQuestion(questionCount);
    });
    const submit = '<button type="submit">Submit</button>';
    form.append(add_question);
    form.append(submit);
    
    //---------------Add the form to the container----------------
    $('#form-container').append(form);

});
