const express = require('express')
const cors = require('cors')
const app = express()
const yahooFinance = require('yahoo-finance2').default
const PORT = 3001

app.use(cors()) 
app.use(express.json())

app.post('/consulta', async (req, res) => {
    const fechamentos = {}
    let datas = []
    const ativosInvalidos = []
    const { ativos, data_inicio, data_fim } = req.body

    const ativosComSufixo = ativos.map((ativo) => ativo + '.SA')    
    const promessas = ativosComSufixo.map(async (ativoComSufixo) => {
        try {
            const historico = await yahooFinance.chart(ativoComSufixo, { period1: data_inicio, period2: data_fim, interval: '1d' })

            const valores = historico.quotes

            const fechamento = valores.map((dia) => dia.close)
            fechamentos[ativoComSufixo] = fechamento

            if (datas.length === 0 && valores.length > 0) {
                datas = valores.map(q => new Date(q.date).toLocaleDateString('pt-BR'))
            }
        } catch (erro) {
            ativosInvalidos.push(ativoComSufixo.replace('.SA', ''))
        }
    })

    await Promise.all(promessas)

    res.json({
        status: 'ok',
        dados: { datas, fechamentos },
        ativosInvalidos
    })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})
