let spinner = document.getElementById('spinner');
spinner.style.display = 'none';
var parametersColection = {}
var filename;
var csvBase64 = ""
var datalistOptions;
var radioButtons = document.querySelectorAll('input[type="radio"]')
const valCheckBox={
    "Linear Simples":[],
    "Linear Multipla":[],
    "Polinomial":[],
    "SVM": ["kernel"],
    "Arvore de Decisão":["max_depth", "random_state"],
    "Floresta Aleatória": ["n_estimator", "criterion","max_depht","random_state"],
    "XGBOOST":["n_estimators", "max_depth", "learning_rate", "objective", "random_state"],
    "LIGHTGBM":["num_leaves","max_depth","learning_rate", "n_estimators", "random_state"],
    "CATBOOST":["iterations", "learning_rate", "depth", "random_state"]
} 

let values = Object.keys(valCheckBox);

function csvToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
}


document.addEventListener("DOMContentLoaded", function () {
    var separator = "";
    var csvFileInput = document.getElementById("csv_file");
    var regressionSelect = document.getElementById("regression");
    var parametersDiv = document.getElementById("parameters");
    var featuresDiv = document.getElementById("features");
    var resultDiv = document.getElementById("result");
    var posicaoDiv = document.getElementById("posicao");
    var reader;
    var selectedOption = "";
    var deployBoolean = "";
    var crossVal = "";


    const radioButtonsCrossValidation = document.querySelectorAll('input[name="answer-dark 1"]');
    const radioButtons = document.querySelectorAll('input[name="answer-dark"]');
    const deployDiv = document.querySelector('.deploy');


    
    function toggleCrossValidation() {
        const selectedValue = document.querySelector('input[name="answer-dark 1"]:checked').value;
    
        console.log("Escolha: " + selectedValue)
        if (selectedValue === 'yes') {
            crossVal = "true";
        } else {
            crossVal = "false";
        }
    }

    function toggleDeployDiv() {
        const selectedValue = document.querySelector('input[name="answer-dark"]:checked').value;
        console.log("Escolha: " + selectedValue)
        if (selectedValue === 'yes') {
            deployDiv.style.display = 'block';
            deployBoolean = "true";
        } else {
            document.getElementById("result1").innerHTML = ""
            deployDiv.style.display = 'none';
            deployBoolean = "false";
        }
    }

    // Adiciona o event listener para cada rádio button
    radioButtonsCrossValidation.forEach(radio => {
        radio.addEventListener('change', toggleCrossValidation);
    });

    // Adiciona o event listener para cada rádio button
    radioButtons.forEach(radio => {
        radio.addEventListener('change', toggleDeployDiv);
    });

    // Verifica o estado inicial dos rádios
    toggleCrossValidation();
    toggleDeployDiv();














    regressionSelect.addEventListener("change", function () {
        resultDiv.innerHTML = "";
        selectedOption = regressionSelect.options[regressionSelect.selectedIndex].text;
        parametersDiv.innerHTML = "";


        // if (selectedOption === "SIMPLE LINEAR" || selectedOption === "POLYNOMIAL") {
        //     hideElement(featuresDiv);
        // } else {
        //     showElement(featuresDiv);
        // }
        // Se a opção selecionada for "SIMPLE LINEAR" e houver um arquivo CSV selecionado
        if (selectedOption === "SIMPLE LINEAR" || selectedOption === "POLYNOMIAL" && csvFileInput.files.length > 0) {
            handleCSVFile(csvFileInput.files[0]);
            parametersColection = {}
        }
        else if (selectedOption === "SUPPORT VECTORS(SVR)") {
            console.log("chegou");
            parametersColection = {
                kernel: "text"
            };
            
            datalistOptions = {
                kernel: ["linear", "poly", "rbf", "sigmoid", "precomputed"]
            };

            createParameters(1, parametersColection, datalistOptions);
        }
        else if (selectedOption === "DECISION TREE") {
            console.log("chegou");
            parametersColection = {
                max_depth: "number",
                random_state: "number"
            };
            
            datalistOptions = {
                max_depth:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                random_state: [0, 1, 2, 3, 4, 5]
            };

            createParameters(2, parametersColection, datalistOptions);
        }
        else if (selectedOption === "RANDOM FOREST") {
            console.log("chegou");
            parametersColection = {
                n_estimators: "number",
                criterion: "text",
                max_depth: "number",
                random_state: "number"
            };
            
            datalistOptions = {
                n_estimators: [100, 150, 200, 250],
                criterion: ["squared_error", "absolute_error","friedman_mse", "poisson"],
                max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                random_state: [0, 1, 2, 3, 4, 5]
            };

            createParameters(4, parametersColection, datalistOptions);
        }
        else if (selectedOption === "XGBOOST") {
            console.log("chegou xg");
            parametersColection = {
                n_estimators: "number",
                max_depth: "number",
                learning_rate: "number",
                objective: "text",
                random_state: "number"
            };
            
            datalistOptions = {
                n_estimators: [100, 150, 200, 250],
                max_depth:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                objective: ["reg:squarederror", "reg:squaredlogerror", "reg:logistic", "reg:pseudohubererror", "reg:absoluteerror", "reg:quantileerror","reg:gamma","reg:tweedie", "count:poisson", "survival:cox", "survival:aft", "multi:softmax", "multi:softprob", "rank:ndcg", "rank:map", "rank:pairwise"],
                random_state: [0, 1, 2, 3, 4, 5]
            };

            createParameters(5, parametersColection, datalistOptions);
        }
        else if (selectedOption === "LIGHT GBM") {
            console.log("chegou");
            parametersColection = {
                num_leaves: "number",
                max_depth: "number",
                learning_rate: "number",
                n_estimators: "number",
                random_state: "number"
            };
            
            datalistOptions = {
                num_leaves: [100, 150, 200, 250],
                max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                n_estimators: [100, 150, 200, 250],
                random_state: [0, 1, 2, 3, 4, 5]      
            };

            createParameters(5, parametersColection, datalistOptions);
        }

        else if (selectedOption === "CATBOOST") {
            console.log("chegou");
            parametersColection = {
                iterations: "number",
                learning_rate: "number",
                depth: "number",
                random_state: "number",

            };
            
            datalistOptions = {
                iterations: [100, 150, 200, 250],
                learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                random_state: [0, 1, 2, 3, 4, 5],
            };

            createParameters(4, parametersColection, datalistOptions);
        }
        generateinfobox(name_algorithm)
    });

    async function generateinfobox(name_algorithm){
        const infoBox = document.getElementById("info-box");
        try {
            
            const resposta = await fetch('../static/json/algoritimos.json');
            const algoritmos = await resposta.json();
            const algoritmoEscolhido = name_algorithm;
            console.log(algoritmos[algoritmoEscolhido])
            

            const explicacao = algoritmos[algoritmoEscolhido].explicacao;
            const videoLink = algoritmos[algoritmoEscolhido].link;

            infoBox.style.display = "block";
            infoBox.innerHTML = `
                <p>O ${explicacao}</p>
                <a href="${videoLink}" target="_blank">Caso ainda tenha dúvidas, clique aqui para assistir à videoaula sobre ${name_algorithm}!</a>
            `;

        } catch (erro) {
            console.error("Erro ao carregar o arquivo JSON:", erro);
        }
        
        
    }    

    function createParameters(size,parametersColection, datalistOptions){
        const datalists = document.querySelectorAll('datalist');
        datalists.forEach(datalist => datalist.remove());

        const parametersDiv = document.getElementById("parameters");
        parametersDiv.innerHTML = "";

        var keys = Object.keys(parametersColection);
        for (var i = 0; i < size; i++) {
            console.log(keys[i]);
            console.log(parametersColection[keys[i]]);
            const parametersLabel = document.createElement("label");
            parametersLabel.textContent = keys[i] + ":";
            parametersDiv.appendChild(parametersLabel);
            const parametersInput = document.createElement("input");
            parametersInput.type = parametersColection[keys[i]];
            parametersInput.step = "0.0000000001";
            parametersInput.name = "parameters" + (i + 1);
            parametersInput.className  = "nes-input";

            if (datalistOptions[keys[i]]) {
                const datalistID = `datalist-${keys[i]}`;
                parametersInput.setAttribute("list", datalistID);
                
                const dataList = document.createElement("datalist");
                dataList.id = datalistID;

                datalistOptions[keys[i]].forEach((optionValue)=>{
                    const option = document.createElement("option");
                    option.value = optionValue;
                    dataList.appendChild(option);
                })

                parametersDiv.appendChild(dataList);
            }   


            parametersDiv.appendChild(parametersInput);
            parametersDiv.appendChild(document.createElement("br"));
            
        }
    } 

    csvFileInput.addEventListener("change", function () {
        // Se houver um arquivo CSV selecionado e a opção selecionada for "SIMPLE LINEAR"
        if (regressionSelect.value === "simple_linear_regression" || regressionSelect.value === "polynomial_regression" && csvFileInput.files.length > 0) {
            handleCSVFile(csvFileInput.files[0]);
            parametersColection = {}
        }
    });

    function handleCSVFile(file) {
        reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            var lines = contents.split("\n");
            if (lines.length > 0) {
                // Verifica o separador
                var separator = ",";
                if (lines[0].includes(",")) {
                    separator = ",";
                } else if (lines[0].includes(";")) {
                    separator = ";";
                } else {
                    console.error("Separador não reconhecido.");
                    return;
                }

                var headers = lines[0].split(separator);
                populateHeaders(headers);
            }
        };

        reader.readAsText(file);
    }

    function populateHeaders(headers) {
        var selectHTML = '<label for="csv_headers">Escolha a variável independente:</label>';
        selectHTML += '<select id="csv_headers" name="csv_headers">';

        headers.forEach(function (header) {
            selectHTML += '<option value="' + header + '">' + header + '</option>';
        });

        selectHTML += '</select>';
        parametersDiv.innerHTML = selectHTML;

        const Ivariable = document.getElementById("csv_headers");
        var options = Ivariable.options;

        // Adiciona o texto inicial na div posicaoDiv
        posicaoDiv.textContent = "feature1";

        // Adiciona o evento para atualizar a posição selecionada
        Ivariable.addEventListener("change", function () {
            for (var i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    posicaoDiv.textContent = "feature" + (i + 1);
                    break;
                }
            }
        });
    }




    function hideElement(element) {
        element.style.display = "none";
    }

    function showElement(element) {
        element.style.display = "block";
    }



    document
        .getElementById("csv_file")
        .addEventListener("change", function (event) {

            console.log("Evento de mudança detectado");
            const file = event.target.files[0];
            if (!file) {
                console.error("Nenhum arquivo selecionado.");
                return;
            }
            console.log("Arquivo selecionado: ", file);

            const reader = new FileReader();

            reader.onload = function (e) {
                const text = e.target.result;
                if (!text) {
                    console.error("Falha ao ler o arquivo.");
                    return;
                }
                console.log("Conteúdo do arquivo: ", text);

                const lines = text.split("\n");
                if (lines.length === 0) {
                    console.error("Arquivo CSV vazio ou inválido.");
                    return;
                }

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

                let header = lines[0].split(separator);
                if (lines.length < 2) {
                    console.error("Arquivo CSV não contém dados suficientes.");
                    return;
                }
              };
              filename = file.name.split(".csv")[0];
              csvToBase64(file, (base64) => {
                csvBase64 = base64;
              });
              reader.readAsText(file);
        });

    document
        .getElementById("prediction-form")
        .addEventListener("submit", function (event) {
            document.getElementById(
                "result"
            ).innerText = "";
            
            spinner.style.display = 'block';
            document.getElementById("result").innerText = "";

            event.preventDefault();
            const formData = new FormData(this);
            formData.append("separator", separator);
            formData.append("posicao", document.getElementById("posicao").textContent)
            formData.append("deployBoolean",deployBoolean)
            formData.append("crossVal",crossVal)

         
            fetch("/regressionPost", {
                method: "POST",
                body: formData,
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Erro ao fazer a solicitação.");
                    }
                    return response.json();
                })
                .then((data) => {
                    spinner.style.display = 'none';
                    let resultText = `
                        <div class="p-3 rounded border border-dark rounded-lg" style="width: fit-content;">
                            <p><strong>Coeficiente de determinação do treinamento:</strong> ${data.determinationCoefficientTraining}%</p>
                            <p><strong>Coeficiente de determinação do teste:</strong> ${data.determinationCoefficientTest}%</p>
                            <p><strong>Erro médio absoluto:</strong> ${data.abs}</p>
                            <p><strong>Raiz erro quadrático médio:</strong> ${data.MeanSquaredError}%</p>
                            ${crossVal === "true" ? `<p><strong>Acurácia validação cruzada:</strong> ${data.crossVal}%</p>` : ""}
                            ${data.prediction !== undefined && data.prediction !== null ? `<p><strong>Previsão:</strong> ${data.prediction}</p>` : ""}
                        </div>
                    `;

                   
                
                
                    document.getElementById("result").innerHTML = `<div class="preformatted-text">${resultText}</div>`;
                    
                    document.getElementById("windowcode").innerHTML = data.code;

                    
                    const classifier = formData.get('regression');
                    const parameters = {};
                    formData.forEach((value, key) => {
                        if (key.startsWith('parameters')) { // Filtra apenas as chaves que começam com 'parameters'
                            parameters[key] = value; // Adiciona ao objeto
                        }
                    });
                    const today = new Date();
                    const dataAtual = today.toISOString().split('T')[0];
                    
                    saveTransaction(classifier, filename,parameters,data.determinationCoefficientTraining,data.determinationCoefficientTest,data.abs,data.MeanSquaredError,btoa(data.code.replace(/<[^>]*>/g, '')),csvBase64,dataAtual, data.crossVal || "0")
                })                                           
                .catch((error) => {
                    console.error("Erro:", error);
                    document.getElementById(
                        "result"
                    ).innerText = `Erro: ${error.message}`;
                });
        });


});


function saveTransaction(Algorithm, NameDatabase, Parameters, CoefficientTraining, CoefficientTest,abs,MeanSquaredError,code, csv, date,CrossValidation) {
  
    const result = {};
    const values = Object.values(Parameters);
    Object.keys(parametersColection).forEach((key, index) => {
        result[key] = values[index]; 
    });



    
    const transaction = {
        Algorithm: Algorithm,
        NameDatabase: NameDatabase,
        Parameters:result,
        CoefficientTraining: CoefficientTraining,
        CoefficientTest: CoefficientTest,
        abs:abs,
        MeanSquaredError:MeanSquaredError,
        CrossValidation: CrossValidation,
        code:code,
        csv: csv,
        date: date,
        type: "Regressão",
        user: {
            uid: firebase.auth().currentUser.uid
        }
    }

    // Adicionar ao Firestore
    firebase.firestore()
        .collection('transactions')
        .add(transaction)
        .then(()=>{
            console.log("Cadastrado no DBA");
        })
        .catch(error =>{
            alert("Erro ao salvar transação!");
        })



}


radioButtons.forEach(radio=>{
    radio.addEventListener("change",()=>{
        gerarCheckBox(radio.value);
    });
});


function gerarCheckBox(typeAlg){
   const chat = document.getElementById("checkboxs");
   checkboxs.innerHTML="";
   key = values
   parametersAlg = valCheckBox[typeAlg]

    parametersAlg.forEach(val=>{
       

        const div = document.createElement('div');
        div.className="form-check form-check-inline"

        const input = document.createElement('input');
        input.type = "checkbox";
        input.id = val;
        input.name = val;
        input.value = typeAlg;
        input.className = "form-check-input";
        
        const label = document.createElement('label');
        label.className="form-check-label";
        label.htmlFor = val;

        label.textContent = val;

        div.appendChild(input);
        div.appendChild(label);

        chat.appendChild(div);

   
});
    

}


