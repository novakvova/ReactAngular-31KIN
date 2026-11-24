const HomePage = () => {

    const topics = [
        { icon: '📘', title: 'Загальні положення', text: 'Основні терміни, обов\'язки водія та учасників руху.' },
        { icon: '🚦', title: 'Сигнали світлофора', text: 'Сигнали світлофора та регулювальника, їх значення.' },
        { icon: '🛑', title: 'Дорожні знаки', text: 'Попереджувальні, заборонні, наказові та інформаційні знаки.' },
        { icon: '〰️', title: 'Дорожня розмітка', text: 'Суцільні й переривчасті лінії, стрілки, пішохідні переходи.' },
        { icon: '⚠️', title: 'Пріоритет проїзду', text: 'Перехрестя, круговий рух, нерегульовані переходи.' },
        { icon: '🚗', title: 'Обгін і швидкість', text: 'Обмеження швидкості, правила обгону та зупинки.' },
    ];

    const tips = [
        'Розв\'язуй тести щодня по 20–30 хвилин — регулярність важливіша за тривалість.',
        'Розбирай помилки: після кожного неправильного питання читай пояснення.',
        'Зверни увагу на знаки й розмітку — на них буде багато питань.',
        'Перед іспитом пройди пробний екзамен за обмеженим часом.',
    ];



    return (
        <>
            <header className="pdr-hero text-center" id="top">
                <div className="container py-5">
                    <span className="badge rounded-pill pdr-badge mb-3">Підготовка до іспиту</span>
                    <h1 className="display-4 fw-bold">Готуємось до здачі ПДР</h1>
                    <p className="lead pdr-lead mx-auto">
                        Тести за темами, розбір знаків і правил та пробний екзамен.
                        Займайся зручно — з телефона чи комп'ютера.
                    </p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                        <button type="button" className="btn btn-primary btn-lg px-4">Почати тест</button>
                        <a href="#topics" className="btn btn-outline-light btn-lg px-4">Переглянути розділи</a>
                    </div>
                </div>
            </header>

            <section className="container py-4">
                <div className="row g-3 text-center">
                    <div className="col-12 col-md-4">
                        <div className="pdr-stat h-100">
                            <div className="fs-2">📝</div>
                            <div className="fw-semibold">Тести за темами</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="pdr-stat h-100">
                            <div className="fs-2">⏱️</div>
                            <div className="fw-semibold">Пробний іспит</div>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="pdr-stat h-100">
                            <div className="fs-2">💡</div>
                            <div className="fw-semibold">Пояснення відповідей</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container py-4" id="topics">
                <h2 className="h3 fw-bold mb-3">Розділи для вивчення</h2>
                <div className="row g-4">
                    {topics.map((topic) => (
                        <div className="col-12 col-sm-6 col-lg-4" key={topic.title}>
                            <div className="card pdr-card h-100">
                                <div className="card-body">
                                    <div className="fs-1 mb-2">{topic.icon}</div>
                                    <h3 className="h5 card-title">{topic.title}</h3>
                                    <p className="card-text text-muted">{topic.text}</p>
                                    <button type="button" className="btn btn-outline-primary btn-sm">Почати розділ</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container py-4" id="tips">
                <div className="pdr-tips">
                    <h2 className="h4 fw-bold mb-3">Поради перед іспитом</h2>
                    <ul className="list-unstyled mb-0">
                        {tips.map((tip) => (
                            <li className="d-flex gap-2 mb-2" key={tip}>
                                <span className="text-success">✔</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    )
}

export default HomePage;