const variaveis = [];
let regras = [];
let montaRegra = []
let regrasGet = []

function adicionarVariavel() {
  const nomeVariavel = document.getElementById("nomeVariavel").value;
  const valorVariavel = document.getElementById("valorVariavel").value;

  if (nomeVariavel && valorVariavel) {
    if (!variaveis[nomeVariavel]) {
      variaveis[nomeVariavel] = [];
    }
    variaveis[nomeVariavel].push(valorVariavel);
    document.getElementById("nomeVariavel").value = "";
    document.getElementById("valorVariavel").value = "";
    atualizarSelecoesRegras();
  }

  adicionarVariavel(nomeVariavel, valorVariavel)
}

function adicionarVariavel(nomeVariavel, valorVariavel) {
  fetch('http://localhost:3000/addvariable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: nomeVariavel, value: valorVariavel }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function adicionarValorRegra() {
  const selecionarVariavelRegra = document.getElementById("selecionarVariavelRegra");
  const selecionarValorRegra = document.getElementById("selecionarValorRegra");
  const nomeVariavel = selecionarVariavelRegra.value;
  const valorVariavel = selecionarValorRegra.value;

  if (nomeVariavel && valorVariavel) {
    const regra = `${nomeVariavel} = ${valorVariavel}`;
    montaRegra.push(regra);
    console.log("MONTA REGRA:", montaRegra);
  }
}

function adicionarRegra() {
  const selecionarVariavelRegra = document.getElementById("selecionarVariavelRegra");
  const selecionarValorRegra = document.getElementById("selecionarValorRegra");
  const nomeVariavel = selecionarVariavelRegra.value;
  const valorVariavel = selecionarValorRegra.value;
  let regra = null

  if (nomeVariavel && valorVariavel) {
    if (montaRegra.length === 0) {
      regra = `${nomeVariavel} = ${valorVariavel}`;
    } else {
      regra = montaRegra
    }

    enviarRegra(regra)

    atualizarListaRegras();
    montaRegra.splice(0, montaRegra.length);
  }
}

function enviarRegra(regra) {
  fetch('http://localhost:3000/addrule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ regras: regra }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

async function atualizarListaRegras() {
  const listaRegras = document.getElementById("listaRegras");
  listaRegras.innerHTML = "";

  await getRegras()

  regrasGet.forEach((regra, indice) => {
    const itemLista = document.createElement("li");
    itemLista.textContent = `${indice + 1}. ${regra.regras}`;
    listaRegras.appendChild(itemLista);
  });


  console.log("valor", regrasGet);
}

async function getRegras() {
  try {
    const response = await fetch('http://localhost:3000/rules', {
      method: 'GET',
    });
    if (response.ok) {
      const data = await response.json();
      regrasGet = data;
      console.log("regrasGet: ", regrasGet);
    } else {
      console.error('Erro:', response.status);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

function atualizarSelecoesRegras() {
  const selecionarVariavelRegra = document.getElementById("selecionarVariavelRegra");
  const selecionarValorRegra = document.getElementById("selecionarValorRegra");
  selecionarVariavelRegra.innerHTML = '<option value="">Selecione a Variável</option>';
  selecionarValorRegra.innerHTML = '<option value="">Selecione o Valor</option>';

  for (const variavel in variaveis) {
    const opcao = document.createElement("option");
    opcao.value = variavel;
    opcao.textContent = variavel;
    selecionarVariavelRegra.appendChild(opcao);
  }

  // Adiciona um ouvinte de evento para atualizar a seleção de valores quando uma variável é selecionada.
  selecionarVariavelRegra.addEventListener('change', function () {
    const variavelSelecionada = selecionarVariavelRegra.value;
    if (variavelSelecionada) {
      const valores = variaveis[variavelSelecionada];
      selecionarValorRegra.innerHTML = '<option value="">Selecione o Valor</option>';
      valores.forEach(valor => {
        const opcaoValor = document.createElement("option");
        opcaoValor.value = valor;
        opcaoValor.textContent = valor;
        selecionarValorRegra.appendChild(opcaoValor);
      });
    } else {
      selecionarValorRegra.innerHTML = '<option value="">Selecione o Valor</option>';
    }
  });
}

function executarSistemaEspecialista() {
  const resultado = avaliarRegras();
  document.getElementById("resultado").textContent = `Resultado: ${resultado}`;
}