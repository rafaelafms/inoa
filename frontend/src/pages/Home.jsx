import { useState } from 'react'
import './style.css' 
import Grafico from './components/Grafico'

function Home() {
  const [ativos, setAtivos] = useState([''])              // dado recebido
  const [data_inicio, setData_inicio] = useState('')      // dado recebido
  const [data_fim, setData_fim] = useState('')            // dado recebido
  const [valores, setValores] = useState(null)            // dado retornado
  const [datas, setDatas] = useState([])                  // dado retornado

  // Permite consultar mais de um ativo
  const handleAtivoChange = (index, value) => {
    const novosAtivos = [...ativos]
    novosAtivos[index] = value
    setAtivos(novosAtivos)
  }

  // Insere campo para adicionar ativos
  const adicionarAtivo = () => {
    setAtivos([...ativos, ''])
  }

  // Comunicacao com o back para envio e recebimento de informacoes
  const handleSubmit = async  (e) => {
    e.preventDefault() 

    const ativosValidos = ativos.filter((a) => a.trim() !== '')

    try {
      const resposta = await fetch('http://localhost:3001/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativos: ativosValidos, data_inicio, data_fim }),
      })

      const resultado = await resposta.json()
      setValores(resultado.dados.fechamentos)
      setDatas(resultado.dados.datas)

      setAtivos([''])
      setData_inicio('')
      setData_fim('')
    } catch (erro) {
      console.error('Erro ao enviar:', erro)
      alert('Erro ao enviar os dados')
    }
  }

  return (
    <div>
      <h1 className="titulo1">Preço de Fechamento de Ativos na B3</h1>
      <form onSubmit={handleSubmit}>
        <div class="campos-form">
          <div>
            <div>
              {ativos.map((ativos, index) => (
                <div id="ativos" style={{ marginBottom: '10px' }}>
                  <label class="campo" htmlFor="ativos">Ativo:
                    <input key={index} type="text" value={ativos} onChange={(e) => handleAtivoChange(index, e.target.value)} placeholder={'ex. PETR4'} required={index === 0} />
                  </label>
                </div>
              ))}
            </div>
            <button type="button" class="adicionar-ativo" onClick={adicionarAtivo}> + </button>
          </div>

          <label class="campo" htmlFor="data_inicio">Data início:
            <input id="data_inicio" type="date" value={data_inicio} onChange={(e) => setData_inicio(e.target.value)} required />
          </label>

          <label class="campo" htmlFor="data_fim">Data fim:
            <input id="data_fim" type="date" value={data_fim} onChange={(e) => setData_fim(e.target.value)} required />
          </label>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button type="submit" class="buscar">Enviar</button>
        </div>
      </form>

      {valores && <Grafico dados={valores} datas={datas} style={{ margin: 'auto' }} />}
    </div>
  )
}

export default Home
