import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Grafico({ dados, datas }) {
  const dadosFormatados = datas.map((data, index) => {
    const ponto = { data }
    for (const ativo in dados) {
      ponto[ativo] = dados[ativo][index] || null
    }
    return ponto
  })

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={dadosFormatados}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(dados).map((ativo, index) => (
            <Line
              key={ativo}
              type="monotone"
              dataKey={ativo}
              stroke={['#8884d8', '#82ca9d', '#ff7300', '#ff0000', '#8BA6AC'][index % 5]}
              dot={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Grafico
