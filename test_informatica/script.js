
document.addEventListener("DOMContentLoaded", () => {
  // Elementi DOM
  const UI = {
    quizContainer: document.getElementById("quiz"),
    inviaBtn: document.getElementById("invia"),
    nomeInput: document.getElementById("nome"),
    msgElement: document.getElementById("messaggio"),
    stampaBtn: document.getElementById("stampa")
  };

  // Stato dell'applicazione
  const state = {
    domandeSelezionate: [],
    risposteCorrette: {},
    quizInviato: false
  };

  // Utility functions
  const domUtils = {
    showError: (message) => {
      UI.msgElement.innerHTML = message;
      UI.msgElement.className = "message-error";
      UI.msgElement.style.display = "block";
    },

    showSuccess: (message) => {
      UI.msgElement.innerHTML = message;
      UI.msgElement.className = "message-success";
      UI.msgElement.style.display = "block";
    },

    resetStyles: () => {
      document.querySelectorAll(".domanda").forEach(div => {
        div.style.border = "";
        div.style.padding = "";
        div.style.borderRadius = "";
      });

      document.querySelectorAll("label").forEach(label => {
        label.style.backgroundColor = "";
      });
    },

    disableInputs: (disabled) => {
      document.querySelectorAll("input[type=radio]").forEach(radio => {
        radio.disabled = disabled;
      });
      UI.inviaBtn.disabled = disabled;
    }
  };

  // Quiz functions
  const quiz = {
    loadQuestions: async () => {
      try {
        const response = await fetch("domande_info.json");
        if (!response.ok) throw new Error("Errore nel caricamento delle domande");

        const domande = await response.json();
        const domandeValide = domande.filter(q => 
          q.domanda?.trim() && 
          Array.isArray(q.scelte) && 
          q.scelte.length >= 2 &&
          Number.isInteger(q.corretta) && 
          q.corretta >= 0 && 
          q.corretta < q.scelte.length
        );

        if (domandeValide.length < 15) {
          throw new Error("Database insufficiente: servono almeno 15 domande valide");
        }

        return domandeValide;
      } catch (error) {
        console.error("Quiz loading error:", error);
        domUtils.showError(error.message);
        return null;
      }
    },

    selectRandomQuestions: (domande, count = 15) => {
      const shuffled = [...domande];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.slice(0, count);
    },

    renderQuestion: (question, index) => {
      const div = document.createElement("div");
      div.className = "domanda mb-4 p-3 border rounded";
      div.id = `domanda-${index}`;

      const questionId = `domanda-${index}-title`;
      div.innerHTML = `
        <h3 id="${questionId}" class="h5 mb-3">
          <span class="badge bg-primary me-2">${index + 1}</span>
          ${question.domanda}
        </h3>
        <div class="options" role="group" aria-labelledby="${questionId}">
          ${question.scelte.map((option, i) => `
            <div class="form-check mb-2">
              <input class="form-check-input" 
                     type="radio" 
                     name="domanda-${index}" 
                     id="domanda-${index}-opzione-${i}"
                     value="${option.replace(/"/g, '&quot;')}">
              <label class="form-check-label w-100" for="domanda-${index}-opzione-${i}">
                ${option}
              </label>
            </div>
          `).join("")}
        </div>
      `;

      return div;
    },

    calculateScore: () => {
      let punteggio = 0;
      const risposteUtente = [];

      state.domandeSelezionate.forEach((_, i) => {
        const selected = document.querySelector(`input[name="domanda-${i}"]:checked`);
        risposteUtente[i] = selected?.value || null;

        if (selected?.value === state.risposteCorrette[i]) {
          punteggio++;
        }
      });

      return { punteggio, risposteUtente };
    },

    highlightResults: () => {
      state.domandeSelezionate.forEach((_, i) => {
        const selected = document.querySelector(`input[name="domanda-${i}"]:checked`);
        const options = document.querySelectorAll(`input[name="domanda-${i}"]`);

        options.forEach(option => {
          const label = option.closest(".form-check");
          if (!label) return;

          if (option.value === state.risposteCorrette[i]) {
            label.style.backgroundColor = "#d4edda";
          } else if (selected && option === selected) {
            label.style.backgroundColor = "#f8d7da";
          }
        });

        if (!selected) {
          const questionDiv = document.getElementById(`domanda-${i}`);
          if (questionDiv) {
            questionDiv.style.border = "2px solid #ffc107";
            questionDiv.style.backgroundColor = "#fff3cd";
          }
        }
      });
    },

    submitResults: async (nome, punteggio, percentuale, risposte) => {
      try {
        const response = await fetch("risultati.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: nome.trim(),
            punteggio,
            percentuale,
            risposte,
            timestamp: Date.now()
          })
        });

        if (!response.ok) throw new Error("Errore nell'invio dei risultati");
        return true;
      } catch (error) {
        console.error("Submission error:", error);
        return false;
      }
    }
  };

  const initQuiz = async () => {
    const domande = await quiz.loadQuestions();
    if (!domande) return;

    state.domandeSelezionate = quiz.selectRandomQuestions(domande);
    UI.quizContainer.innerHTML = "";

    state.domandeSelezionate.forEach((domanda, index) => {
      state.risposteCorrette[index] = domanda.scelte[domanda.corretta];
      UI.quizContainer.appendChild(quiz.renderQuestion(domanda, index));
    });

    domUtils.disableInputs(false);
    state.quizInviato = false;
  };

  const handleSubmit = async () => {
    if (state.quizInviato) return;

    domUtils.resetStyles();

    const nome = UI.nomeInput.value.trim();
    if (!nome) {
      domUtils.showError("Per favore, inserisci il tuo nome prima di continuare");
      UI.nomeInput.focus();
      return;
    }

    const { punteggio, risposteUtente } = quiz.calculateScore();
    const percentuale = Math.round((punteggio / state.domandeSelezionate.length) * 100);

    quiz.highlightResults();
    domUtils.disableInputs(true);
    state.quizInviato = true;

    const success = await quiz.submitResults(nome, punteggio, percentuale, risposteUtente);
    if (!success) {
      domUtils.showError("Errore nel salvataggio dei risultati. Riprova più tardi.");
      return;
    }

    const message = `Hai risposto correttamente a <strong>${punteggio}</strong> su <strong>${state.domandeSelezionate.length}</strong> domande (${percentuale}%)`;
    percentuale >= 60 ? domUtils.showSuccess(message) : domUtils.showError(message);

    UI.stampaBtn.style.display = "inline-block";
    UI.stampaBtn.focus();
  };

  UI.inviaBtn.addEventListener("click", handleSubmit);
  UI.nomeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSubmit();
  });
  UI.stampaBtn.addEventListener("click", () => {
    window.print();
  });


  initQuiz();
});
