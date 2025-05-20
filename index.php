<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuizHub - Scegli il tuo test</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4361ee;
      --primary-dark: #3a56d4;
      --secondary: #4cc9f0;
      --danger: #f72585;
      --success: #2ec4b6;
      --dark: #212529;
      --light: #f8f9fa;
      --shadow: 0 10px 20px rgba(0,0,0,0.1);
      --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      color: var(--dark);
    }

    .container {
      max-width: 800px;
      width: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: var(--shadow);
      overflow: hidden;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    header {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      padding: 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    header::after {
      content: "";
      position: absolute;
      bottom: -50px;
      left: -50px;
      width: 150px;
      height: 150px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    header::before {
      content: "";
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    h1 {
      font-size: 2.2rem;
      margin-bottom: 10px;
      font-weight: 700;
      position: relative;
      z-index: 1;
    }

    .subtitle {
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 300;
      position: relative;
      z-index: 1;
    }

    .tests-container {
      padding: 30px;
    }

    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .test-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      transition: var(--transition);
      border: 1px solid rgba(0,0,0,0.05);
      position: relative;
    }

    .test-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }

    .test-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
    }

    .test-content {
      padding: 25px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .test-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
      color: var(--primary);
    }

    .test-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 10px;
      color: var(--dark);
    }

    .test-desc {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 20px;
      flex-grow: 1;
    }

    .test-link {
      display: inline-block;
      padding: 12px 20px;
      background: var(--primary);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      text-align: center;
      transition: var(--transition);
      align-self: flex-start;
    }

    .test-link:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 5px 10px rgba(67, 97, 238, 0.3);
    }

    .test-link i {
      margin-left: 8px;
      transition: transform 0.3s ease;
    }

    .test-link:hover i {
      transform: translateX(3px);
    }

    footer {
      text-align: center;
      padding: 20px;
      color: #666;
      font-size: 0.9rem;
      border-top: 1px solid rgba(0,0,0,0.05);
    }

    @media (max-width: 600px) {
      header {
        padding: 20px;
      }
      
      h1 {
        font-size: 1.8rem;
      }
      
      .test-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
  <div class="container">
    <header>
      <h1>Benvenuto in QuizHub</h1>
      <p class="subtitle">Scegli il test che preferisci e mettiti alla prova</p>
    </header>
    
    <div class="tests-container">
      <div class="test-grid">
        <div class="test-card">
          <div class="test-content">
            <div class="test-icon">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="test-title">Cybersicurezza</h3>
            <p class="test-desc">Metti alla prova le tue conoscenze sulla sicurezza informatica con domande su hacking, crittografia e best practices.</p>
            <a href="test_cyber/index.html" class="test-link">
              Inizia test <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <div class="test-card">
          <div class="test-content">
            <div class="test-icon">
              <i class="fas fa-brain"></i>
            </div>
            <h3 class="test-title">Logica</h3>
            <p class="test-desc">Sfida il tuo pensiero critico con problemi logici, sequenze numeriche e rompicapi stimolanti.</p>
            <a href="test_logica/index.html" class="test-link">
              Inizia test <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
        
        <div class="test-card">
          <div class="test-content">
            <div class="test-icon">
              <i class="fas fa-laptop-code"></i>
            </div>
            <h3 class="test-title">Informatica</h3>
            <p class="test-desc">Verifica la tua conoscenza dei fondamenti dell'informatica, dai linguaggi di programmazione all'hardware.</p>
            <a href="test_informatica/index.html" class="test-link">
              Inizia test <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <footer>
      <p>QuizHub &copy; 2023 - Sviluppato con <i class="fas fa-heart" style="color: var(--danger);"></i></p>
    </footer>
  </div>
</body>
</html>
