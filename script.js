//------------ Variaveis globais ----------------

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();
var pontos = [];
var curvas = [pontos];
var avaliacoesCurva = 200;
var quant = 0; //quantidade de curvas / indice do array de curvas;
var pontosControle = 1;
var poligonaisControle = 1;
var exibirCurva = 1;
var moverSelecionado = false; //checa se o botão mover ponto foi selecionado
var noCirculo = false;


//------------ Mouse ----------------

canvas.addEventListener("mousedown", click); //executa a função click sempre que clickar com o mouse
function click() {
  if (event.which == 1 && !moverSelecionado) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    pontos.push({ x: x, y: y });
    curvas[quant] = pontos;
    jera();
  } else if (event.which == 1 && moverSelecionado) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let indice = estaNoCirculo(({ x: x, y: y }));
    if (noCirculo) {
      canvas.addEventListener("mouseup", onMouseUp = (event) => {
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseMove);
      });
      canvas.addEventListener("mousemove", onMouseMove = (event) => {
        curvas[quant][indice].x = event.clientX - canvas.getBoundingClientRect().left;
        curvas[quant][indice].y = event.clientY - canvas.getBoundingClientRect().top;
        jera();
      });
    }
    moverSelecionado = false;
    noCirculo = false;
    }
}

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  if (!moverSelecionado) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    excluirPonto(x, y);
  }
});

//------------ Funções de desenho ----------------

function jera() { //com j que jera mais
  context.clearRect(0, 0, myCanvas.width, myCanvas.height);
  for (k = 0; k < curvas.length; k++) {
    if (k == quant) {
      if (pontosControle) {
        for (c = 0; c < curvas[k].length; c++) {
          mostrarPonto(curvas[k][c].x, curvas[k][c].y, "#ffff40");
        }
      }
      if (poligonaisControle) {
        desenharReta(curvas[k], "#a0a0a0", 1);
      }
      if (exibirCurva) {
        let gradient = context.createLinearGradient(curvas[k][0].x, curvas[k][0].y, curvas[k][curvas[k].length - 1].x, curvas[k][curvas[k].length - 1].y);
        gradient.addColorStop("0", "rgba(254,182,171,1)");
        gradient.addColorStop("0.2" ,"rgba(254,217,171,1)");
        gradient.addColorStop("0.4", "rgba(255,242,174,1)");
        gradient.addColorStop("0.6", "rgba(204,235,197,1)");
        gradient.addColorStop("0.8", "rgba(179,226,205,1)");
        gradient.addColorStop("1.0","rgba(244,202,228,1)");
        desenharCurva(curvas[k], gradient, 3);
      }
    }
    else {
      if (pontosControle) {
        for (c = 0; c < curvas[k].length; c++) {
          mostrarPonto(curvas[k][c].x, curvas[k][c].y, "#b1d4db"); 
        }
      }
      if (poligonaisControle) {
        desenharReta(curvas[k], "#b1d4db", 1);
      }
      if (exibirCurva) {
        desenharCurva(curvas[k], "#b1d4db", 1);
      }
    }
  }
}

function mostrarPonto(x, y, cor) {
  context.beginPath();
  context.arc(x, y, 4.5, 0, 2 * Math.PI, true);
  context.moveTo(x, y);
  context.strokeStyle = cor;
  context.fillStyle = cor;
  context.fill();
  context.stroke();
}

function desenharReta(pontos, cor, linha) {
  for (v = 0; v < pontos.length - 1; v++) {
    let x2 = pontos[v + 1].x;
    let y2 = pontos[v + 1].y;
    context.lineWidth = linha;
    context.beginPath();
    context.moveTo(pontos[v].x, pontos[v].y);
    context.lineTo(x2, y2);
    context.strokeStyle = cor;
    context.stroke();
  }
}

function desenharCurva(pontos, cor, linha) {
  let curva = [];
  for (n = 0; n <= avaliacoesCurva; n++) {
    let ponto = deCasteljau(pontos, n);
    curva.push({ x: ponto.x, y: ponto.y });
  }
  desenharReta(curva, cor, linha);
}

function deCasteljau(pontos, n) {
  if (pontos.length > 1) {
    let aux = [];
    let xX;
    let yY;
    for (i = 0; i < pontos.length - 1; i++) {
      xX = pontos[i].x * (1 - (n / avaliacoesCurva)) + pontos[i + 1].x * (n / avaliacoesCurva);
      yY = pontos[i].y * (1 - (n / avaliacoesCurva)) + pontos[i + 1].y * (n / avaliacoesCurva);
      aux.push({ x: xX, y: yY });
    }
    return deCasteljau(aux, n);
  }
  else {
    return pontos[0];
  }
}

function excluirPonto(posX, posY) {
  indice = estaNoCirculo({ x: posX, y: posY });
  if (indice > -1) {
    pontos.splice(indice, 1);
    jera();
  }
}

function estaNoCirculo(ponto) {
  for (f = 0; f < pontos.length; f++) {
    var v = { x: pontos[f].x - ponto.x, y: pontos[f].y - ponto.y };
    if (Math.sqrt(v.x * v.x + v.y * v.y) <= 6) {
      noCirculo = true;
      return f;
    }
  }
  return -1;
}

//------------------ Botões -------------------

function novaCurva() {
  if (curvas[quant].length != 0) {
    pontos = [];
    quant = curvas.length;
    jera();
  }
}

function deletarCurva() {
  curvas.splice(quant, 1);
  quant = curvas.length - 1;
  if (quant == -1) {
    quant = 0;
    pontos = [];
  }
  else {
    pontos = curvas[quant];
  }
  jera();
}

function curvaAnterior() {
  if (quant > 0) {
    quant--;
    pontos = curvas[quant];
    jera();
  }
}

function proximaCurva() {
  if (quant < curvas.length - 1) {
    quant++;
    pontos = curvas[quant];
    jera();
  }
}

function mudarAvaliacao() {
  avaliacoesCurva = document.getElementById("avaliacoesCurva").value;
  jera();
}

function moverPonto() {
    moverSelecionado = true;
}

//---------------- Checkboxes -----------------

function pontosControleValue() {
  if (pontosControle) {
    pontosControle = 0;
  }
  else {
    pontosControle = 1;
  }
  jera();
}

function poligonaisControleValue() {
  if (poligonaisControle) {
    poligonaisControle = 0;
  }
  else {
    poligonaisControle = 1;
  }
  jera();
}

function exibirCurvasValue() {
  if (exibirCurva) {
    exibirCurva = 0;
  }
  else {
    exibirCurva = 1;
  }
  jera();
}
