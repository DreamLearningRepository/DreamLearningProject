let spinner = document.getElementById('spinner');
spinner.style.display = 'none';
var filename;
var parametersColection;
var datalistOptions;
var radioButtons = document.querySelectorAll('input[type="radio"]');
var csvBase64 = "";
var typeAlg ="";
const valCheckBox = {
    "Floresta Aleatória": ["n_estimator", "criterion", "random_state", "max_depht"],
    "SVM": ["kernel", "random_state", "C"],
    "Regressão Logistica": ["random_state", "max_iter", "penalty", "tol", "C", "solver"],
    "KNN": ["n_neighbors", "metric"],
    "Arvore de Decisão": ["criterion", "random_state", "max_depth"],
    "XGBOOST": ["max_depth", "learning_rate", "n_estimators", "objective", "random_state"],
    "LIGHTGBM": ["num_leaves", "objective", "max_depth", "learning_rate", "max_bin", "num_boost_round"],
    "CATBOOST": ["task_type", "iterations", "learning_rate", "depth", "random_state", "eval_metric"]
}

let values = Object.keys(valCheckBox);



const algoritmos = {
    "Naive Bayes": {
        explicacao: "O Naive Bayes é um algoritmo de aprendizado supervisionado baseado no teorema de Bayes, que é usado principalmente para classificação. Ele assume que as características do conjunto de dados são independentes entre si, o que simplifica o modelo, tornando-o rápido e eficaz, especialmente em problemas de texto, como a classificação de e-mails.",
        link: "https://www.youtube.com/watch?v=XXXXX"  // Substitua pelo link correto
    },
    "SVM": {
        explicacao: "O SVM (Support Vector Machine) é um poderoso algoritmo de aprendizado supervisionado utilizado principalmente para classificação e regressão. Ele busca encontrar o melhor hiperplano que separa as diferentes classes, maximizando a margem entre as classes.",
        link: "https://www.youtube.com/watch?v=YYYYY"  // Substitua pelo link correto
    },
    "Regressão Logística": {
        explicacao: "A Regressão Logística é um modelo estatístico usado para prever a probabilidade de uma variável dependente binária (com duas classes). Ao contrário da regressão linear, que prevê valores contínuos, a regressão logística estima a probabilidade de um evento ocorrer.",
        link: "https://www.youtube.com/watch?v=ZZZZZ"  // Substitua pelo link correto
    },
    "Regressão Simples": {
        explicacao: "A Regressão Simples é um modelo de aprendizado supervisionado utilizado para prever um valor contínuo com base em uma única variável independente. Ele tenta modelar a relação entre a variável dependente e a variável independente utilizando uma linha reta (linha de tendência).",
        link: "https://www.youtube.com/watch?v=AAAAA"  // Substitua pelo link correto
    },
    "Regressão Múltipla": {
        explicacao: "A Regressão Múltipla é uma extensão da regressão simples que usa várias variáveis independentes para prever um valor contínuo. O modelo ajusta uma equação linear para minimizar o erro entre as previsões e os valores reais.",
        link: "https://www.youtube.com/watch?v=BBBBB"  // Substitua pelo link correto
    },
    "Regressão Polinomial": {
        explicacao: "A Regressão Polinomial é uma forma de regressão que utiliza um polinômio em vez de uma linha reta para modelar a relação entre a variável dependente e as variáveis independentes. Isso é útil quando os dados têm uma relação não linear.",
        link: "https://www.youtube.com/watch?v=CCCCC"  // Substitua pelo link correto
    },
    "KNN": {
        explicacao: "O KNN (K-Nearest Neighbors) é um algoritmo de aprendizado supervisionado que classifica dados com base na proximidade de dados já rotulados. Para prever a classe de um ponto de dados, o KNN analisa os 'K' pontos de dados mais próximos e atribui a classe que ocorre com mais frequência entre esses vizinhos.",
        link: "https://www.youtube.com/watch?v=DDDDD"  // Substitua pelo link correto
    },
    "Árvore de Decisão": {
        explicacao: "A Árvore de Decisão é um algoritmo de aprendizado supervisionado utilizado para classificação e regressão. Ele constrói um modelo em forma de árvore, onde cada nó interno representa uma 'pergunta' sobre os dados, e as folhas representam a decisão ou previsão.",
        link: "https://www.youtube.com/watch?v=EEEEE"  // Substitua pelo link correto
    },
    "XGBoost": {
        explicacao: "O XGBoost é um algoritmo de aprendizado supervisionado baseado no método de Gradient Boosting. Ele é altamente eficiente e eficaz, sendo utilizado para tarefas de classificação e regressão. XGBoost constrói árvores de decisão de forma sequencial, corrigindo os erros cometidos pelas árvores anteriores, o que o torna muito poderoso em competições de aprendizado de máquina.",
        link: "https://www.youtube.com/watch?v=FFFFF"  // Substitua pelo link correto
    },
    "LightGBM": {
        explicacao: "O LightGBM é uma implementação eficiente de Gradient Boosting que usa uma técnica de 'grafting' (divisão em nível de folhas) para melhorar a velocidade e a eficiência do modelo. Ele é particularmente útil em grandes conjuntos de dados e tem um desempenho muito rápido, com menos uso de memória.",
        link: "https://www.youtube.com/watch?v=GGGGG"  // Substitua pelo link correto
    },
    "CatBoost": {
        explicacao: "O CatBoost é um algoritmo de aprendizado supervisionado baseado em Gradient Boosting, projetado para lidar com dados categóricos de forma eficiente. Ele automatiza o pré-processamento de variáveis categóricas e oferece excelente desempenho em uma ampla gama de problemas de aprendizado de máquina.",
        link: "https://www.youtube.com/watch?v=HHHHH"  // Substitua pelo link correto
    }
};



function csvToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
}






document.addEventListener("DOMContentLoaded", function () {

    var separator = "";
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


    document
        .getElementById("classifier")
        .addEventListener("change", function (event) {
            var select = document.querySelector("#classifier");
            var option = select.children[select.selectedIndex];
            var textClassifier = option.textContent;

            if (textClassifier === "Random Forest") {
                parametersColection = {
                    n_estimators: "number",
                    criterion: "text",
                    random_state: "number",
                    max_depth: "number",
                };

                datalistOptions = {
                    n_estimators: [100, 150, 200, 250],
                    criterion: ["gini", "entropy", "log_loss"],
                    random_state: [0, 1, 2, 3, 4, 5],
                    max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                };

                createParameters(4, parametersColection, datalistOptions);
                
                generateinfobox(textClassifier)

            }

            if (textClassifier === "SVM") {
                console.log("chegou");
                parametersColection = {
                    kernel: "text",
                    random_state: "number",
                    C: "number",
                };

                datalistOptions = {
                    kernel: ["linear", "poly", "rbf", "sigmoid", "precomputed"],
                    random_state: [0, 1, 2, 3, 4, 5],
                    C: [1, 2, 5, 10]
                };

                createParameters(3, parametersColection, datalistOptions);
            }

            if (textClassifier === "LOGISTICS REGRESSION") {
                console.log("chegou");
                parametersColection = {
                    random_state: "number",
                    max_iter: "number",
                    penalty: "text",
                    tol: "number",
                    C: "number",
                    solver: "text",
                };

                datalistOptions = {
                    random_state: [0, 1, 2, 3, 4, 5],
                    max_iter: [100, 200, 300, 400, 500],
                    penalty: ["l1", "l2"],
                    tol: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                    C: [1, 2, 5, 10],
                    solver: ["lbfgs", "liblinear", "newton-cg", "newton-cholesky", "sag", "saga"]
                };

                createParameters(6, parametersColection, datalistOptions);
            }

            if (textClassifier === "KNN") {
                console.log("chegou");
                parametersColection = {
                    n_neighbors: "number",
                    metric: "text",
                };

                datalistOptions = {
                    n_neighbors: [1, 3, 5, 7, 9],
                    metric: ["minkowski", "euclidean", "manhattan", "chebyshev", "hamming", "cosine"]
                };

                createParameters(2, parametersColection, datalistOptions);
            }

            if (textClassifier === "DECISION TREE") {
                console.log("chegou");
                parametersColection = {
                    criterion: "text",
                    random_state: "number",
                    max_depth: "text",
                };

                datalistOptions = {
                    criterion: ["gini", "entropy", "log_loss"],
                    random_state: [0, 1, 2, 3, 4, 5],
                    max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                };

                createParameters(3, parametersColection, datalistOptions);
            }

            if (textClassifier === "XGBOOST") {
                console.log("chegou");
                parametersColection = {
                    max_depth: "number",
                    learning_rate: "number",
                    n_estimators: "number",
                    objective: "text",
                    random_state: "number",
                };

                datalistOptions = {
                    max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                    n_estimators: [100, 150, 200, 250],
                    objective: ["binary:logistic", "binary:logitraw", "binary:hinge", "count:poisson", "survival:cox", "survival:aft", "multi:softmax", "multi:softprob", "rank:ndcg", "rank:map", "rank:pairwise"],
                    random_state: [0, 1, 2, 3, 4, 5]
                };

                createParameters(5, parametersColection, datalistOptions);
            }

            if (textClassifier === "LIGHTGBM") {
                console.log("chegou");
                parametersColection = {
                    num_leaves: "number",
                    objective: "text",
                    max_depth: "number",
                    learning_rate: "number",
                    max_bin: "number",
                    num_boost_round: "number",
                };

                datalistOptions = {
                    num_leaves: [100, 150, 200, 250],
                    objective: ["binary", "multiclass", "multiclassova", "ova", "xentropy", "xentlambda"],
                    max_depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                    max_bin: [100, 150, 200, 250],
                    num_boost_round: [100, 150, 200, 250],
                };

                createParameters(6, parametersColection, datalistOptions);
            }

            if (textClassifier === "CATBOOST") {
                console.log("chegou");
                parametersColection = {
                    task_type: "text",
                    iterations: "number",
                    learning_rate: "number",
                    depth: "number",
                    random_state: "number",
                    eval_metric: "text",
                };

                datalistOptions = {
                    task_type: ["CPU", "GPU"],
                    iterations: [100, 150, 200, 250],
                    learning_rate: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
                    depth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    random_state: [0, 1, 2, 3, 4, 5],
                    eval_metric: ["Accuracy", "Logloss", "AUC"],
                };

                createParameters(6, parametersColection, datalistOptions);
            }
        });

    function generateinfobox(name_algorithm){
        const infoBox = document.getElementById("info-box");
        infoBox.style.display = "block";
        infoBox.innerHTML = `
            <p>O ${name_algorithm} (K-Nearest Neighbors) é um algoritmo de aprendizado supervisionado que classifica dados com base na proximidade de dados já rotulados.</p>
            <a href="https://www.youtube.com/watch?v=XXXXX" target="_blank">Caso ainda tenha dúvidas, clique aqui para assistir à videoaula sobre ${name_algorithm}!</a>
        `;
    }    

    function createParameters(size, parametersColection, datalistOptions) {
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
            parametersInput.className = "nes-input";

            if (datalistOptions[keys[i]]) {
                const datalistID = `datalist-${keys[i]}`;
                parametersInput.setAttribute("list", datalistID);

                const dataList = document.createElement("datalist");
                dataList.id = datalistID;

                datalistOptions[keys[i]].forEach((optionValue) => {
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
            spinner.style.display = 'block';
            document.getElementById("result").innerText = "";
            event.preventDefault();
            const formData = new FormData(this);
            formData.append("separator", separator);
            formData.append("deployBoolean", deployBoolean);
            formData.append("crossVal", crossVal);


            fetch("/predict", {
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

                    
                    document.getElementById("result").innerText = "";
                    spinner.style.display = 'none';


                    let resultText = `
                    <div class="p-3 rounded border border-dark rounded-lg mx-auto">
                        <p><strong>Acuracia teste:</strong> ${data.accuracy_test}%</p>
                        <p><strong>Acuracia treino:</strong> ${data.accuracy_training}%</p>
                        ${crossVal === "true" ? `<p><strong>Acurácia validação cruzada:</strong> ${data.crossVal}%</p>` : ""}
                        ${data.prediction !== undefined && data.prediction !== null ? `<p><strong>Previsão:</strong> ${data.prediction}</p>` : ""}
                    </div>
                `;


                    console.log(data.prediction)
                    
                    document.getElementById("result").innerHTML = `<div class="preformatted-text">${"<p>" + resultText + "</p>"} 
                    <h4>Matriz confusão Treino</h4>
                    </div> <div class="container my-3">
                        <div class="row">
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTraning[0][0]}</div>
                            </div>
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTraning[0][1]}</div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTraning[1][0]}</div>
                            </div>
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTraning[1][1]}</div>
                            </div>
                        </div>
                        </div>
                        <br>
                        <h4>Matriz confusão Teste</h4>
                    </div> <div class="container my-3">
                        <div class="row">
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTest[0][0]}</div>
                            </div>
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTest[0][1]}</div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTest[1][0]}</div>
                            </div>
                            <div class="col-6">
                            <div class="border border-dark p-3">${data.confusionMatrixTest[1][1]}</div>
                            </div>
                        </div>
                        </div>
                        
                        `;
                    document.getElementById("windowcode").innerHTML = data.code;





                    const classifier = formData.get('classifier');
                    const parameters = {};
                    formData.forEach((value, key) => {
                        if (key.startsWith('parameters')) { // Filtra apenas as chaves que começam com 'parameters'
                            parameters[key] = value; // Adiciona ao objeto
                        }
                    });
                    const today = new Date();
                    const dataAtual = today.toISOString().split('T')[0];



                    saveTransaction(classifier, data.crossVal || "0", filename, parameters, data.accuracy_test, data.accuracy_training,btoa(data.code.replace(/<[^>]*>/g, '')),csvBase64, dataAtual)


                })
                .catch((error) => {
                    console.error("Erro:", error);
                    document.getElementById(
                        "result"
                    ).innerText = `Erro: ${error.message}`;
                });
        });
});





function saveTransaction(Algorithm, CrossValidation, NameDatabase, Parameters, TestAccuracy, TrainingAccuracy,code, csvBase64,date) {

    const result = {};
    const values = Object.values(Parameters);
    Object.keys(parametersColection).forEach((key, index) => {
        result[key] = values[index];
    });



    // Criar a transação
    const transaction = {
        Algorithm: Algorithm,
        CrossValidation: CrossValidation,
        NameDatabase: NameDatabase,
        Parameters: result,
        TestAccuracy: TestAccuracy,
        TrainingAccuracy: TrainingAccuracy,
        code:code,
        csv: csvBase64,
        date: date,
        type: "Classificação",
        user: {
            uid: firebase.auth().currentUser.uid
        }
    }

    // Adicionar ao Firestore
    firebase.firestore()
        .collection('transactions')
        .add(transaction)
        .then(() => {
            console.log("Cadastrado no DBA");
        })
        .catch(error => {
            alert("Erro ao salvar transação!");
        })
}


radioButtons.forEach(radio => {
    radio.addEventListener("change", () => {
        typeAlg =  radio.value;
        gerarCheckBox(typeAlg);
    });
});


function gerarCheckBox(typeAlg) {
    const chat = document.getElementById("checkboxs");
    checkboxs.innerHTML = "";
    key = values
    parametersAlg = valCheckBox[typeAlg]

    parametersAlg.forEach(val => {


        const div = document.createElement('div');
        div.className = "form-check form-check-inline"

        const input = document.createElement('input');
        input.type = "checkbox";
        input.id = val;
        input.name = val;
        input.value = typeAlg;
        input.className = "form-check-input";

        const label = document.createElement('label');
        label.className = "form-check-label";
        label.htmlFor = val;

        label.textContent = val;

        div.appendChild(input);
        div.appendChild(label);

        chat.appendChild(div);


    });
}






