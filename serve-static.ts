const fastify = require('fastify')()
const path = require('path')

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'client/dist'),
})

const start = async () => {
    try {
        await fastify.listen(4200)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
