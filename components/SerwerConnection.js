class SerwerConnection {
    getResults() {
        return (
            fetch('https://tgryl.pl/quiz/results')
            .then((response) => response.json())
            .then((json) => {return json})
            .catch((error) => console.error(error))
        )
    }
    sendResult(data) {
        return (
            fetch('https://tgryl.pl/quiz/result', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((json) => {return json;})
            .catch((error) => console.error(error))
        )
    }
    getTests() {
        return (
            fetch('https://tgryl.pl/quiz/tests')
            .then((response) => response.json())
            .then((json) => {return json})
            .catch((error) => console.error(error))
        )
    }
    getTestData(id) {
        return (
            fetch('https://tgryl.pl/quiz/test/' + id)
            .then((response) => response.json())
            .then((json) => {return json})
            .catch((error) => console.error(error))
        )
    }
}

export default new SerwerConnection();