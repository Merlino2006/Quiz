// quiz.js

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // UI Elements
  const UI = {
    quizContainer: document.getElementById("quiz"),
    inviaBtn: document.getElementById("invia"),
    nomeInput: document.getElementById("nome"),
    msgElement: document.getElementById("messaggio"),
    stampaBtn: document.getElementById("stampa"),
    timerElement: document.getElementById("timer"),
    progressBar: document.getElementById("progress-bar")
  };

  // App State
  const state = {
    domandeSelezionate: [],
    risposteCorrette: [],
    quizInviato: false,
    tempoRimanente: 600, // 10 minutes
    timerInterval: null
  };

  // Inject custom styles for the quiz
  const styles = {
    init: function() {
      const style = document.createElement('style');
      style.textContent = `
        .quiz-card {
          background: linear-gradient(145deg, #2c3e50, #34495e);
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          margin-bottom: 20px;
          overflow: hidden;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .quiz-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.4);
        }
        .question-number {
          background: #e74c3c;
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 10px;
        }
        .question-text {
          font-size: 1.1rem;
          margin-bottom: 15px;
          color: #ecf0f1;
        }
        .option-label {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .option-label:hover {
          background: rgba(255,255,255,0.2);
        }
        .option-input {
          margin-right: 10px;
          transform: scale(1.2);
        }
        .correct-answer {
          background: rgba(46, 204, 113, 0.3) !important;
          border-left: 4px solid #2ecc71;
        }
        .wrong-answer {
          background: rgba(231, 76, 60, 0.3) !important;
          border-left: 4px solid #e74c3c;
        }
        .unanswered {
          border: 2px solid #f39c12;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { border-color: #f39c12; }
          50% { border-color: #f1c40f; }
          100% { border-color: #f39c12; }
        }
        #progress-bar {
          height: 6px;
          background: #3498db;
          width: 0%;
          transition: width 0.5s ease;
          border-radius: 3px;
          margin-bottom: 20px;
        }
      `;
      document.head.appendChild(style);
    }
  };

  styles.init();

  // Utility functions
  const utils = {
    showMessage: (text, type = 'info') => {
      const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
      };
      UI.msgElement.innerHTML = `
        <div class="alert" style="background: ${colors[type]}; color: white; padding: 15px; border-radius: 8px;">
          ${text}
        </div>
      `;
    },
    disableInputs: (disabled) => {
      document.querySelectorAll("input").forEach(input => {
        input.disabled = disabled;
      });
      UI.inviaBtn.disabled = disabled;
    },
    startTimer: () => {
      if (!UI.timerElement) return;
      state.timerInterval = setInterval(() => {
        state.tempoRimanente--;
        const min = Math.floor(state.tempoRimanente / 60);
        const sec = state.tempoRimanente % 60;
        UI.timerElement.innerHTML = `
          <i class="fas fa-clock"></i> Tempo rimanente: 
          <span style="color: ${state.tempoRimanente < 120 ? '#e74c3c' : '#2ecc71'}; font-weight: bold;">
            ${min}:${sec < 10 ? '0' : ''}${sec}
          </span>
        `;
        if (state.tempoRimanente <= 0) {
          clearInterval(state.timerInterval);
          handleSubmit();
          utils.showMessage("Tempo scaduto! Il quiz è stato inviato automaticamente.", 'warning');
        }
      }, 1000);
    },
    updateProgress: () => {
      const answered = document.querySelectorAll('input[type="radio"]:checked').length;
      const total = state.domandeSelezionate.length;
      const percent = Math.round((answered / total) * 100);
      UI.progressBar.style.width = `${percent}%`;
      UI.progressBar.setAttribute('aria-valuenow', percent);
    }
  };

  const quiz = {
    loadQuestions: async () => {
      try {
        const response = await fetch("domande_database.json");
        if (!response.ok) throw new Error("Errore nel caricamento delle domande");
        return await response.json();
      } catch (error) {
        console.error("Error:", error);
        utils.showMessage("Errore nel caricamento delle domande. Riprova più tardi.", 'error');
        return [];
      }
    },
    renderQuestion: (question, index) => {
      const div = document.createElement("div");
      div.className = "quiz-card";
      div.innerHTML = `
        <div class="question-number">Domanda ${index + 1}</div>
        <div class="question-text">${question.domanda}</div>
        <div class="options">
          ${question.scelte.map((scelta, i) => `
            <label class="option-label">
              <input class="option-input" type="radio" name="domanda-${index}" value="${scelta}">
              ${scelta}
            </label>
          `).join("")}
        </div>
      `;
      div.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', utils.updateProgress);
      });
      return div;
    },
    calculateScore: () => {
      let punteggio = 0;
      state.domandeSelezionate.forEach((d, i) => {
        const rispostaUtente = document.querySelector(`input[name="domanda-${i}"]:checked`);
        if (rispostaUtente && rispostaUtente.value === state.risposteCorrette[i]) {
          punteggio++;
        }
      });
      return punteggio;
    },
    showResults: (punteggio, total) => {
      const percentuale = Math.round((punteggio / total) * 100);
      const isPassed = percentuale >= 60;
      UI.quizContainer.innerHTML = `
        <div class="result-card text-center p-5" style="background: linear-gradient(135deg, ${isPassed ? '#2ecc71' : '#e74c3c'}, ${isPassed ? '#27ae60' : '#c0392b'}); border-radius: 10px; color: white; margin-bottom: 30px;">
          <h2 style="font-weight: bold;">Risultati del Quiz</h2>
          <div style="font-size: 3rem; margin: 20px 0;">${punteggio}/${total}</div>
          <div style="font-size: 2rem; margin-bottom: 20px;">${percentuale}%</div>
          <div style="font-size: 1.5rem;">${isPassed ? '🎉 Complimenti! Hai superato il quiz!' : '😟 Riprova, puoi fare meglio!'}</div>
        </div>
      `;
      utils.showMessage(`Hai totalizzato ${punteggio}/${total} (${percentuale}%)`, isPassed ? 'success' : 'error');
    },
    highlightAnswers: () => {
      state.domandeSelezionate.forEach((d, i) => {
        const rispostaUtente = document.querySelector(`input[name="domanda-${i}"]:checked`);
        document.querySelectorAll(`input[name="domanda-${i}"]`).forEach(input => {
          const label = input.parentElement;
          if (input.value === state.risposteCorrette[i]) {
            label.classList.add('correct-answer');
          } else if (rispostaUtente && input === rispostaUtente) {
            label.classList.add('wrong-answer');
          }
        });
        if (!rispostaUtente) {
          const questionDiv = document.querySelectorAll('.quiz-card')[i];
          if (questionDiv) questionDiv.classList.add('unanswered');
        }
      });
    }
  };

  const handleSubmit = () => {
    if (state.quizInviato) return;
    state.quizInviato = true;
    clearInterval(state.timerInterval);

    const nome = UI.nomeInput.value.trim();
    if (!nome) {
      utils.showMessage("Per favore, inserisci il tuo nome prima di inviare il quiz.", 'error');
      state.quizInviato = false;
      return;
    }

    const punteggio = quiz.calculateScore();
    quiz.highlightAnswers();
    quiz.showResults(punteggio, state.domandeSelezionate.length);
    utils.disableInputs(true);
    UI.stampaBtn.style.display = "inline-block";

    fetch("risultati.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome,
        punteggio: punteggio,
        percentuale: Math.round((punteggio / state.domandeSelezionate.length) * 100),
        timestamp: new Date().toISOString()
      })
    }).catch(error => console.error("Error submitting results:", error));
  };

  const initQuiz = async () => {
    const domande = await quiz.loadQuestions();
    if (domande.length === 0) return;
    state.domandeSelezionate = domande.sort(() => 0.5 - Math.random()).slice(0, 15);
    state.risposteCorrette = state.domandeSelezionate.map(d => d.scelte[d.corretta]);
    UI.quizContainer.innerHTML = '';
    state.domandeSelezionate.forEach((domanda, i) => {
      UI.quizContainer.appendChild(quiz.renderQuestion(domanda, i));
    });
    utils.disableInputs(false);
    utils.startTimer();
    utils.updateProgress();
  };

  UI.inviaBtn.addEventListener("click", handleSubmit);
  UI.nomeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSubmit();
  });
  UI.stampaBtn.addEventListener("click", () => window.print());

  initQuiz();
});
