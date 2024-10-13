$(document).ready(function(event) {
    let questionCount = 0;
    let i = 0;
    choicesCounter = {0: 0, 1: 0, 2: 0}
    //-------------- create form --------------
    const form = $('<form method="POST" class="exam-score-form" id="questions"></form>');
    form.on('submit', function () {
        for (let j = 0; j < questionCount; j++){
            let choice = '';
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
        form.append(question);
        questionCount++;
    }

    //-------------Generate 3 questions--------------
    for (; i < 3; i++) {
        addQuestion(i);
    }


    //-----------add hidden inputs---------------
    const exam_name = `<input type="text" name="exam_name" value="pedo">`;
    // const examiner = `<input type="hidden" name="examiner" value="maha">`;
    const number_of_questions = `<input type="hidden" name="number_of_questions" value="${questionCount}">`;
    form.append($(exam_name + number_of_questions));
    form.append($('#examiner'));

    //-------------Append the submit button to the form--------------
    const submit = '<button type="submit">Submit</button>';
    form.append(submit);
    
    //---------------Add the form to the container----------------
    $('#form-container').append(form);

});
