export default (router) => [
    router.get('/', (req, res) => {
        res.send('API is running... IN USER ROUTES');
    })

]