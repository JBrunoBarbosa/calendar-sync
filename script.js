// Função para enviar os arquivos PDF para o endpoint
async function enviarArquivosPDF(arquivos) {
    
    const tabelaContainer = document.getElementById('tabela-horarios-vagos');

    const endpoint = 'https://jbruno081br.pythonanywhere.com/api/horarios-vagos';
  
    const formData = new FormData();
    for (const arquivo of arquivos) {
      formData.append('file', arquivo);
    }
  
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.style.display = 'flex';
    tabelaContainer.style.display = 'none';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const tabelaHorariosVagos = await response.json();
        const dadosAlunos = tabelaHorariosVagos.DadosAlunos;
        const nomesAlunos = dadosAlunos.map(aluno => aluno.Nome);
        const cursosAlunos = dadosAlunos.map(aluno => aluno.Curso);
        const tabelaOrdenada = ordenarTabela(tabelaHorariosVagos.TabelaHorariosVagos);
        exibirTabela(tabelaOrdenada);
        exibirNomesAlunos(nomesAlunos, cursosAlunos);
      } else {
        console.error('Ocorreu um erro ao enviar os arquivos PDF:', response.status);
      }
    } catch (error) {
      console.error('Ocorreu um erro na requisição:', error);
    } finally {
      tabelaContainer.style.display = 'flex';
      loadingOverlay.style.display = 'none';
    }
  }
  
  // Função para ordenar a tabela pelos dias da semana
  function ordenarTabela(tabelaHorariosVagos) {
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const tabelaOrdenada = {};
  
    for (const dia of diasSemana) {
      const horarios = tabelaHorariosVagos.filter(item => item.Dia === dia);
      tabelaOrdenada[dia] = horarios.map(item => item.Horario);
    }
  
    return tabelaOrdenada;
  }
  
// Função para exibir a tabela de horários vagos no HTML
function exibirTabela(tabelaHorariosVagos) {
    const tabelaHtml = document.createElement('table');
  
    // Cabeçalho da tabela
    const cabecalhoHtml = document.createElement('tr');
    for (const dia in tabelaHorariosVagos) {
      const th = document.createElement('th');
      th.textContent = dia;
      cabecalhoHtml.appendChild(th);
    }
    tabelaHtml.appendChild(cabecalhoHtml);
  
    // Ordenar os horários em cada dia em ordem crescente
    for (const dia in tabelaHorariosVagos) {
      tabelaHorariosVagos[dia].sort();
    }
  
    // Calcular o número máximo de linhas
    const maxLinhas = Math.max(...Object.values(tabelaHorariosVagos).map(horarios => horarios.length));
  
    // Adicionar as linhas da tabela
    for (let i = 0; i < maxLinhas; i++) {
      const tr = document.createElement('tr');
      for (const dia in tabelaHorariosVagos) {
        const td = document.createElement('td');
        const horarios = tabelaHorariosVagos[dia];
        const horario = i < horarios.length ? horarios[i] : '';
        td.textContent = horario;
        tr.appendChild(td);
      }
      tabelaHtml.appendChild(tr);
    }
  
    const tabelaContainer = document.getElementById('tabela-horarios-vagos');
    tabelaContainer.innerHTML = '';
    tabelaContainer.appendChild(tabelaHtml);
  }
  
  // Função para exibir os nomes e cursos dos alunos na página
  function exibirNomesAlunos(nomesAlunos, cursosAlunos) {
    const nomesAlunosHtml = document.getElementById('nomes-alunos');
    

    nomesAlunosHtml.innerHTML = '';
  
    for (let i = 0; i < nomesAlunos.length; i++) {
      const nomeAluno = nomesAlunos[i];
      const cursoAluno = cursosAlunos[i];
  
      const nomeCursoAlunoHtml = document.createElement('div');
      nomeCursoAlunoHtml.textContent = `${nomeAluno} - ${cursoAluno}`;
  
      nomesAlunosHtml.appendChild(nomeCursoAlunoHtml);
      nomesAlunosHtml.style.display = 'block'
    }
  }
  
  // Função para atualizar o parágrafo com os nomes dos arquivos selecionados
  function exibirNomesArquivos() {
    const inputArquivos = document.getElementById('input-arquivos-pdf');
    const arquivosSelecionados = inputArquivos.files;
    const paragrafoArquivos = document.getElementById('arquivos-selecionados');
    const nomesAlunosHtml = document.getElementById('nomes-alunos');
    
    nomesAlunosHtml.style.display = 'none'
    
    if (arquivosSelecionados.length > 0) {
      let nomesArquivos = '';
      for (const arquivo of arquivosSelecionados) {
        nomesArquivos += arquivo.name + '<br>';
      }
      nomesArquivos = nomesArquivos.trim();
  
      paragrafoArquivos.innerHTML = nomesArquivos;
    } else {
      paragrafoArquivos.textContent = '';
    }
  }
  
  // Função para adicionar evento de alteração do input de arquivo
  function adicionarEventoInputArquivo() {
    const inputArquivos = document.getElementById('input-arquivos-pdf');
    inputArquivos.addEventListener('change', exibirNomesArquivos);
  }
  
  // Função para adicionar evento de clique do botão "Enviar"
  function adicionarEventoBotaoEnviar() {
    const btnEnviar = document.getElementById('btn-enviar');
    btnEnviar.addEventListener('click', function () {
      const arquivosPDF = document.getElementById('input-arquivos-pdf').files;
      enviarArquivosPDF(arquivosPDF);
    });
  }
  
  // Função para inicializar o script
  function inicializarScript() {
    adicionarEventoInputArquivo();
    adicionarEventoBotaoEnviar();
  }
  
  // Inicializar o script quando o DOM estiver pronto
  document.addEventListener('DOMContentLoaded', inicializarScript);
  