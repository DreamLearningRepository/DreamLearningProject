

let spinner = document.getElementById('spinner');
spinner.style.display = 'none';
let csvFile = null;
let csvContent = null;
let separator = ""
mostrarInfoBox();


function clearOptionsContainer() {
    var div = document.getElementById("optionsContainer");
    if (div) {
        div.innerHTML = "";
    }
}

document.getElementById('csvFileInput').addEventListener('change', function (event) {
    csvFile = event.target.files[0]; // Corrigido para pegar o arquivo selecionado
    if (csvFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const text = e.target.result;
            csvContent = text; // Armazena o conteúdo do CSV
            processCSVgraphicAnalysis(text);
        };
        reader.readAsText(csvFile);
    }
});

document.getElementById("showSelections").addEventListener('click', function () {
    spinner.style.display = 'block';
    $('#associationRules').html("");
    const container = document.getElementById('optionsContainer');
    const selections = {};

    const divs = container.getElementsByTagName('div');
    Array.from(divs).forEach(div => {
        const label = div.getElementsByTagName('label')[0].textContent;
        const select = div.getElementsByTagName('select')[0];
        const selectedValue = select.value;
        selections[label] = selectedValue;
    });

    console.log("selections:\n");
    console.log(selections);

    const length = Object.keys(selections).length;
    console.log("Tamanho: " + length);

    if (csvFile) {
        const formData = new FormData();
        formData.append('csvFile', csvFile);
        formData.append('selections', JSON.stringify(selections));
        formData.append('separator', separator);

        fetch('/associationRulesPost', {
            method: 'POST',
            body: formData
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao fazer a solicitação.");
            }
            return response.json();
        })
        .then((data) => {
           document.getElementById("result").innerText = ""; 
           spinner.style.display = 'none';
           console.log(data.dados);
           $('#associationRules').html(data.dados);

           // Adiciona funcionalidade de arrastar para rolar horizontalmente
           let isDown = false;
           let startX;
           let scrollLeft;
           const slider = document.querySelector('.table-responsive');

           slider.addEventListener('mousedown', (e) => {
               isDown = true;
               slider.classList.add('active');
               startX = e.pageX - slider.offsetLeft;
               scrollLeft = slider.scrollLeft;
           });
           slider.addEventListener('mouseleave', () => {
               isDown = false;
               slider.classList.remove('active');
           });
           slider.addEventListener('mouseup', () => {
               isDown = false;
               slider.classList.remove('active');
           });
           slider.addEventListener('mousemove', (e) => {
               if(!isDown) return;
               e.preventDefault();
               const x = e.pageX - slider.offsetLeft;
               const walk = (x - startX) * 2; // 3 é a velocidade do deslocamento
               slider.scrollLeft = scrollLeft - walk;
           });
           document.getElementById("windowcode").innerHTML = data.code;
        })
        .catch((error) => {
            spinner.style.display = 'none';
            console.error("Erro:", error);
            document.getElementById("result").innerText = `Erro: ${error.message}`;
        });
    }
});

function processCSVgraphicAnalysis(csvText) {
    csvText = csvText.replace(/\r/g, '');
    const lines = csvText.split('\n');
    // Verifica se a primeira linha contém uma vírgula
    if (lines[0].includes(",")) {
        separator = ",";
    }
    // Se não, verifica se contém um ponto e vírgula
    else if (lines[0].includes(";")) {
        separator = ";";
    } else {
        console.error("Separador não reconhecido.");
        return;
    }
    console.log("Meu separator"+ separator)
    const headers = lines[0].split(separator);

    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    const metricTypes = [
        'lift',
        'confidence',
        'leverage',
        'conviction',
        'zhangs_metric'
    ];

    const graphOptions = headers;
    console.log(graphOptions)

    function createDropdown(labelText, options) {
        const div = document.createElement('div');
        div.className = "nes-select";
        
        const label = document.createElement('label');
        label.textContent = labelText;
        div.appendChild(label);

        const select = document.createElement('select');
        select.className = "nes-select";
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            select.appendChild(opt);
        });
        div.appendChild(select);

        return div;
    }


    
    container.appendChild(createDropdown("Escolha a Metrica de associação", metricTypes));
    const span = document.createElement('span');
    span.textContent = "*A metrica indicada é o lift"
    span.style.color = 'red';
    container.appendChild(span);
    container.appendChild(createDropdown("Escolha o identificador", graphOptions));
    container.appendChild(createDropdown("Escolha a coluna que agrupa os itens", graphOptions));
}


function mostrarInfoBox() {
    const infoBox = document.getElementById("info-box");
    document.getElementById("close-info-box").addEventListener("click", toggleInfoBox);
    infoBox.style.display = "block";
    infoBox.classList.add("show");
}

function toggleInfoBox() {
    const infoBox = document.getElementById("info-box");
    if (infoBox.style.display === "none" || infoBox.style.display === "") {
        infoBox.style.display = "block";
        infoBox.classList.add("show");
    } else {
        infoBox.style.display = "none";
        infoBox.classList.remove("show");
    }
}
