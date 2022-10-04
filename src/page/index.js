//vari[aveis globais;

let diaSemanaSelecionado = "";

//LOCAL STORAGE
function inicializaLocalStorage() {
  localStorage.setItem("Segunda-feira", JSON.stringify([]));

  localStorage.setItem("Terça-feira", JSON.stringify([]));

  localStorage.setItem("Quarta-feira", JSON.stringify([]));

  localStorage.setItem("Quinta-feira", JSON.stringify([]));

  localStorage.setItem("Sexta-feira", JSON.stringify([]));

  localStorage.setItem("Sábado", JSON.stringify([]));

  localStorage.setItem("Domingo", JSON.stringify([]));
}
inicializaLocalStorage();

function excluirLocalStorage() {
  localStorage.clear();
  inicializaLocalStorage();
  insereCardAPartirDoLocalStorage("Segunda-feira");
}

function apagarAtividade(divId, diaDaSemana) {
  const itemsDoDia = JSON.parse(localStorage.getItem(diaDaSemana));
  //busca os cards que nao devem ser excluidos
  const novosItemsSemana = itemsDoDia.filter((item) => item.id != divId);
  //remove todos os cards do localstorage para esse dia da semana
  localStorage.removeItem(diaDaSemana);

  //se não houver mais tarefas, inserir array vazio no local storage
  if (!novosItemsSemana[0]) {
    localStorage.setItem(diaDaSemana, JSON.stringify([]));
  } else {
    //se houver mais tarefas, inserir array sem a atividade apagada
    localStorage.setItem(diaDaSemana, JSON.stringify(novosItemsSemana));
  }
  //insere novamente os cards
  insereCardAPartirDoLocalStorage(diaDaSemana);
}

function apagarPorDiaDaSemana() {
  localStorage.removeItem(diaSemanaSelecionado);
  localStorage.setItem(diaSemanaSelecionado, JSON.stringify([]));
  insereCardAPartirDoLocalStorage(diaSemanaSelecionado);
}

function criarAtividade() {
  //obtem o valor do select de dias da semana
  const selectTedOption = document.getElementsByClassName("weekday-select")[0];
  const diaSelecionado = selectTedOption[selectTedOption.selectedIndex].text;

  const itemsCards = localStorage.getItem(diaSelecionado);

  const descricaoAtividade = document.getElementById(
    "atividade-descricao"
  ).value;

  const horarioAtividade = document.getElementById("appt").value;

  const dadosNovaAtividade = {
    descricao: descricaoAtividade,
    dia: diaSelecionado,
    hora: horarioAtividade,
    id: itemsCards.length + 1,
  };
  insereNovaAtividadeLocalStorage(diaSelecionado, dadosNovaAtividade);
}

function insereNovaAtividadeLocalStorage(diaDaSemana, atividade) {
  const itemsCards = localStorage.getItem(diaDaSemana);
  const atividades = JSON.parse(itemsCards);

  atividades.push(atividade);

  localStorage.removeItem(diaDaSemana);

  localStorage.setItem(diaDaSemana, JSON.stringify(atividades));

  insereCardAPartirDoLocalStorage(diaDaSemana);
}

function buscarCardsPeloDiaDaSemanaViaBotao(buttonClicked) {
  diaSemanaSelecionado = buttonClicked.innerHTML;
  insereCardAPartirDoLocalStorage(buttonClicked.innerHTML);
}

function insereCardAPartirDoLocalStorage(diaDaSemana) {
  const nomesClassesCardTarefas = {
    "Segunda-feira": "card-segunda-feira",
    "Terça-feira": "card-terca-feira",
    "Quarta-feira": "card-quarta-feira",
    "Quinta-feira": "card-quinta-feira",
    "Sexta-feira": "card-sexta-feira",
    Sábado: "card-sabado",
    Domingo: "card-domingo",
  };

  const nomesClassesHorarios = {
    "Segunda-feira": "card-color-horario-segunda-feira",
    "Terça-feira": "card-color-horario-terca-feira",
    "Quarta-feira": "card-color-horario-quarta-feira",
    "Quinta-feira": "card-color-horario-quinta-feira",
    "Sexta-feira": "card-color-horario-sexta-feira",
    Sábado: "card-color-horario-sabado",
    Domingo: "card-color-horario-domingo",
  };

  const itemsCards = localStorage.getItem(diaDaSemana);

  const cardsParaInserir = JSON.parse(itemsCards);

  const scrollHorizontal = document.getElementsByClassName(
    "scrollbar-horizontal"
  )[0];

  const divPrincipalHorarios = document.getElementsByClassName("horarios")[0];

  //apaga card do HMTL antes de inserir novos de acordo com o dia da semana selecionado
  while (scrollHorizontal.firstChild) {
    scrollHorizontal.removeChild(scrollHorizontal.firstChild);
  }

  while (divPrincipalHorarios.firstChild) {
    divPrincipalHorarios.removeChild(divPrincipalHorarios.firstChild);
  }

  //Insere um card parada item do dia da semana contido no localstorage
  if (cardsParaInserir.length) {
    cardsParaInserir.map((card) => {
      //cria a div principal para o card
      const primeiraDiv = document.createElement("div");
      primeiraDiv.className = "card-tarefa";
      primeiraDiv.id = card.id;

      //cria a segunda div para o card
      const segundaDiv = document.createElement("div");
      //busca o nome da class a ser aplicada
      segundaDiv.className = nomesClassesCardTarefas[card.dia];
      segundaDiv.id = "card-padrao";

      //Cria um h1 e atribui a descricao da tarefa
      const novoCardTexto = document.createElement("p");
      novoCardTexto.innerHTML = card.descricao;
      novoCardTexto.id = "texto-descricao";

      const botaoApagar = document.createElement("button");
      botaoApagar.className = "btn-apagar";
      botaoApagar.innerHTML = "Apagar";
      botaoApagar.onclick = () => apagarAtividade(card.id, card.dia);

      segundaDiv.appendChild(novoCardTexto);
      segundaDiv.appendChild(botaoApagar);
      primeiraDiv.appendChild(segundaDiv);
      scrollHorizontal.appendChild(primeiraDiv);

      //insere card de horario da respectiva tarefa
      const novaDivHorario = document.createElement("div");
      novaDivHorario.className = `card-horario ${
        nomesClassesHorarios[card.dia]
      }`;

      const novoCardHorario = document.createElement("p");
      novoCardHorario.innerHTML = card.hora;
      novoCardHorario.id = "texto-horario";

      novaDivHorario.appendChild(novoCardHorario);
      const filtraHorariosDuplicados = cardsParaInserir.filter(
        (itemCard) => itemCard.hora == card.hora
      );
      // if (filtraHorariosDuplicados.length > 1) {
      //   const divPrincipalCards = document.getElementById(
      //     "div-principal-tarefas"
      //   );
      //   //scrollbar-horizontal-conflit
      //   divPrincipalCards.className = "scrollbar-horizontal-conflito";
      //   const imagemConflitos = document.createElement("img");
      //   imagemConflitos.src = "../assets/img/linha-conflito.svg";
      //   imagemConflitos.className = "img-zindex";
      //   novaDivHorario.appendChild(imagemConflitos);
      // }
      divPrincipalHorarios.appendChild(novaDivHorario);
    });
  }
}
//RELÓGIO HORA E DATA
const meses = {
  0: "Janeiro",
  1: "Fevereiro",
  2: "Março",
  3: "Abril",
  4: "Maio",
  5: "Junho",
  6: "Julho",
  7: "Agosto",
  8: "Setembro",
  9: "Outubro",
  10: "Novembro",
  11: "Dezembro",
};
function configurarHoraEDataHeader() {
  today = new Date();
  horas = today.getHours();
  minutos = today.getMinutes();
  dia = today.getDate();
  ano = today.getFullYear();
  mes = today.getMonth();
  document.getElementById("horarioHeader").innerHTML = horas + ":" + minutos;
  document.getElementById(
    "dataHeader"
  ).innerHTML = `${dia} de ${meses[mes]} de ${ano}`;
  setTimeout("configurarHoraEDataHeader()", 500);
}