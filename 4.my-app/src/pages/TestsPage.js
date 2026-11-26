import { useCallback, useEffect, useState } from 'react';
import './TestsPage.css';

import axios from 'axios';
//Адреса файлу із питаннями
const TESTS_URL = `${process.env.PUBLIC_URL}/tests/questions.json`;
//Адреса папки із фото
const IMAGES_URL = `${process.env.PUBLIC_URL}/tests/images`;
const EXAM_SECONDS = 20 * 60; //то хв на тест
const PASS_SCORE = 18; //Кількість правильних відповідей
//Для перетворення секуд на хвилини та секунди тобто форма 00:00
const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
};

const TestsPage = () => {
    //Список питаннь у тесті - напочатку 0
    const [questions, setQuestions] = useState([]);
    //Підвантаження даних - на початку вантажимо - true
    const [loading, setLoading] = useState(true);
    //Відповідає за помлки, які можуть бути
    const [error, setError] = useState(null);

    //Поточний номер питання в тесті
    const [current, setCurrent] = useState(0);
    //Що брав користувач - саме питання
    const [selected, setSelected] = useState(null);
    //Зберігає варіанти відповіді
    const [answers, setAnswers] = useState([]);
    //Час у секундах для тесту
    const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
    //Фіксує чи ми пройшли тест - на початку ми тільки проходимо тест, ще не кінець
    const [finished, setFinished] = useState(false);

    const loadQuestions = useCallback(async () => {
        //Фіксує, що у нас іде підвантаження даних
        setLoading(true);
        setError(null); //на початку помилок немає
        try {
            // const response = await fetch(TESTS_URL);
            // if (!response.ok) {
            //     throw new Error(`HTTP ${response.status}`);
            // }
            // const data = await response.json();
            //Завантажуємо питання
            const query = await axios.get(TESTS_URL);
            //Зберігаємо питання із файлу в data
            const data = query.data;
            console.log("List questions", data); //відображеннямо питання на консоль

            setQuestions(data); //Зберігаємо питання в state - в сам компонент
            //Масив відповідей користувача - він пустий,
            // але довжина його кількість питань
            setAnswers(new Array(data.length).fill(null));
            //поточне питання після завантаження
            setCurrent(0);
            //Яку відповідь обрав користвач
            setSelected(null);
            //Кількість секунд на тест
            setTimeLeft(EXAM_SECONDS);
            setFinished(false); //Тест не завершений
        } catch {
            setError('Не вдалося завантажити питання.');
        } finally {
            setLoading(false);
        }
    }, []);

    //Після ренедер комепонента, ми завантажуємо питання із файлу.
    //Для цього викликаємо асинхрону функцію async await
    //Тому, що useEffect не підтримує асихроність
    useEffect(() => {
        loadQuestions();
    }, [loadQuestions]); //Оновлення, якщо змінюється функція - хоча вона стала

    //Цей useEffect запускає таймер
    useEffect(() => {
        if (loading || error || finished) {
            return undefined;
        }
        //таймер буде спрацьовувати кожну секунду - 1000
        const timer = setInterval(() => {
            setTimeLeft((t) => Math.max(t - 1, 0));
        }, 1000); //Він буде оновляти часи у верху вікна
        return () => clearInterval(timer);
    }, [loading, error, finished]);

    //Якщо змінюється час, то ми перевіряємо чи не досягли 0, якщо
    //Час вийшов, то ми завершаємо тест
    useEffect(() => {
        if (timeLeft === 0) {
            setFinished(true);
        }
    }, [timeLeft]);

    //перехід на певний ідекс у питанні
    const goTo = (index) => {
        setCurrent(index);
        setSelected(null);
    };

    //
    // Next question without an answer, searching forward from `from` and wrapping around.
    const nextUnanswered = (list, from) => {
        for (let step = 1; step <= list.length; step++) {
            const index = (from + step) % list.length;
            if (list[index] === null) {
                return index;
            }
        }
        return -1;
    };

    //Обираємо питання
    const handleChoose = () => {
        if (selected === null) {
            return;
        }
        const updated = [...answers];
        updated[current] = selected;
        setAnswers(updated);

        const next = nextUnanswered(updated, current);
        if (next === -1) {
            setFinished(true);
        } else {
            goTo(next);
        }
    };

    //пропускаємо питання
    const handleSkip = () => {
        const next = nextUnanswered(answers, current);
        if (next !== -1) {
            goTo(next);
        }
    };

    //Відображаємо анімацію завантаження
    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Завантаження…</span>
                </div>
            </div>
        );
    }

    //Якщо маємо помилку, то її відображаємо на весь екран
    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button type="button" className="btn btn-outline-light btn-sm" onClick={loadQuestions}>
                        Повторити
                    </button>
                </div>
            </div>
        );
    }
    //Пошук правильної відповіді
    const isCorrect = (index) => answers[index] === questions[index].correct;
    //шукаємо кількість правильних відповідей
    const correctCount = questions.filter((_, i) => isCorrect(i)).length;

    //відображаємо, якщо у нас finish
    if (finished) {
        const passed = correctCount >= PASS_SCORE;
        return (
            <div className="container py-5">
                <div className={`alert ${passed ? 'alert-success' : 'alert-danger'}`}>
                    <h1 className="h3 fw-bold mb-2">{passed ? 'Іспит складено!' : 'Іспит не складено'}</h1>
                    <p className="mb-0">
                        Правильних відповідей: <strong>{correctCount}</strong> з {questions.length}.
                        Для успішного складання потрібно щонайменше {PASS_SCORE}.
                    </p>
                </div>

                <h2 className="h5 fw-bold mt-4 mb-3">Розбір відповідей</h2>
                <ol className="list-group list-group-numbered mb-4">
                    {questions.map((q, i) => (
                        <li className="list-group-item" key={q.id}>
                            <div className="fw-semibold mb-1">{q.question}</div>
                            {answers[i] === null ? (
                                <div className="text-warning">Без відповіді</div>
                            ) : (
                                <div className={isCorrect(i) ? 'text-success' : 'text-danger'}>
                                    Ваша відповідь: {q.answers[answers[i]]}
                                </div>
                            )}
                            {!isCorrect(i) && (
                                <div className="text-muted">Правильна відповідь: {q.answers[q.correct]}</div>
                            )}
                        </li>
                    ))}
                </ol>

                <button type="button" className="btn btn-primary btn-lg" onClick={loadQuestions}>
                    Пройти ще раз
                </button>
            </div>
        );
    }
    //отримуємо поточне питання
    const question = questions[current];
    //Чи є у нас відповідь на дане питання
    const answered = answers[current] !== null;

    //Для застовування класу для відповіді на питання
    const answerClass = (index) => {
        if (!answered) {
            return selected === index ? 'active' : '';
        }
        if (index === question.correct) {
            return 'list-group-item-success';
        }
        if (index === answers[current]) {
            return 'list-group-item-danger';
        }
        return '';
    };
    //Класи для відображення номера питань
    const numberClass = (index) => {
        if (index === current) {
            return 'btn-primary';
        }
        if (answers[index] === null) {
            return 'btn-outline-secondary';
        }
        return isCorrect(index) ? 'btn-success' : 'btn-danger';
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="h4 fw-bold mb-0">Іспит, як у сервісному центрі</h1>
                <span className={`fs-4 fw-semibold ${timeLeft < 60 ? 'text-danger' : ''}`} aria-label="Залишок часу">
                    {formatTime(timeLeft)}
                </span>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-4">
                {questions.map((q, i) => (
                    <button
                        type="button"
                        key={q.id}
                        className={`btn btn-sm pdr-test-number ${numberClass(i)}`}
                        onClick={() => goTo(i)}
                        aria-label={`Питання ${i + 1}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="pdr-test-card">
                <h2 className="h5 mb-3">{question.question}</h2>
                <div className="row g-4">
                    {question.image && (
                        <div className="col-12 col-lg-6">
                            <img
                                src={`${IMAGES_URL}/${question.image}`}
                                alt={`Ілюстрація до питання ${current + 1}`}
                                className="img-fluid rounded"
                            />
                        </div>
                    )}
                    <div className={question.image ? 'col-12 col-lg-6' : 'col-12'}>
                        <div className="list-group mb-4">
                            {question.answers.map((answer, i) => (
                                <button
                                    type="button"
                                    key={answer}
                                    className={`list-group-item list-group-item-action ${answerClass(i)}`}
                                    onClick={() => setSelected(i)}
                                    disabled={answered}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>

                        {!answered && (
                            <div className="d-flex justify-content-between gap-3">
                                <button type="button" className="btn btn-outline-light btn-lg px-4" onClick={handleSkip}>
                                    Пропустити
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success btn-lg px-4"
                                    onClick={handleChoose}
                                    disabled={selected === null}
                                >
                                    Обрати
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="text-end mt-3">
                <button type="button" className="btn btn-link" onClick={() => setFinished(true)}>
                    Завершити іспит
                </button>
            </div>
        </div>
    );
};

export default TestsPage;
