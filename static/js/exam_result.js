$(document).ready(function() {
    var exam_id = $('#exam_id').val();
    function fetch () {
        $.ajax({
            url: `http://localhost:5000/get_exam_result/${exam_id}`,
            method: 'GET',
            success: function (response) {
                $.ajax({
                    url: `http://localhost:5000/get_exam/${exam_id}`,
                    method: 'GET',
                    success: function (response2) {
                        const exam_name = $(`<h1>${response2.name}</h1>`);
                        const examiner = $(`<h2>Examiner:  ${response2.examiner}</h2>`);
                        const score = $(`<h2>Score: ${response.score} out of ${response2.question_count}</h2>`)
                        $("#exam_info").append(exam_name);
                        $("#exam_info").append(examiner);
                        $("#exam_info").append(score);
                        var questionCount = +response2.question_count;
                        let i = 0;
                        function showQuestion() {
                            console.log("question " + questionCount)
                            let question = response2.questions[i];
                            // var time_limit = +question.time_limit;
                            // console.log(question.time_limit);
                            // console.log(question.choices);
                            let content = '<p>' + question.content + '</p>';
                            // let time_limit_p = '<p id="timer">' + question.time_limit + '</p';
                            $('#result').append($(`<h4>Question ${i + 1}</h4>`));
                            // $('#result').append(time_limit_p);
                            $('#result').append(content);
                            answerCounter = 1;
                            for (let choice of question.choices){
                                let choices;
                                if (answerCounter === +response.answers[i]) {
                                    choices = $(`<lable><input type="radio" disabled checked>${choice}</lable><br>`);
                                } else {
                                    choices = $(`<lable><input type="radio" disabled>${choice}</lable><br>`);
                                }
                                $('#result').append(choices)
                                console.log("answercounter ", + answerCounter);
                                answerCounter++;
                            }
                        }
                        for (; i < questionCount; i++){
                            showQuestion();
                        }
                    },
                    error: function () {
                        console.log('failed to get exam');
                    }
                })
            },
            error: function () {
                console.log('failed to get exam result');
            }
        });}
    fetch();
});