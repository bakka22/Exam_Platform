$(document).ready(function () {
    var exam_id = $('#exam_id').val();
    let questionCount = 0;
    let i = 0;
    $.ajax({
        url: `http://localhost:5000/get_exam_answers/${exam_id}`,
        method: 'GET',
        success: function (response2) {
            $.ajax({
                url: `http://localhost:5000/get_exam/${exam_id}`,
                method: 'GET',
                success: function (response) {
                    const correct_answers = response2;
                    choicesCounter = {}
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
                    const exam_name = `<label>Exam name<input type="text" name="exam_name" value="pedo" disabled></label>`;
                    // const examiner = `<input type="hidden" name="examiner" value="maha">`;
                    form.append($(exam_name));
                    const questions = $('<div id="questions"></div>');

                    //--------------- add existing questions --------------
                    function addExistingQuestion(i, contentValue, choicesValues) {
                        var choiceNumber = 0;
                        let con = response.questions[i].content || contentValue;
                        let choival = choicesValues || response.questions[i].choices;
                        let choinum = choicesValues.length || +response.questions[i].number_of_choices;
                        let question = $(`<div id="question${i}"><h4>Question ${i + 1}</h4></div>`);
                        let content = $(`<h6>Content</h6> <input value="${con}" type="text" name="content${i}" required>`);
                        let choices  = $(`<div id="choices${i}"></div>`);
                        let time_limit = $(`<h6>time_limit</h6> <input value="4" type="text" name="time_limit${i}" required>`);
                        let add_choice = $(`<button type="button" id="button${i}">Add Choice</button>`);
                        // Append inputs to the question div
                        question.append(time_limit);
                        question.append(content);
                        question.append('<h6>Choices</h6>');
                        console.log('number of choices', response.questions[i].number_of_choices);
                        console.log('choiceNumber:', choiceNumber);
                        for (; choiceNumber < choinum; choiceNumber++) {
                            let choice = `<input value="${choival[choiceNumber]}" type="text" id="choices${i}-${choiceNumber}" required >`;
                            let correctAnswer;
                            if (choicesValues) {
                                if (choiceNumber + 1 === +correct_answers[i]) {
                                    correctAnswer = `<input type="radio" name="correct${i}" value="${choiceNumber + 1}" required checked><br>`;
                                }
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
                        questionCount++;
                    }
                    //-------------add previous questions--------------
                    for (; i < +response.question_count; i++) {
                        choicesCounter[i] = -1;
                        addExistingQuestion(i);
                    }
                    //--------------- add questions --------------
                    function addQuestion(i) {
                        var choiceNumber = choicesCounter[i];
                        let question = $(`<div id="question${i}"><h4>Question ${i + 1}</h4></div>`);
                        let content = $(`<h6>Content</h6> <input value="fsdfs" type="text" name="content${i}" required>`);
                        let choices  = $(`<div id="choices${i}"></div>`);
                        let choice = `<input value="fadsfds" type="text" placeholder="Choice${choiceNumber}" id="choices${i}-${choiceNumber}" required >`;
                        let correctAnswer = `<input type="radio" name="correct${i}" value="${choiceNumber + 1}" required><br>`
                        let time_limit = $(`<h6>time_limit</h6> <input value="4" type="text" name="time_limit${i}" required>`);
                        let add_choice = $(`<button type="button" id="button${i}">Add Choice</button>`);

                        // Append inputs to the question div
                        question.append(time_limit);
                        question.append(content);
                        question.append('<h6>Choices</h6>');
                        choices.append($(choice));
                        choices.append($(correctAnswer));
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
                        questionCount++;
                    }
                    //-------------Append the submit button to the form--------------
                    form.append(questions);
                    const add_question = $('<button>Add Question</button>');
                    add_question.click(function (event) {
                        event.preventDefault();
                        choicesCounter[i] = 0;
                        addQuestion(i);
                        i++;
                    });
                    const submit = '<button type="submit">Submit</button>';
                    form.append(add_question);
                    form.append(submit);

                    //---------------Add the form to the container----------------
                    $('#form-container').append(form);
                    
                },
                error: function () {
                    console.log('failed')
                }
            });
        },
        error: function() {
            console.error('faild');
        }
    });
});