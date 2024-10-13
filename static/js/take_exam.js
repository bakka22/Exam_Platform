var answers = '';
$(document).ready(function() {
    var exam_id = $('#exam_id').val();
    var answerCounter;
    console.log(exam_id);
    function fetch () {
        $.ajax({
            url: `http://localhost:5000/get_exam/${exam_id}`,
            method: 'GET',
            success: function(response) {
                // Handle the data returned from Flask
                var questionCount = +response.question_count;
                let timer;
                let i = 0;
                function showQuestion() {
                    console.log("question " + questionCount)
                    let question = response.questions[i];
                    var time_limit = +question.time_limit;
                    // console.log(question.time_limit);
                    // console.log(question.choices);
                    let content = '<p>' + question.content + '</p>';
                    let time_limit_p = '<p id="timer">' + question.time_limit + '</p';
                    $('#questions').append($(`<h4>Question ${i + 1}</h4>`));
                    $('#questions').append(time_limit_p);
                    $('#questions').append(content);
                    answerCounter = 1;
                    for (let choice of question.choices){
                        let choices = `<lable><input type="radio" id="answer${answerCounter}" name="answer" value="${answerCounter}">${choice}</lable><br>`;
                        $('#questions').append(choices)
                        console.log("answercounter ", + answerCounter);
                        answerCounter++;
                    }
                    const submit = $('<button type="submit">Submit</button>');
                    submit.click(function (event) {
                        event.preventDefault();
                        time_limit = 0
                    });
                    $('#questions').append(submit);
                    $('#questions').append('<br>');
                    clearInterval(timer);
                    timer = setInterval(function () {
                        time_limit--;
                        $('#timer').text(time_limit);
                        if (time_limit <= 0) {
                            clearInterval(timer);
                            answers += $(`input[name="answer"]:checked`).val() + "|;|;";
                            console.log(answers);
                            $('#questions').empty();
                            questionCount--;
                            i++;
                            if (questionCount <= 0) {
                                let form = $('<form method="POST"></form>')
                                form.append(`<input type="hidden" name="answers" value="${answers}">`);
                                $('#questions').append(form);
                                form.submit();
                                // window.location.href = 'http://localhost:5000/';
                            } else {
                                showQuestion();
                            }
                        }
                    }, 2000);
                }
                showQuestion();
            },
            error: function() {
                $('#result').html('<p>Error fetching data.</p>');
            }
        });
    }
    fetch();
});